import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private usuarioService: UsuarioService

  ) {}

  isLogged(): boolean {
    return this.usuarioService.isLogged();
  }

  getUser(): string | null {
    return this.usuarioService.getUsuario();
  }

  esAdmin(): boolean {
    const res = this.usuarioService.getUserData();
    return res && res.role_id == 10;
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  cerrarSesion() {
        this.usuarioService.logout();
        alert('Su sesión ha finalizado.');
        this.router.navigate(['/login']);
  }

}