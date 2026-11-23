import { Injectable } from '@angular/core';

export interface RespostaAuth {
  sucesso: boolean;
  mensagem: string;
  precisaConfirmar?: boolean;
}

interface Usuario {
  nome: string;
  email: string;
  senhaHash: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private chaveUsuarios = 'usuarios';
  private chaveSessao = 'sessao';

  async cadastrar(nome: string, email: string, senha: string): Promise<RespostaAuth> {
    const emailLimpo = email.trim().toLowerCase();
    const usuarios = this.lerUsuarios();

    for (const usuario of usuarios) {
      if (usuario.email === emailLimpo) {
        return { sucesso: false, mensagem: 'Este e-mail já está cadastrado.' };
      }
    }

    const senhaHash = await this.gerarHash(emailLimpo + senha);
    usuarios.push({ nome: nome, email: emailLimpo, senhaHash: senhaHash });
    localStorage.setItem(this.chaveUsuarios, JSON.stringify(usuarios));

    return { sucesso: true, mensagem: 'Conta criada com sucesso! Agora faça login para entrar.' };
  }

  async entrar(email: string, senha: string): Promise<RespostaAuth> {
    const emailLimpo = email.trim().toLowerCase();

    let usuarioEncontrado: Usuario | null = null;
    for (const usuario of this.lerUsuarios()) {
      if (usuario.email === emailLimpo) {
        usuarioEncontrado = usuario;
      }
    }

    if (!usuarioEncontrado) {
      return {
        sucesso: false,
        mensagem: 'Você ainda não tem cadastro. Clique em "Criar conta" para se cadastrar primeiro.',
      };
    }

    const senhaHash = await this.gerarHash(emailLimpo + senha);
    if (usuarioEncontrado.senhaHash !== senhaHash) {
      return { sucesso: false, mensagem: 'Senha incorreta.' };
    }

    localStorage.setItem(this.chaveSessao, emailLimpo);
    return { sucesso: true, mensagem: 'Login realizado!' };
  }

  async sair(): Promise<void> {
    localStorage.removeItem(this.chaveSessao);
  }

  async estaLogado(): Promise<boolean> {
    return localStorage.getItem(this.chaveSessao) !== null;
  }

  estaLogadoAgora(): boolean {
    return localStorage.getItem(this.chaveSessao) !== null;
  }

  nomeUsuario(): string {
    const email = localStorage.getItem(this.chaveSessao);
    for (const usuario of this.lerUsuarios()) {
      if (usuario.email === email) {
        return usuario.nome;
      }
    }
    return '';
  }

  private lerUsuarios(): Usuario[] {
    const texto = localStorage.getItem(this.chaveUsuarios);
    if (!texto) {
      return [];
    }
    try {
      return JSON.parse(texto);
    } catch {
      return [];
    }
  }

  private async gerarHash(texto: string): Promise<string> {
    if (!crypto || !crypto.subtle) {
      return this.hashSimples(texto);
    }

    const bytes = new Uint8Array(new TextEncoder().encode(texto));
    const resultado = await crypto.subtle.digest('SHA-256', bytes);
    const lista = Array.from(new Uint8Array(resultado));
    return lista.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private hashSimples(texto: string): string {
    let valor = 5381;
    for (let i = 0; i < texto.length; i++) {
      valor = (valor * 33) ^ texto.charCodeAt(i);
    }
    return 'simples-' + (valor >>> 0).toString(16);
  }
}