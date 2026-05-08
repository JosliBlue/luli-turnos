import { Component } from '@angular/core';
import { Header } from '@src/app/shared/header/header';
import { Calendario } from "@src/app/pages/calendario/calendario";

@Component({
    selector: 'app-root',
    imports: [Header, Calendario],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
