import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";

const home = {
    path: '',
    component: HomeComponent,
}

const register = {
    path: "register",
    component: RegisterComponent,
}

export const routes: Routes = [home, register];
