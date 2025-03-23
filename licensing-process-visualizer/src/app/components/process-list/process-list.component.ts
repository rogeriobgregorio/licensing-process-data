import { Component, OnInit } from '@angular/core';
import { ProcessDataService } from '../../services/process-data.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css'],
  standalone: false, 
})

export class ProcessListComponent implements OnInit {
  processes: any[] = [];
  jsonUrl = 'assets/data/listOfProcesses.json';

  constructor(private processDataService: ProcessDataService) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(): void {
  this.processDataService.getProcesses(this.jsonUrl).subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.processes = data;
        console.log('Dados dos processos:', this.processes); 
      } else {
        this.processes = [];
        console.warn('Dados inválidos recebidos para processos.');
      }
    },
    error: (error) => {
      this.processes = [];
      console.error('Erro ao carregar os processos:', error);
    },
    complete: () => {
      console.log('Processos carregados com sucesso');
    }
  });
}

  changeFile(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.jsonUrl = target.value;
    this.loadProcesses();
  }

  // Método para adaptar a estrutura dos dados
  transformData(data: any[]): any[] {
    return data.map(item => {
      const transformedItem = {
        nP: item.nP || 'N/A',
        created_at: item.created_at || 'Data não disponível',
        title: item.title || 'Título não disponível',
        lastEvent: item.lastEvent || item.lastDestination || 'Último evento não disponível',
        lastUser: item.lastUser || 'Usuário não disponível',
        lastSector: item.lastSector || 'Setor não disponível'
      };
      return transformedItem;
    });
  }
}