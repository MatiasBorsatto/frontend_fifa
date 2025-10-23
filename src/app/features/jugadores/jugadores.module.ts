import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresRoutingModule } from './jugadores-routing.module';
import { ListaJugadoresComponent } from './lista-jugadores/lista-jugadores.component';
import { DetalleJugadorComponent } from './detalle-jugador/detalle-jugador.component';
import { EditarJugadorComponent } from './editar-jugador/editar-jugador.component';
import { CrearJugadorComponent } from './crear-jugador/crear-jugador.component';

@NgModule({
  imports: [
    CommonModule,
    JugadoresRoutingModule,
    // Standalone components
    ListaJugadoresComponent,
    DetalleJugadorComponent,
    EditarJugadorComponent,
    CrearJugadorComponent
  ]
})
export class JugadoresModule { }