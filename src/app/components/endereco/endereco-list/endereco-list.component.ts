import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Endereco } from '../../../models/endereco.model';
import { EnderecoService } from '../../../services/endereco.service';

@Component({
  selector: 'app-endereco-list',
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
  templateUrl: './endereco-list.component.html',
  styleUrls: ['./endereco-list.component.css']
})
export class EnderecoListComponent implements OnInit {

  enderecos: Endereco[] = [];
  displayedColumns: string[] = ['idEndereco', 'cep', 'logradouro','complemento','bairro','idMunicipio', 'acao'];

  // Variáveis para paginação
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private enderecoService: EnderecoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadEnderecos(this.page, this.size);
      }
    });
    this.loadEnderecos(this.page, this.size);
    this.enderecoService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  loadEnderecos(page:number, size:number): void {
    this.enderecoService.findAll(page, size).subscribe(
      data => { this.enderecos = data; },
      error => { console.error('Erro ao carregar os endereços', error); }
    );
  }

  deletar(idEndereco: number): void {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.enderecoService.delete(idEndereco).subscribe({
        next: () => this.loadEnderecos(this.page,this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir este endereço', error);
          alert('Erro ao excluir este endereço: ' + error.message);
        }
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.ngOnInit();
  }
}
