import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrinhoService } from '../landing/carrinho.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  // O formulário: cada campo tem uma lista de regras (Validators)
  formulario: FormGroup;

  tentouEnviar = false;       // vira true quando o cliente clica em "Confirmar pedido"
  pedidoConfirmado = false;   // troca a tela do formulário pela tela de sucesso
  numeroPedido = 0;
  totalPago = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public carrinho: CarrinhoService,
  ) {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      endereco: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
      pagamento: ['pix', [Validators.required]],
    });
  }

  // Devolve true se o campo deve mostrar mensagem de erro
  campoInvalido(nome: string): boolean {
    const campo = this.formulario.get(nome);
    if (!campo) {
      return false;
    }
    return campo.invalid && (campo.touched || this.tentouEnviar);
  }

  confirmarPedido() {
    this.tentouEnviar = true;

    if (this.formulario.invalid || this.carrinho.itens.length === 0) {
      this.formulario.markAllAsTouched();
      return;
    }

    // PROVISÓRIO: sem banco de dados, o pedido fica salvo no navegador.
    // Com o Supabase, este trecho vira um INSERT na tabela "pedidos".
    this.numeroPedido = Math.floor(Math.random() * 900000) + 100000;
    this.totalPago = this.carrinho.totalComFrete;

    const pedido = {
      numero: this.numeroPedido,
      total: this.totalPago,
      itens: this.carrinho.itens,
      entrega: this.formulario.value,
    };
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));

    this.carrinho.limpar();
    this.pedidoConfirmado = true;
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  voltarParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }

  irParaInicio() {
    this.router.navigate(['/inicio']);
  }
}
