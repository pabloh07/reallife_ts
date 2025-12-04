import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// Interface para usuário
interface Usuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
  tipo: 'ALUNO' | 'PROFESSOR' | 'NUTRICIONISTA' | 'ADMIN' ;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  // Base de dados de usuários simulada
  private usuariosMock: Usuario[] = [
    {
      id: 1,
      email: 'aluno@teste.com',
      senha: '123456',
      nome: 'João Silva',
      tipo: 'ALUNO'
    },
    {
      id: 2,
      email: 'professor@teste.com',
      senha: '123456',
      nome: 'Carlos Santos',
      tipo: 'PROFESSOR'
    },
    {
      id: 3,
      email: 'nutri@teste.com',
      senha: '123456',
      nome: 'Maria Oliveira',
      tipo: 'NUTRICIONISTA'
    },
    {
    id: 4,
      email: '0000',
      senha: '0000',
      nome: 'Maria Oliveira',
      tipo: 'ADMIN'
    },
    
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', Validators.required]
    });
  }

  // -------------------------------------
  // 🔥 SUBMIT DO LOGIN (SIMULADO)
  // -------------------------------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, senha } = this.form.value;

    // Simular delay de requisição
    setTimeout(() => {
      this.autenticarUsuario(email, senha);
    }, 500);
  }

  // -------------------------------------
  // 🔥 LÓGICA DE AUTENTICAÇÃO LOCAL
  // -------------------------------------
  private autenticarUsuario(email: string, senha: string) {
    // Buscar usuário na lista simulada
    const usuario = this.usuariosMock.find(
      user => (user.email === email || user.email.toString() === email) && 
              user.senha === senha
    );

    if (usuario) {
      console.log("Usuário logado:", usuario);
      
      // Armazenar no localStorage para simular sessão
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      
      this.redirecionarPorTipo(usuario);
    } else {
      alert("Credenciais inválidas! Use:\n\n" +
            "aluno@teste.com / 123456\n" +
            "professor@teste.com / 123456\n" +
            "nutri@teste.com / 123456\n" +
            "11122233344 / 123456 (CPF)");
    }
    
    this.loading = false;
  }

  // -------------------------------------
  // 🔥 REDIRECIONAMENTO
  // -------------------------------------
  private redirecionarPorTipo(usuario: Usuario) {
    switch (usuario.tipo.toUpperCase()) {
      case "PROFESSOR":
        this.router.navigate(['/dashboard'], {
          queryParams: { id: usuario.id, nome: usuario.nome }
        });
        break;

      case "ALUNO":
        this.router.navigate(['/home'], {
          queryParams: { id: usuario.id, nome: usuario.nome }
        });
        break;

        case "ADMIN":
      this.router.navigate(["/admin"], {
      queryParams: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }
       });
      break;

      case "NUTRICIONISTA":
        this.router.navigate(['/escolher-aluno'], {
          queryParams: { id: usuario.id, nome: usuario.nome }
        });
        break;

      default:
        alert("Tipo de usuário desconhecido");
    }
  }

  // -------------------------------------
  // 🔥 LOGIN RÁPIDO PARA TESTES
  // -------------------------------------
  loginRapido(tipo: 'ALUNO' | 'PROFESSOR' | 'NUTRICIONISTA') {
    const usuario = this.usuariosMock.find(user => user.tipo === tipo);
    
    if (usuario) {
      this.form.patchValue({
        email: usuario.email,
        senha: usuario.senha
      });
      
      // Autenticar automaticamente
      setTimeout(() => {
        this.autenticarUsuario(usuario.email, usuario.senha);
      }, 300);
    }
  }

  // -------------------------------------
  //  LOGIN COM GOOGLE (placeholder)
  // -------------------------------------
  loginGoogle() {
    alert("Login com Google ainda não implementado");
  }
}