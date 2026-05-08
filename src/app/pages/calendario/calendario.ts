import { Component, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-calendario',
    imports: [],
    templateUrl: './calendario.html',
    styleUrl: './calendario.scss',
})
export class Calendario implements OnInit {
    public mesActual: string = '';

    ngOnInit(): void {
        this.mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    }
}
