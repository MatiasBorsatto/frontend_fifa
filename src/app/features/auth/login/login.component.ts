import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Agregar ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/jugadores']);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Error al iniciar sesión';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const { password, confirmPassword } = this.registerForm.value;
      
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      
      const { email } = this.registerForm.value;
      
      this.authService.register(email, password).subscribe({
        next: () => {
          alert('Registro exitoso. Por favor, inicia sesión.');
          this.isLoginMode = true;
          this.registerForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Error al registrarse';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }
}