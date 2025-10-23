import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaJugadoresComponent } from './lista-jugadores/lista-jugadores.component';
import { DetalleJugadorComponent } from './detalle-jugador/detalle-jugador.component';
import { EditarJugadorComponent } from './editar-jugador/editar-jugador.component';
import { CrearJugadorComponent } from './crear-jugador/crear-jugador.component';

const routes: Routes = [
  { path: '', component: ListaJugadoresComponent },
  { path: 'crear', component: CrearJugadorComponent },
  { path: 'detalle/:id', component: DetalleJugadorComponent },
  { path: 'editar/:id', component: EditarJugadorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JugadoresRoutingModule { }