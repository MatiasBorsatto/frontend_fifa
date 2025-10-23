import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JugadorService } from '../../../core/services/jugador.service';
import { Jugador } from '../../../shared/models/jugador.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-jugadores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-jugadores.component.html',
  styleUrls: ['./lista-jugadores.component.scss']
})
export class ListaJugadoresComponent implements OnInit {
  jugadores: Jugador[] = [];
  loading = false;
  
  // Filtros
  filtroNombre = '';
  filtroClub = '';
  filtroPosicion = '';
  
  // Paginación
  paginaActual = 1;
  itemsPorPagina = 20;
  totalJugadores = 0;

  posicionesDisponibles = ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB', 'GK'];

  constructor(
    private jugadorService: JugadorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
  this.loading = true;

  const filtros = {
    nombre: this.filtroNombre,
    club: this.filtroClub,
    posicion: this.filtroPosicion,
    pagina: this.paginaActual,
    porPagina: this.itemsPorPagina
  };

  this.jugadorService.obtenerJugadores(filtros).subscribe({
    next: (response) => {
      this.jugadores = response.jugador || [];
      this.totalJugadores = response.total || 0;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error cargando jugadores:', error);
      this.loading = false;
      alert('Error al cargar jugadores');
    }
  });
}


  aplicarFiltrosLocales(): void {
    let jugadoresFiltrados = [...this.jugadores];

    // Filtro por nombre
    if (this.filtroNombre.trim()) {
      const nombre = this.filtroNombre.toLowerCase();
      jugadoresFiltrados = jugadoresFiltrados.filter(j => 
        j.long_name?.toLowerCase().includes(nombre)
      );
    }

    // Filtro por club
    if (this.filtroClub.trim()) {
      const club = this.filtroClub.toLowerCase();
      jugadoresFiltrados = jugadoresFiltrados.filter(j => 
        j.club_name?.toLowerCase().includes(club)
      );
    }

    // Filtro por posición
    if (this.filtroPosicion) {
      jugadoresFiltrados = jugadoresFiltrados.filter(j => 
        j.player_positions?.includes(this.filtroPosicion)
      );
    }

    this.totalJugadores = jugadoresFiltrados.length;
    
    // Aplicar paginación
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.jugadores = jugadoresFiltrados.slice(inicio, fin);
  }

 aplicarFiltros(): void {
  this.paginaActual = 1;
  this.cargarJugadores(); // Ahora sí va al backend con los filtros
}

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroClub = '';
    this.filtroPosicion = '';
    this.paginaActual = 1;
    this.cargarJugadores();
  }

  cambiarPagina(pagina: number): void {
  if (pagina >= 1 && pagina <= this.totalPaginas) {
    this.paginaActual = pagina;
    this.cargarJugadores(); // Carga los jugadores de esa página desde el backend
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

  exportarCSV(): void {
    if (this.jugadores.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const datosExportar = this.jugadores.map(j => ({
      'ID': j.id,
      'Nombre': j.long_name,
      'Edad': j.age,
      'Club': j.club_name,
      'Posición': j.player_positions,
      'Nacionalidad': j.nationality_name,
      'Overall': j.overall,
      'Potencial': j.potential,
      'Pie Preferido': j.preferred_foot,
      'Velocidad': j.pace,
      'Tiro': j.shooting,
      'Pase': j.passing,
      'Regate': j.dribbling,
      'Defensa': j.defending,
      'Físico': j.physic
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Jugadores');
    
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `jugadores_fifa_${fecha}.xlsx`);
  }

  verDetalle(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/jugadores/detalle', id]);
    }
  }

  irACrear(): void {
    this.router.navigate(['/jugadores/crear']);
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalJugadores / this.itemsPorPagina);
  }

  get paginasArray(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const rango = 2; // páginas a mostrar a cada lado
    
    let inicio = Math.max(1, actual - rango);
    let fin = Math.min(total, actual + rango);
    
    const paginas: number[] = [];
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

 getPlayerImage(jugador: Jugador): string {
  
  // Verificar si tiene URL y no está vacía
  if (jugador.player_face_url && jugador.player_face_url.trim() !== '') {
    return jugador.player_face_url;
  }
  
  // Imagen por defecto de SoFIFA
  return 'https://cdn.sofifa.net/players/158/023/25_120.png';
}

  // Agregar este método a la clase ListaJugadoresComponent
onImageError(event: any) {
  if (!event.target.src.includes('default-player.png')) {
    event.target.src = '../../../../assets/default-player.svg';
  }
} }