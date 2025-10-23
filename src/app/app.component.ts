import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FIFA Players Manager';
  showNavbar = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Detectar cambios de ruta para mostrar/ocultar navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !event.url.includes('/login');
    });
  }

  logout(): void {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}