import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JugadorService } from '../../../core/services/jugador.service';
import { Jugador } from '../../../shared/models/jugador.model';

@Component({
  selector: 'app-editar-jugador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-jugador.component.html',
  styleUrls: ['./editar-jugador.component.scss']
})
export class EditarJugadorComponent implements OnInit {
  jugadorForm: FormGroup;
  jugadorId: number | null = null;
  loading = false;
  errorMessage = '';

  posicionesDisponibles = ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK', 'LM', 'RM', 'LWB', 'RWB'];
  pieOptions = ['Right', 'Left'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jugadorService: JugadorService
  ) {
    this.jugadorForm = this.fb.group({
      // Información básica
      long_name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(15), Validators.max(50)]],
      player_positions: ['', Validators.required],
      club_name: ['', Validators.required],
      nationality_name: ['', Validators.required],
      overall: ['', [Validators.required, Validators.min(40), Validators.max(99)]],
      potential: ['', [Validators.required, Validators.min(40), Validators.max(99)]],
      preferred_foot: ['', Validators.required],
      height_cm: ['', [Validators.min(150), Validators.max(220)]],
      weight_kg: ['', [Validators.min(50), Validators.max(120)]],
      
      // Habilidades principales
      pace: ['', [Validators.min(0), Validators.max(99)]],
      shooting: ['', [Validators.min(0), Validators.max(99)]],
      passing: ['', [Validators.min(0), Validators.max(99)]],
      dribbling: ['', [Validators.min(0), Validators.max(99)]],
      defending: ['', [Validators.min(0), Validators.max(99)]],
      physic: ['', [Validators.min(0), Validators.max(99)]],
      
      // Estadísticas detalladas
      attacking_crossing: ['', [Validators.min(0), Validators.max(99)]],
      attacking_finishing: ['', [Validators.min(0), Validators.max(99)]],
      skill_dribbling: ['', [Validators.min(0), Validators.max(99)]],
      movement_acceleration: ['', [Validators.min(0), Validators.max(99)]],
      power_shot_power: ['', [Validators.min(0), Validators.max(99)]],
      mentality_aggression: ['', [Validators.min(0), Validators.max(99)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jugadorId = +id;
      this.cargarJugador(this.jugadorId);
    }
  }

  cargarJugador(id: number): void {
    this.loading = true;
    
    this.jugadorService.obtenerJugadorPorId(id).subscribe({
      next: (response) => {
        const jugador = response.jugador || response;
        this.jugadorForm.patchValue(jugador);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando jugador:', error);
        this.errorMessage = 'Error al cargar el jugador';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.jugadorForm.valid && this.jugadorId) {
      this.loading = true;
      this.errorMessage = '';

      const datosActualizados = this.jugadorForm.value;

      this.jugadorService.actualizarJugador(this.jugadorId, datosActualizados).subscribe({
        next: () => {
          alert('Jugador actualizado correctamente');
          this.router.navigate(['/jugadores/detalle', this.jugadorId]);
        },
        error: (error) => {
          console.error('Error actualizando jugador:', error);
          this.errorMessage = error.error?.error || 'Error al actualizar el jugador';
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
    if (this.jugadorId) {
      this.router.navigate(['/jugadores/detalle', this.jugadorId]);
    } else {
      this.router.navigate(['/jugadores']);
    }
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
}