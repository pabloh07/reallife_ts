import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Aluno {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-escolher-aluno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escolher-aluno.component.html',
  styleUrls: ['./escolher-aluno.component.css']
})
export class EscolherAlunoComponent {

  alunos: Aluno[] = [
    { id: 1, nome: 'LUIZ DANIEL LANSER' },
    { id: 2, nome: 'PABLO HENRIQUE DE ANDRADE' },
    { id: 3, nome: 'BRUNO VALCANAIA' },
    { id: 4, nome: 'CAIO FELIPE' }
  ];

  constructor(private router: Router) {}

selecionarAluno(id: number, nome: string) {
  this.router.navigate(['/nutricionista', id, nome]);

  }
}
