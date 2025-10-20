import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor( 
    private usuarioService : UsuarioService,
    private router : Router ) {}

  submitRegister(form: NgForm) {
      if (form.invalid) return;
      const { email, password } = form.value;
      this.usuarioService.register({ email, password }).subscribe({
        next: (res) => {
          alert('Creación de usuario exitoso.');
          setTimeout(()=>{ this.router.navigate(['/login'])}, 300);
        },
        error: (err) => {
          alert('Error al intentar crear el usuario.');
        }
      });
    }

    navigate(route: string): void {
    this.router.navigate([route]);
  }

}