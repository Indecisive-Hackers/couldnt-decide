import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

const home = {
    path: '',
    component: HomeComponent
};

const arena = {
    path: 'arena',
    loadComponent: () => import('./debate/setup/debate-setup.component').then(m => m.DebateSetupComponent)
};

const login = {
    path: 'login',
    component: LoginComponent
}

const register = {
    path: 'register',
    component: RegisterComponent
}

export const routes: Routes = [home, arena];
