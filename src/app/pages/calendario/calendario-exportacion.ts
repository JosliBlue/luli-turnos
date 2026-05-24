import { domToBlob } from 'modern-screenshot';

const CAPTURE_SCALE = 2;

function esperarRender(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}

/** Captura el horario con estilos de impresión y lo devuelve como PNG. */
export async function capturarHorarioComoImagen(elemento: HTMLElement): Promise<Blob> {
    const contenedor = document.createElement('div');
    contenedor.style.cssText =
        'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;overflow:visible;';

    const clon = elemento.cloneNode(true) as HTMLElement;
    clon.classList.add('calendario-exportacion');

    const marco = document.createElement('div');
    marco.style.cssText =
        'padding:1cm;background:#ffffff;box-sizing:border-box;display:inline-block;';
    marco.appendChild(clon);
    contenedor.appendChild(marco);
    document.body.appendChild(contenedor);

    try {
        await esperarRender();

        const blob = await domToBlob(marco, {
            scale: CAPTURE_SCALE,
            backgroundColor: '#ffffff',
            type: 'image/png',
        });

        if (!blob) {
            throw new Error('No se pudo generar la imagen.');
        }

        return blob;
    } finally {
        document.body.removeChild(contenedor);
    }
}

export function descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
    URL.revokeObjectURL(url);
}
