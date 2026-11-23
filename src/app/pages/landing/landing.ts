import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CarrinhoService } from './carrinho.service';
import { AuthService } from '../../services/auth.service';
import { Produto, ProdutoService } from './produto.service';

@Component({
  imports: [],
  selector: 'app-landing',
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing implements OnInit {
  constructor(
    private router: Router,
    private produtoService: ProdutoService,
    public carrinho: CarrinhoService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.produtoService.carregar().subscribe({
      next: (lista) => {
        this.todosProdutos.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  todosProdutos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal(false);

  get logado(): boolean {
    return this.auth.estaLogadoAgora();
  }

  get primeiroNome(): string {
    return this.auth.nomeUsuario().split(' ')[0];
  }

  textoBusca = '';
  categoriaAtiva = 'Todos';
  bannerAtual = 0;

  categorias = [
    { nome: 'Celulares', imagem: 'produtos/s22Ultra.jpg' },
    { nome: 'Notebooks', imagem: 'produtos/laptop.jpg' },
    { nome: 'Fones', imagem: 'produtos/wireless-headphones.jpg' },
    { nome: 'Relógios', imagem: 'produtos/smartwatch.jpg' },
    { nome: 'Acessórios', imagem: 'produtos/usb-c.jpg' },
  ];

  banners = [
    { subtitulo: 'Melhores ofertas online em smartwatches', titulo: 'SMART WEARABLE.', desconto: 'Até 80% OFF', imagem: 'produtos/smartwatch.jpg' },
    { subtitulo: 'Performance para jogar e trabalhar', titulo: 'NOTEBOOKS GAMER.', desconto: 'Até 40% OFF', imagem: 'produtos/laptop.jpg' },
    { subtitulo: 'Som de qualidade sem fio', titulo: 'FONES BLUETOOTH.', desconto: 'Até 50% OFF', imagem: 'produtos/wireless-headphones.jpg' },
  ];

  marcas = [
    { nome: 'IPHONE', classe: 'marca-iphone', imagem: 'produtos/iphone14.jpg' },
    { nome: 'SAMSUNG', classe: 'marca-realme', imagem: 'produtos/s22Ultra.jpg' },
    { nome: 'GALAXY', classe: 'marca-xiaomi', imagem: 'produtos/galaxy13.jpg' },
  ];

  essenciais = [
    { nome: 'Cabos', imagem: 'produtos/usb-c.jpg' },
    { nome: 'Fones Gamer', imagem: 'produtos/gamingheadset.jpg' },
    { nome: 'Fones Bluetooth', imagem: 'produtos/wireless-headphones.jpg' },
    { nome: 'Relógios', imagem: 'produtos/smartwatch.jpg' },
    { nome: 'Monitores', imagem: 'produtos/monitor.jpg' },
    { nome: 'Games', imagem: 'produtos/retrohandheld.jpg' },
  ];

  get quantidadeNoCarrinho(): number {
    return this.carrinho.quantidadeTotal;
  }

  get produtosFiltrados(): Produto[] {
    const lista = this.produtoService.filtrar(this.todosProdutos(), this.categoriaAtiva, this.textoBusca);
    return lista.slice(0, 5);
  }

  escolherCategoria(nome: string) {
    this.categoriaAtiva = nome;
  }

  limparFiltro() {
    this.categoriaAtiva = 'Todos';
    this.textoBusca = '';
  }

  proximoBanner() {
    this.bannerAtual = (this.bannerAtual + 1) % this.banners.length;
  }

  bannerAnterior() {
    this.bannerAtual = (this.bannerAtual - 1 + this.banners.length) % this.banners.length;
  }

  irParaBanner(posicao: number) {
    this.bannerAtual = posicao;
  }

  adicionarAoCarrinho(produto: Produto) {
    this.carrinho.adicionar(produto);
  }

  desconto(produto: Produto): number {
    return Math.round((1 - produto.precoAtual / produto.precoAntigo) * 100);
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  irParaProduto(id: number) {
    this.router.navigate(['/produto', id]);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  async sair() {
    await this.auth.sair();
    this.router.navigate(['/login']);
  }

  irParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }
}