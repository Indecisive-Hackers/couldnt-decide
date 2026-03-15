import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const home = {
    path: '',
    component: HomeComponent
};

const setup = {
    path: 'setup',
    loadComponent: () => import('./debate/setup/debate-setup.component').then(m => m.DebateSetupComponent)
};

const arena = {
    path: 'arena',
    loadComponent: () => import('./debate/arena/debate-arena.component').then(m => m.DebateArenaComponent)
};

export const routes: Routes = [home, setup, arena];
