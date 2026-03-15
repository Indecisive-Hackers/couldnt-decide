import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {SelectionComponent} from "./selection/selection.component";

const home = {
    path: '',
    component: HomeComponent
};

const arena = {
    path: 'arena',
    loadComponent: () => import('./debate/setup/debate-setup.component').then(m => m.DebateSetupComponent)
};

const selection = {
    path: 'selection',
    component: SelectionComponent
}

export const routes: Routes = [home, arena, selection];
