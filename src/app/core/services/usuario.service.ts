
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  isAuthenticated = false;
  private authToken: string | null = null;
  private email: string | null = null;
  private userData: any = null;
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  async login(data: { email: string; password: string }): Promise<any> {
    try {
      const resp$ = this.http.post(`${this.apiUrl}/login`, data); 
      const body: any = await lastValueFrom(resp$); 
      if (body && (body.status === 200 || body.token)) {
        this.setSession(body); 
        console.log(body);  // Ya lo tienes, OK para debug
        this.isAuthenticated = true;
        return body;  
      } else {
        throw new Error(body.message || 'Respuesta inválida del servidor');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      this.logout();
      throw error;  
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authToken = null;
    this.email = null;  // Agregado: Limpia email
    this.userData = null;  // Agregado: Limpia userData
    this.router.navigate(['/login']);
  }

  register(data: { email : string, password : string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  isLogged(): boolean {
    return this.isAuthenticated;
  }

  getUsuario(): string | null {
    return this.email;
  }

  getToken(): string | null {
    return this.authToken;
  }

  // ¡FIX CLAVE: Ajustado para tu response del backend
  setSession(body: any): void {
    // Verifica token y que body.usuario exista (tu estructura: { token, usuario: { email, ... } })
    if (body.token && body.usuario && body.usuario.email) {
      this.isAuthenticated = true;
      this.authToken = body.token;
      this.email = body.usuario.email;  // Extrae de body.usuario.email
      this.userData = body.usuario;  // userData = { email, id, nombre, role_id? }
      
      console.log('Sesión seteada: isAuthenticated=true, email=', this.email);  // Log mínimo para debug (quita después)
    } else {
      console.error('setSession falló: Falta token o body.usuario.email');  // Debug si falla
      console.log('Body recibido:', body);  // Muestra qué llega
    }
  }

  getUserData(): any {
    return this.userData;
  }
}
