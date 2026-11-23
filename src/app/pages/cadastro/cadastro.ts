import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const REGRA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('senha')?.value;
  const confirmar = grupo.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-cadastro',
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  formulario: FormGroup;
  tentouEnviar = false;

  mensagemErro = signal('');
  carregando = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
  ) {
    this.formulario = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.pattern(REGRA_EMAIL)]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
        termos: [false, [Validators.requiredTrue]],
      },
      { validators: senhasIguais },
    );
  }

  campoInvalido(nome: string): boolean {
    const campo = this.formulario.get(nome);
    if (!campo) {
      return false;
    }
    return campo.invalid && (campo.touched || this.tentouEnviar);
  }

  senhasDiferentes(): boolean {
    const confirmar = this.formulario.get('confirmarSenha');
    const mexeu = !!confirmar && (confirmar.touched || this.tentouEnviar);
    return this.formulario.hasError('senhasDiferentes') && mexeu;
  }

  async cadastrar() {
    this.tentouEnviar = true;
    this.mensagemErro.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    const { nome, email, senha } = this.formulario.value;
    const resultado = await this.auth.cadastrar(nome.trim(), email.trim(), senha);
    this.carregando.set(false);

    if (!resultado.sucesso) {
      this.mensagemErro.set(resultado.mensagem);
      return;
    }

    this.router.navigate(['/login'], { queryParams: { cadastro: 'ok' } });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}