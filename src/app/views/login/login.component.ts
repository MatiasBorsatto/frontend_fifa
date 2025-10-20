import { Component, importProvidersFrom  } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router
  ) {}

  async submitLogin(form: NgForm) { 
    if (form.invalid) {
      alert("Completa todos los campos correctamente.")
      return;
    }

    const { email, password } = form.value;

    try {
     
      const res = await this.usuarioService.login({ email, password });

      if (res.status === 200 || res.token) {
        alert('¡Bienvenido!, login exitoso.');
        setTimeout(() => {
          this.router.navigate(['/player-manager']);  
        }, 300);
      } else {
        throw new Error('Respuesta inválida');  
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      let mensaje = 'Verifique sus credenciales.';
      if (error.status === 401) {
        mensaje = 'Email o contraseña incorrectos.';
      } else if (error.status === 500) {
        mensaje = 'Error en el servidor. Intenta más tarde.';
      } else {
        mensaje = error.message || 'No se pudo iniciar sesión.';
      }
      alert(mensaje);
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}