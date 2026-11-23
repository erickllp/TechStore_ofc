import { Injectable } from '@angular/core';
import { Produto } from './produto.service';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

// providedIn: 'root' = existe UMA única cópia para o site inteiro.
// Por isso o número do carrinho é o mesmo em todas as telas.
@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  itens: ItemCarrinho[] = [];

  // Regras de frete (ajuste aqui quando definir as regras da loja)
  private valorFreteFixo = 29.9;
  private freteGratisAcima = 1500;

  constructor() {
    this.carregar();
  }

  adicionar(produto: Produto, quantidade: number = 1) {
    // Se o produto já está no carrinho, só soma a quantidade
    for (const item of this.itens) {
      if (item.produto.id === produto.id) {
        item.quantidade = item.quantidade + quantidade;
        this.salvar();
        return;
      }
    }
    this.itens.push({ produto: produto, quantidade: quantidade });
    this.salvar();
  }

  // mudanca = +1 para aumentar, -1 para diminuir (nunca fica abaixo de 1)
  alterarQuantidade(idProduto: number, mudanca: number) {
    for (const item of this.itens) {
      if (item.produto.id === idProduto) {
        item.quantidade = item.quantidade + mudanca;
        if (item.quantidade < 1) {
          item.quantidade = 1;
        }
        break;
      }
    }
    this.salvar();
  }

  remover(idProduto: number) {
    this.itens = this.itens.filter((item) => item.produto.id !== idProduto);
    this.salvar();
  }

  limpar() {
    this.itens = [];
    this.salvar();
  }

  // Número que aparece na bolinha do carrinho
  get quantidadeTotal(): number {
    let total = 0;
    for (const item of this.itens) {
      total = total + item.quantidade;
    }
    return total;
  }

  // Soma dos produtos, sem frete
  get valorTotal(): number {
    let total = 0;
    for (const item of this.itens) {
      total = total + item.produto.precoAtual * item.quantidade;
    }
    return total;
  }

  get frete(): number {
    if (this.itens.length === 0) {
      return 0;
    }
    if (this.valorTotal >= this.freteGratisAcima) {
      return 0;
    }
    return this.valorFreteFixo;
  }

  get totalComFrete(): number {
    return this.valorTotal + this.frete;
  }

  // localStorage guarda o carrinho no navegador, mesmo se a página recarregar
  private salvar() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }

  private carregar() {
    const texto = localStorage.getItem('carrinho');
    if (texto) {
      this.itens = JSON.parse(texto);
    }
  }
}