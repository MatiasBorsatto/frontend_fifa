import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JugadorService } from '../../../core/services/jugador.service';
import { Jugador } from '../../../shared/models/jugador.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-detalle-jugador',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-jugador.component.html',
  styleUrls: ['./detalle-jugador.component.scss']
})
export class DetalleJugadorComponent implements OnInit, AfterViewInit {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  
  jugador: Jugador | null = null;
  loading = false;
  
  private radarChart: Chart | null = null;
  private barChart: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jugadorService: JugadorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarJugador(+id);
    }
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán después de cargar el jugador
  }

  cargarJugador(id: number): void {
    this.loading = true;
    
    this.jugadorService.obtenerJugadorPorId(id).subscribe({
      next: (response) => {
        this.jugador = response.jugador || response;
        // Esperar un momento para que el DOM se actualice
        setTimeout(() => this.crearGraficos(), 100);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando jugador:', error);
        alert('Error al cargar el jugador');
        this.loading = false;
        this.router.navigate(['/jugadores']);
      }
    });
  }

  crearGraficos(): void {
    if (!this.jugador) return;

    this.crearGraficoRadar();
    this.crearGraficoBarras();
  }

  crearGraficoRadar(): void {
    if (!this.jugador || !this.radarCanvas) return;

    // Destruir gráfico anterior si existe
    if (this.radarChart) {
      this.radarChart.destroy();
    }

    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Velocidad', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'],
        datasets: [{
          label: 'Habilidades',
          data: [
            this.jugador.pace || 0,
            this.jugador.shooting || 0,
            this.jugador.passing || 0,
            this.jugador.dribbling || 0,
            this.jugador.defending || 0,
            this.jugador.physic || 0
          ],
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgb(102, 126, 234)',
          pointBackgroundColor: 'rgb(102, 126, 234)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(102, 126, 234)',
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            }
          }
        }
      }
    });
  }

  crearGraficoBarras(): void {
    if (!this.jugador || !this.barCanvas) return;

    // Destruir gráfico anterior si existe
    if (this.barChart) {
      this.barChart.destroy();
    }

    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Aceleración', 'Finalización', 'Pase Corto', 'Control', 'Potencia Tiro', 'Agresividad'],
        datasets: [{
          label: 'Estadísticas Detalladas',
          data: [
            this.jugador.movement_acceleration || 0,
            this.jugador.attacking_finishing || 0,
            this.jugador.attacking_short_passing || 0,
            this.jugador.skill_ball_control || 0,
            this.jugador.power_shot_power || 0,
            this.jugador.mentality_aggression || 0
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://cdn.sofifa.net/player_0.png';
  }

  volver(): void {
    this.router.navigate(['/jugadores']);
  }

  editar(): void {
    if (this.jugador?.id) {
      this.router.navigate(['/jugadores/editar', this.jugador.id]);
    }
  }

  getOverallColor(overall: number): string {
    if (overall >= 85) return '#4caf50';
    if (overall >= 75) return '#ff9800';
    return '#f44336';
  }

  getPotentialDifference(): number {
    if (this.jugador) {
      return (this.jugador.potential || 0) - (this.jugador.overall || 0);
    }
    return 0;
  }

  ngOnDestroy(): void {
    if (this.radarChart) {
      this.radarChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  getPlayerImage(): string {
  if (this.jugador?.player_face_url && this.jugador.player_face_url.trim() !== '') {
    return this.jugador.player_face_url;
  }
  return '../../../../assets/default-player.svg';
} }