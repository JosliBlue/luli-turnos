import { Component, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-calendario',
    imports: [],
    templateUrl: './calendario.html',
    styleUrl: './calendario.scss',
})
export class Calendario implements OnInit {
    public mesActual: string = '';
    public readonly diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    public readonly diasSeleccionados = signal<string[]>(this.diasSemana.filter((dia) => dia !== 'DOMINGO'));

    ngOnInit(): void {
        this.mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    }

    public get columnasGrid(): string {
        return `repeat(${this.diasSeleccionados().length || 1}, minmax(0, 1fr))`;
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
    }
}
