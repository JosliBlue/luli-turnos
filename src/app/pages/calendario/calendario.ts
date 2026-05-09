import { Component, OnInit, signal } from '@angular/core';

interface DiaCalendarioCard {
    tipo: 'vacio' | 'dia';
    numeroDia?: number;
    texto?: string;
}

/** Un objeto por clave "año-mes" (mes 0-11); cada mes tiene día -> texto. */
type AlmacenCalendario = Record<string, Record<string, string>>;

@Component({
    selector: 'app-calendario',
    imports: [],
    templateUrl: './calendario.html',
    styleUrl: './calendario.scss',
})
export class Calendario implements OnInit {
    private static readonly STORAGE_KEY = 'luli-turnos-calendario-textos';

    public mesActual: string = '';
    public readonly diasSemana = [
        'LUNES',
        'MARTES',
        'MIÉRCOLES',
        'JUEVES',
        'VIERNES',
        'SÁBADO',
        'DOMINGO',
    ];
    public readonly diasSeleccionados = signal<string[]>(
        this.diasSemana.filter((dia) => dia !== 'DOMINGO')
    );
    public diasCalendario: DiaCalendarioCard[] = [];
    public diaEnEdicion: number | null = null;
    public borradorTexto: string = '';
    private textosPorDia: Record<number, string> = {};

    ngOnInit(): void {
        const hoy = new Date();
        this.cargarMesDesdeAlmacenamiento(hoy.getFullYear(), hoy.getMonth());
        this.mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(hoy);
        this.generarCalendarioDesdeHoy();
    }

    public toggleDia(dia: string): void {
        this.diasSeleccionados.update((actuales) => {
            const yaExiste = actuales.includes(dia);

            if (yaExiste) {
                if (actuales.length === 1) {
                    return actuales;
                }

                return actuales.filter((d) => d !== dia);
            }

            return this.diasSemana.filter((d) => [...actuales, dia].includes(d));
        });

        this.generarCalendarioDesdeHoy();
    }

    public get columnasGrid(): string {
        return `repeat(${this.diasSeleccionados().length || 1}, minmax(0, 1fr))`;
    }

    public iniciarEdicion(celda: DiaCalendarioCard): void {
        if (celda.tipo !== 'dia' || celda.numeroDia === undefined) {
            return;
        }

        this.diaEnEdicion = celda.numeroDia;
        this.borradorTexto = this.textosPorDia[celda.numeroDia] ?? '';

        // Espera al render del input para enfocarlo automaticamente.
        setTimeout(() => {
            const input = document.getElementById(
                `texto-dia-${celda.numeroDia}`
            ) as HTMLInputElement | null;
            input?.focus();
            input?.select();
        });
    }

    public actualizarBorrador(evento: Event): void {
        const input = evento.target as HTMLInputElement | null;
        this.borradorTexto = input?.value ?? '';
    }

    public guardarEdicion(numeroDia: number | undefined): void {
        if (numeroDia === undefined) {
            return;
        }

        this.textosPorDia[numeroDia] = this.borradorTexto.trim();
        this.diaEnEdicion = null;
        this.persistirTextosActual();
        this.generarCalendarioDesdeHoy();
    }

    public imprimirHorario(): void {
        if (this.diaEnEdicion !== null) {
            this.guardarEdicion(this.diaEnEdicion);
        }
        setTimeout(() => window.print(), 0);
    }

    /** Vacía todo el `localStorage` del navegador en este origen y reinicia el calendario. */
    public limpiarTodoLocalStorage(): void {
        try {
            localStorage.clear();
        } catch {
            /* noop */
        }
        this.textosPorDia = {};
        this.diaEnEdicion = null;
        this.borradorTexto = '';
        this.generarCalendarioDesdeHoy();
    }

    public irConTab(evento: Event, numeroDia: number | undefined): void {
        if (numeroDia === undefined) {
            return;
        }

        const eventoTeclado = evento as KeyboardEvent;
        eventoTeclado.preventDefault();
        this.textosPorDia[numeroDia] = this.borradorTexto.trim();
        this.persistirTextosActual();

        const diasEditables = this.diasCalendario
            .filter((celda) => celda.tipo === 'dia' && celda.numeroDia !== undefined)
            .map((celda) => celda.numeroDia as number);

        const indiceActual = diasEditables.indexOf(numeroDia);
        if (indiceActual === -1) {
            this.diaEnEdicion = null;
            this.generarCalendarioDesdeHoy();
            return;
        }

        const paso = eventoTeclado.shiftKey ? -1 : 1;
        const indiceSiguiente = indiceActual + paso;

        if (indiceSiguiente < 0 || indiceSiguiente >= diasEditables.length) {
            this.diaEnEdicion = null;
            this.generarCalendarioDesdeHoy();
            return;
        }

        const siguienteDia = diasEditables[indiceSiguiente];
        this.diaEnEdicion = siguienteDia;
        this.borradorTexto = this.textosPorDia[siguienteDia] ?? '';
        this.generarCalendarioDesdeHoy();

        setTimeout(() => {
            const input = document.getElementById(
                `texto-dia-${siguienteDia}`
            ) as HTMLInputElement | null;
            input?.focus();
            input?.select();
        });
    }

    private generarCalendarioDesdeHoy(): void {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = hoy.getMonth();
        const ultimoDiaMes = new Date(anio, mes + 1, 0).getDate();
        const seleccionados = this.diasSeleccionados();
        const indicesSeleccionados = this.diasSemana
            .map((dia, indice) => (seleccionados.includes(dia) ? indice : -1))
            .filter((indice) => indice !== -1);
        const indicePrimerDiaMes = this.obtenerIndiceSemana(new Date(anio, mes, 1));

        const celdas: DiaCalendarioCard[] = [];

        // Recorremos por semanas completas (lunes->domingo) para alinear
        // siempre desde lunes aunque el mes comience otro dia.
        let inicioSemana = 1 - indicePrimerDiaMes;
        while (inicioSemana <= ultimoDiaMes) {
            for (let indiceDiaSemana = 0; indiceDiaSemana < 7; indiceDiaSemana++) {
                if (!indicesSeleccionados.includes(indiceDiaSemana)) {
                    continue;
                }

                const numeroDia = inicioSemana + indiceDiaSemana;

                if (numeroDia < 1 || numeroDia > ultimoDiaMes) {
                    celdas.push({ tipo: 'vacio' });
                    continue;
                }

                celdas.push({
                    tipo: 'dia',
                    numeroDia,
                    texto: this.textosPorDia[numeroDia] ?? '',
                });
            }
            inicioSemana += 7;
        }

        this.diasCalendario = celdas;
    }

    private obtenerIndiceSemana(fecha: Date): number {
        // Convierte JS (domingo=0) a inicio en lunes (lunes=0).
        return (fecha.getDay() + 6) % 7;
    }

    private claveMes(anio: number, mes: number): string {
        return `${anio}-${mes}`;
    }

    private leerAlmacenamientoCompleto(): AlmacenCalendario {
        try {
            const raw = localStorage.getItem(Calendario.STORAGE_KEY);
            if (!raw) {
                return {};
            }
            const parsed: unknown = JSON.parse(raw);
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return {};
            }
            return parsed as AlmacenCalendario;
        } catch {
            return {};
        }
    }

    private cargarMesDesdeAlmacenamiento(anio: number, mes: number): void {
        const todo = this.leerAlmacenamientoCompleto();
        const mesData = todo[this.claveMes(anio, mes)];
        this.textosPorDia = {};
        if (!mesData) {
            return;
        }
        for (const [diaStr, texto] of Object.entries(mesData)) {
            const dia = Number(diaStr);
            if (!Number.isNaN(dia)) {
                this.textosPorDia[dia] = texto;
            }
        }
    }

    private persistirTextosActual(): void {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = hoy.getMonth();
        const todo = this.leerAlmacenamientoCompleto();
        const clave = this.claveMes(anio, mes);
        const obj: Record<string, string> = {};

        for (const [diaStr, valor] of Object.entries(this.textosPorDia)) {
            const t = String(valor).trim();
            if (t) {
                obj[diaStr] = t;
            }
        }

        if (Object.keys(obj).length === 0) {
            delete todo[clave];
        } else {
            todo[clave] = obj;
        }

        try {
            localStorage.setItem(Calendario.STORAGE_KEY, JSON.stringify(todo));
        } catch {
            /* espacio lleno u origen opaco */
        }
    }
}
