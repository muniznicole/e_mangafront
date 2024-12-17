import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './estado-list.component.html',
  styleUrls: ['./estado-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EstadoListComponent implements OnInit {
  
  estados: Estado[] = [];
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];

  // Variáveis para paginação
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private estadoService: EstadoService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadEstados(this.page, this.size);
      }
    });
    this.loadEstados(this.page, this.size);
    this.estadoService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  loadEstados(page: number, size: number): void {
    this.estadoService.findAll(page, size).subscribe(
      data => { this.estados = data; },
      error => { console.error('Erro ao carregar estados', error); }
    );
  }

  deletar(id: number): void {
    if (confirm('Tem certeza que deseja excluir este estado?')) {
      this.estadoService.delete(id).subscribe({
        next: () => this.loadEstados(this.page, this.size ), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir estado', error);
          alert('Erro ao excluir estado: ' + error.message);
        }
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size  = event.pageSize;
    this.ngOnInit();
  }
}

