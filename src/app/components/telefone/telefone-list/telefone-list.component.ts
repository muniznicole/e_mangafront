import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Telefone } from '../../../models/telefone.model';
import { TelefoneService } from '../../../services/telefone.service';

@Component({
  selector: 'app-telefone-list',
  standalone: true,
  imports: [
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './telefone-list.component.html',
  styleUrls: ['./telefone-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class TelefoneListComponent implements OnInit {
  
  telefones: Telefone[] = [];
  displayedColumns: string[] = ['idTelefone', 'codegoDeArea', 'numero', 'acao'];

  // Variáveis para paginação
  page: number = 0; // página atual
  size: number = 10; // número de itens por página

  constructor(private telefoneService: TelefoneService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar se a operação foi bem-sucedida
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadTelefones(this.page, this.size);
      }
    });
    this.loadTelefones(this.page, this.size);
  }

  loadTelefones(page: number, size: number): void {
    this.telefoneService.findAll(page, size).subscribe(
      data => { this.telefones = data; },
      error => { console.error('Erro ao carregar telefones', error); }
    );
  }

  deletar(idTelefone: number): void {
    if (confirm('Tem certeza que deseja excluir este telefone?')) {
      this.telefoneService.delete(idTelefone).subscribe({
        next: () => this.loadTelefones(this.page, this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir telefone', error);
          alert('Erro ao excluir telefone: ' + error.message);
        }
      });
    }
  }
}