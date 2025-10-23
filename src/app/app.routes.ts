import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'jugadores',
    loadChildren: () => import('./features/jugadores/jugadores.module').then(m => m.JugadoresModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];