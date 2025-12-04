import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  // Controle do pop-up
  showPopup = false;
  popupTitle = 'Criar Novo Usuário';
  
  // Formulário do pop-up
  userForm: FormGroup;
  
  // Tipos de usuário disponíveis
  tiposUsuario = ['ALUNO', 'PROFESSOR', 'NUTRICIONISTA', 'ADMIN'];
  
  // Lista de usuários (armazenamento local) - TORNAR PÚBLICO
  usuarios: any[] = [];
  
  // Usuário atual logado
  usuarioLogado: any;

  constructor(
    private renderer: Renderer2, 
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializar formulário
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['ALUNO', Validators.required],
      // Campos específicos para aluno
      peso: [null],
      altura: [null],
      idade: [null]
    });
  }
ngOnInit() {
  this.renderer.addClass(document.querySelector('app-root'), 'scroll-liberado');

  // Verificar se veio do login
  this.route.queryParams.subscribe(params => {
    this.usuarioLogado = {
      id: params['id'] || 1,
      nome: params['nome'] || 'Administrador',
      tipo: params['tipo'] || 'ADMIN'
    };
    
    console.log('Admin logado:', this.usuarioLogado);
  });
  
}

// 🔥 ADICIONE AQUI O MÉTODO ngOnDestroy
ngOnDestroy() {
    // Remover a classe quando o componente for destruído
    this.renderer.removeClass(document.querySelector('app-root'), 'scroll-liberado');
    console.log('AdminComponent destruído - scroll removido');
}
    // Carregar usuários existentes (mock data)

  // 🔥 CARREGAR USUÁRIOS DE EXEMPLO - TORNAR PÚBLICO
  carregarUsuariosMock() {
    this.usuarios = [
      { id: 1, nome: 'João Silva', email: 'aluno@teste.com', tipo: 'ALUNO', peso: 70, altura: 1.75, idade: 25 },
      { id: 2, nome: 'Maria Santos', email: 'maria@teste.com', tipo: 'ALUNO', peso: 65, altura: 1.68, idade: 22 },
      { id: 3, nome: 'Carlos Lima', email: 'professor@teste.com', tipo: 'PROFESSOR' },
      { id: 4, nome: 'Ana Costa', email: 'nutri@teste.com', tipo: 'NUTRICIONISTA' },
      { id: 5, nome: 'Admin Master', email: 'admin@teste.com', tipo: 'ADMIN' }
    ];
    console.log('✅ Usuários carregados:', this.usuarios.length);
  }

  // 🔥 ABRIR POP-UP DE CRIAÇÃO
  abrirPopupCriar() {
    this.popupTitle = 'Criar Novo Usuário';
    this.userForm.reset({
      nome: '',
      email: '',
      tipo: 'ALUNO',
      peso: null,
      altura: null,
      idade: null
    });
    this.showPopup = true;
  }

  // 🔥 FECHAR POP-UP
  fecharPopup() {
    this.showPopup = false;
    this.userForm.reset();
  }

  // 🔥 VERIFICAR SE É ALUNO (para mostrar campos extras)
  get isAluno(): boolean {
    return this.userForm.get('tipo')?.value === 'ALUNO';
  }

  // 🔥 SUBMIT DO FORMULÁRIO
  onSubmitForm() {
    if (this.userForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    const formData = this.userForm.value;
    
    // Criar novo usuário
    const novoUsuario = {
      id: this.usuarios.length + 1,
      nome: formData.nome,
      email: formData.email,
      tipo: formData.tipo,
      senha: '123456', // Senha padrão
      dataCriacao: new Date().toLocaleDateString(),
      criadoPor: this.usuarioLogado?.nome || 'Admin'
    };

    // Adicionar campos específicos para alunos
    if (formData.tipo === 'ALUNO') {
      Object.assign(novoUsuario, {
        peso: formData.peso,
        altura: formData.altura,
        idade: formData.idade,
        imc: formData.peso && formData.altura 
          ? (formData.peso / (formData.altura * formData.altura)).toFixed(2)
          : null
      });
    }

    // Adicionar à lista
    this.usuarios.push(novoUsuario);
    
    console.log('✅ Novo usuário criado:', novoUsuario);
    
    // Fechar pop-up e mostrar mensagem
    this.fecharPopup();
    this.mostrarMensagem(`Usuário "${novoUsuario.nome}" criado com sucesso!`);
  }

  // 🔥 MARCAR CAMPOS INVÁLIDOS - MANTER PRIVADO
  private marcarCamposInvalidos() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    alert('Por favor, preencha todos os campos obrigatórios corretamente!');
  }

  // 🔥 MOSTRAR MENSAGEM - MANTER PRIVADO
  private mostrarMensagem(mensagem: string) {
    alert(mensagem);
  }

  // 🔥 EDITAR USUÁRIO
  editarUsuario(usuario: any) {
    this.popupTitle = `Editar Usuário: ${usuario.nome}`;
    
    // Preencher formulário com dados do usuário
    this.userForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      peso: usuario.peso || null,
      altura: usuario.altura || null,
      idade: usuario.idade || null
    });
    
    this.showPopup = true;
  }

  // 🔥 EXCLUIR USUÁRIO
  excluirUsuario(usuario: any) {
    if (confirm(`Tem certeza que deseja excluir o usuário "${usuario.nome}"?`)) {
      const index = this.usuarios.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.usuarios.splice(index, 1);
        this.mostrarMensagem(`Usuário "${usuario.nome}" excluído com sucesso!`);
      }
    }
  }

  // 🔥 GERAR RELATÓRIO
  gerarRelatorio() {
    const relatorio = {
      totalUsuarios: this.usuarios.length,
      totalAlunos: this.usuarios.filter(u => u.tipo === 'ALUNO').length,
      totalProfessores: this.usuarios.filter(u => u.tipo === 'PROFESSOR').length,
      totalNutricionistas: this.usuarios.filter(u => u.tipo === 'NUTRICIONISTA').length,
      dataGeracao: new Date().toLocaleString()
    };
    
    console.table(relatorio);
    alert(`Relatório Gerado!\n\nTotal Usuários: ${relatorio.totalUsuarios}\nAlunos: ${relatorio.totalAlunos}\nProfessores: ${relatorio.totalProfessores}\nNutricionistas: ${relatorio.totalNutricionistas}`);
  }

  // 🔥 VOLTAR PARA LOGIN
  voltarParaLogin() {
    if (confirm('Deseja sair da área administrativa?')) {
      this.router.navigate(['/login']);
    }
  }

  // 🔥 LIMPAR TODOS OS USUÁRIOS (opcional)
  limparUsuarios() {
    if (confirm('Tem certeza que deseja limpar todos os usuários? Esta ação não pode ser desfeita.')) {
      this.usuarios = [];
      this.mostrarMensagem('Todos os usuários foram removidos!');
    }
  }
}