"use client";

import Link from "next/link";
import { useState } from "react";
import { Scissors, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const benefits = [
  "Agendamento online 24/7",
  "Controle de estoque integrado",
  "Relatórios de desempenho",
  "Suporte dedicado",
];

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      salonName: formData.get("salonName"),
      password: formData.get("password"),
    };
    
    // TODO: Integrar com backend PHP
    console.log("[v0] Registration attempt:", { ...data, password: "***" });
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen flex">
      <section className="hidden lg:flex lg:w-1/2 bg-secondary/10 items-center justify-center p-12">
        <article className="max-w-md">
          <figure className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8">
            <Scissors className="w-8 h-8 text-secondary-foreground" />
          </figure>
          <h1 className="font-serif text-4xl font-semibold text-foreground mb-4">
            Transforme a gestão do seu salão
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Junte-se a milhares de profissionais de beleza que já simplificaram
            sua rotina com o Salon Vision.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent" />
                </span>
                <span className="text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
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
              Criar sua conta
            </h2>
            <p className="text-muted-foreground">
              Comece seu teste gratuito de 14 dias
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="space-y-4">
              <legend className="sr-only">Dados de cadastro</legend>
              
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Seu nome
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Maria Silva"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

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
                  Telefone
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Nome do salão
                </span>
                <input
                  type="text"
                  name="salonName"
                  required
                  placeholder="Studio Beauty"
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
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
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

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                required
                className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-muted-foreground">
                Concordo com os{" "}
                <Link href="/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Criar conta grátis
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Entrar
              </Link>
            </p>
          </footer>
        </article>
      </section>
    </main>
  );
}
