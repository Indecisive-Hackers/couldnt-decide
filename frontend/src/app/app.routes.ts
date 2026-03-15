import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const home = {
    path: '',
    component: HomeComponent
};

const arena = {
    path: 'arena',
    loadComponent: () => import('./debate/arena/debate-arena.component').then(m => m.DebateArenaComponent)
};

export const routes: Routes = [home, arena];
