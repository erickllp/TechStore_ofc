import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-produto',
  styleUrl: './produto.css',
  templateUrl: './produto.html',
})
export class Produto {
  // Imagem grande que aparece na tela
  imagemAtual = 'img/rtx4060-1.jpg';

  // Número que aparece na bolinha do carrinho
  quantidadeCarrinho = 0;

  // Quantidade que o cliente escolheu (começa em 1)
  quantidade = 1;

  // Chamada quando clica numa miniatura
  trocarImagem(caminho: string) {
    this.imagemAtual = caminho;
  }

  aumentar() {
    this.quantidade = this.quantidade + 1;
  }

  diminuir() {
    if (this.quantidade > 1) {
      this.quantidade = this.quantidade - 1;
    }
  }

  // Soma a quantidade escolhida ao carrinho
  adicionarAoCarrinho() {
    this.quantidadeCarrinho = this.quantidadeCarrinho + this.quantidade;
    this.quantidade = 1;
  }
}