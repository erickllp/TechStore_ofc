import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const REGRA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  formulario: FormGroup;
  tentouEnviar = false;
  contaCriada = false;

  mensagemErro = signal('');
  carregando = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.contaCriada = this.route.snapshot.queryParamMap.get('cadastro') === 'ok';
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(REGRA_EMAIL)]],
      senha: ['', [Validators.required]],
    });
  }

  campoInvalido(nome: string): boolean {
    const campo = this.formulario.get(nome);
    if (!campo) {
      return false;
    }
    return campo.invalid && (campo.touched || this.tentouEnviar);
  }

  async entrar() {
    this.tentouEnviar = true;
    this.contaCriada = false;
    this.mensagemErro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    const { email, senha } = this.formulario.value;
    const resultado = await this.auth.entrar(email.trim(), senha);
    this.carregando.set(false);

    if (!resultado.sucesso) {
      this.mensagemErro.set(resultado.mensagem);
      return;
    }
    this.router.navigate(['/inicio']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}