import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  precoAtual: number;
  precoAntigo: number;
  imagem: string;

  descricao: string;
  imagens: string[];
  avaliacao: number;
  numeroAvaliacoes: number;
  marca: string;
  estoque: number;
  garantia: string;
  envio: string;
  disponibilidade: string;
}

interface ProdutoApi {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  description?: string;
  images?: string[];
  rating?: number;
  reviews?: unknown[];
  brand?: string;
  stock?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
}

interface RespostaApi {
  products: ProdutoApi[];
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private urlBase = 'https://dummyjson.com/products';

  private categoriasApi = [
    'smartphones',
    'tablets',
    'laptops',
    'mens-watches',
    'womens-watches',
    'mobile-accessories',
  ];

  private cotacaoDolar = 5.5;

  constructor(private http: HttpClient) {}

  carregar(): Observable<Produto[]> {
    const pedidos = this.categoriasApi.map((categoria) =>
      this.http.get<RespostaApi>(this.urlBase + '/category/' + categoria),
    );

    return forkJoin(pedidos).pipe(
      map((respostas) => {
        const lista: Produto[] = [];
        for (const resposta of respostas) {
          for (const produtoApi of resposta.products) {
            lista.push(this.converter(produtoApi));
          }
        }
        return lista;
      }),
    );
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http
      .get<ProdutoApi>(this.urlBase + '/' + id)
      .pipe(map((produtoApi) => this.converter(produtoApi)));
  }

  filtrar(lista: Produto[], categoria: string, texto: string): Produto[] {
    const resultado: Produto[] = [];
    const busca = texto.toLowerCase().trim();

    for (const produto of lista) {
      const categoriaOk = categoria === 'Todos' || produto.categoria === categoria;
      const textoOk = busca === '' || produto.nome.toLowerCase().includes(busca);

      if (categoriaOk && textoOk) {
        resultado.push(produto);
      }
    }
    return resultado;
  }

  private converter(p: ProdutoApi): Produto {
    const precoAtual = Math.round(p.price * this.cotacaoDolar);
    const desconto = p.discountPercentage || 0;
    const precoAntigo = Math.round(precoAtual / (1 - desconto / 100));
    const imagens = p.images && p.images.length > 0 ? p.images : [p.thumbnail];

    return {
      id: p.id,
      nome: p.title,
      categoria: this.traduzirCategoria(p),
      precoAtual: precoAtual,
      precoAntigo: precoAntigo,
      imagem: p.thumbnail,
      descricao: p.description ?? '',
      imagens: imagens,
      avaliacao: p.rating ?? 0,
      numeroAvaliacoes: p.reviews ? p.reviews.length : 0,
      marca: p.brand ?? '',
      estoque: p.stock ?? 0,
      garantia: p.warrantyInformation ?? '',
      envio: p.shippingInformation ?? '',
      disponibilidade: this.traduzirDisponibilidade(p.availabilityStatus ?? ''),
    };
  }

  private traduzirCategoria(p: ProdutoApi): string {
    if (p.category === 'smartphones' || p.category === 'tablets') {
      return 'Celulares';
    }
    if (p.category === 'laptops') {
      return 'Notebooks';
    }
    if (p.category === 'mens-watches' || p.category === 'womens-watches') {
      return 'Relógios';
    }
    if (p.category === 'mobile-accessories') {
      const ehFone = /airpods|earphone|earbud|headphone|headset|beats|buds/i.test(p.title);
      return ehFone ? 'Fones' : 'Acessórios';
    }
    return p.category;
  }

  private traduzirDisponibilidade(texto: string): string {
    if (texto === 'In Stock') {
      return 'Em estoque';
    }
    if (texto === 'Low Stock') {
      return 'Poucas unidades';
    }
    if (texto === 'Out of Stock') {
      return 'Indisponível';
    }
    return texto;
  }
}