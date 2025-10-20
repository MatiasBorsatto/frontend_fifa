import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ManagerComponent } from './views/manager/manager.component';


export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'register',
        component: RegisterComponent
    },

    {
        path: 'player-manager',
        component: ManagerComponent
    },

    {
        path:'',    //si la url esta vacia redirige a la landing
        redirectTo:'login',
        pathMatch:'full'
    },

    {
        path:'**',  // si no reconoce la ruta redirige a la landing
        component: LoginComponent
    }

];