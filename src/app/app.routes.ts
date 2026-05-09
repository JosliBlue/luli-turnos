import { Routes } from '@angular/router';

import { Calendario } from '@src/app/pages/calendario/calendario';

export const routes: Routes = [
    { path: '', component: Calendario },
    { path: '**', redirectTo: '' },
];
