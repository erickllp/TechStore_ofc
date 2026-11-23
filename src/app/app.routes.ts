import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Landing } from './pages/landing/landing';
import { Produto } from './pages/produto/produto';
import { Carrinho } from './pages/carrinho/carrinho';
import { Checkout } from './pages/checkout/checkout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'inicio', component: Landing },
  { path: 'produto', component: Produto },
  { path: 'carrinho', component: Carrinho },
  { path: 'checkout', component: Checkout },
];