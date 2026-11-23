import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from '../landing/carrinho.service';

@Component({
  imports: [],
  selector: 'app-carrinho',
  styleUrl: './carrinho.css',
  templateUrl: './carrinho.html',
})
export class Carrinho {
  constructor(
    private router: Router,
    public carrinho: CarrinhoService,
  ) {}

  aumentar(idProduto: number) {
    this.carrinho.alterarQuantidade(idProduto, 1);
  }

  diminuir(idProduto: number) {
    this.carrinho.alterarQuantidade(idProduto, -1);
  }

  remover(idProduto: number) {
    this.carrinho.remover(idProduto);
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  continuarComprando() {
    this.router.navigate(['/inicio']);
  }

  finalizarCompra() {
    if (this.carrinho.itens.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
