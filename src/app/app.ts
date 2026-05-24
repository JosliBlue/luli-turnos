import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SeoService } from '@src/app/core/seo/seo.service';
import { Footer } from '@src/app/shared/footer/footer';
import { Header } from '@src/app/shared/header/header';

@Component({
    selector: 'app-root',
    imports: [Header, Footer, RouterOutlet],
    templateUrl: './app.html',
})
export class App implements OnInit {
    private readonly seo = inject(SeoService);

    ngOnInit(): void {
        this.seo.applyDefaults();
    }
}
