import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JugadorService } from '../../../core/services/jugador.service';

@Component({
  selector: 'app-crear-jugador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-jugador.component.html',
  styleUrls: ['./crear-jugador.component.scss']
})
export class CrearJugadorComponent {
  jugadorForm: FormGroup;
  loading = false;
  errorMessage = '';

  posicionesDisponibles = ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK', 'LM', 'RM', 'LWB', 'RWB'];
  pieOptions = ['Right', 'Left'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jugadorService: JugadorService
  ) {
    this.jugadorForm = this.fb.group({
      // Información básica
      long_name: ['', [Validators.required, Validators.minLength(3)]],
      age: [25, [Validators.required, Validators.min(15), Validators.max(50)]],
      player_positions: ['', Validators.required],
      club_name: ['', Validators.required],
      nationality_name: ['', Validators.required],
      overall: [70, [Validators.required, Validators.min(40), Validators.max(99)]],
      potential: [75, [Validators.required, Validators.min(40), Validators.max(99)]],
      preferred_foot: ['Right', Validators.required],
      height_cm: [175, [Validators.min(150), Validators.max(220)]],
      weight_kg: [70, [Validators.min(50), Validators.max(120)]],
      
      // Habilidades principales (valores por defecto)
      pace: [70, [Validators.min(0), Validators.max(99)]],
      shooting: [70, [Validators.min(0), Validators.max(99)]],
      passing: [70, [Validators.min(0), Validators.max(99)]],
      dribbling: [70, [Validators.min(0), Validators.max(99)]],
      defending: [70, [Validators.min(0), Validators.max(99)]],
      physic: [70, [Validators.min(0), Validators.max(99)]],
      
      // Estadísticas detalladas
      attacking_crossing: [70, [Validators.min(0), Validators.max(99)]],
      attacking_finishing: [70, [Validators.min(0), Validators.max(99)]],
      skill_dribbling: [70, [Validators.min(0), Validators.max(99)]],
      movement_acceleration: [70, [Validators.min(0), Validators.max(99)]],
      power_shot_power: [70, [Validators.min(0), Validators.max(99)]],
      mentality_aggression: [70, [Validators.min(0), Validators.max(99)]]
    });
  }

  onSubmit(): void {
    if (this.jugadorForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const nuevoJugador = this.jugadorForm.value;

      this.jugadorService.crearJugador(nuevoJugador).subscribe({
        next: (response) => {
          alert('¡Jugador creado exitosamente!');
          this.router.navigate(['/jugadores']);
        },
        error: (error) => {
          console.error('Error creando jugador:', error);
          this.errorMessage = error.error?.error || 'Error al crear el jugador';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.jugadorForm.controls).forEach(key => {
      const control = this.jugadorForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/jugadores']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jugadorForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.jugadorForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return 'Este campo es requerido';
    if (field.hasError('min')) return `Valor mínimo: ${field.errors?.['min'].min}`;
    if (field.hasError('max')) return `Valor máximo: ${field.errors?.['max'].max}`;
    if (field.hasError('minlength')) return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;

    return '';
  }

  // Método para autocompletar con tu información
  autocompletarMisDatos(): void {
    this.jugadorForm.patchValue({
      long_name: 'Tu Nombre Aquí', // Cambia esto por tu nombre
      age: 25,
      player_positions: 'CAM',
      club_name: 'Tu Club Favorito',
      nationality_name: 'Argentina',
      overall: 85,
      potential: 90,
      preferred_foot: 'Right',
      height_cm: 178,
      weight_kg: 75,
      pace: 85,
      shooting: 88,
      passing: 90,
      dribbling: 92,
      defending: 45,
      physic: 70,
      attacking_crossing: 85,
      attacking_finishing: 88,
      skill_dribbling: 92,
      movement_acceleration: 87,
      power_shot_power: 85,
      mentality_aggression: 65
    });
  }
}