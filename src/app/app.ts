import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@src/app/shared/footer/footer';
import { Header } from '@src/app/shared/header/header';

@Component({
    selector: 'app-root',
    imports: [Header, Footer, RouterOutlet],
    templateUrl: './app.html',
})
export class App {}
