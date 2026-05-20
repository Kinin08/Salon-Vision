"use client";

import Link from "next/link";
import { useState } from "react";
import { Scissors, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    
    // TODO: Integrar com backend PHP
    console.log("[v0] Login attempt:", { email, password: "***" });
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen flex">
      <section className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-12">
        <article className="max-w-md">
          <figure className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </figure>
          <h1 className="font-serif text-4xl font-semibold text-foreground mb-4">
            Bem-vinda de volta ao Salon Vision
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Acesse sua conta para gerenciar agendamentos, controlar estoque e
            acompanhar o desempenho do seu salão.
          </p>
        </article>
      </section>

      <section className="flex-1 flex items-center justify-center p-8">
        <article className="w-full max-w-md">
          <header className="mb-8">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-semibold">Salon Vision</span>
            </Link>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Entrar na sua conta
            </h2>
            <p className="text-muted-foreground">
              Digite seus dados para acessar o painel
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="space-y-4">
              <legend className="sr-only">Dados de login</legend>
              
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Senha
                </span>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Sua senha"
                    className="w-full px-4 py-3 pr-12 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </span>
              </label>
            </fieldset>

            <nav className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-muted-foreground">Lembrar de mim</span>
              </label>
              <Link
                href="/recuperar-senha"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </nav>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Criar conta grátis
              </Link>
            </p>
          </footer>
        </article>
      </section>
    </main>
  );
}
