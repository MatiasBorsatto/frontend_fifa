import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador, FiltrosJugador } from '../../shared/models/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  obtenerJugadores(filtros?: FiltrosJugador): Observable<any> {
    let params = new HttpParams();
    
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.club) params = params.set('club', filtros.club);
      if (filtros.posicion) params = params.set('posicion', filtros.posicion);
      if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
      if (filtros.porPagina) params = params.set('porPagina', filtros.porPagina.toString());
    }

    return this.http.get(`${this.apiUrl}/obtener-jugadores`, { params });
  }

  obtenerJugadorPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener-jugador/${id}`);
  }

  crearJugador(jugador: Jugador): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-jugador`, jugador);
  }

  actualizarJugador(id: number, jugador: Partial<Jugador>): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificar-jugador/${id}`, jugador);
  }
}