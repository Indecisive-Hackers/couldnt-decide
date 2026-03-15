import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const home = {
    path: '',
    component: HomeComponent
};

const arena = {
    path: 'arena',
    loadComponent: () => import('./debate/setup/debate-setup.component').then(m => m.DebateSetupComponent)
};

export const routes: Routes = [home, arena];
