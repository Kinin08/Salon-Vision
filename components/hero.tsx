import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <figure className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-20 right-10 w-96 h-96 text-primary/10"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>
        <svg
          className="absolute bottom-20 left-10 w-64 h-64 text-secondary/10"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>
      </figure>

      <article className="relative max-w-5xl mx-auto px-6 text-center">
        <p className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          Novo: Integração com WhatsApp Business
        </p>

        <h1 className="font-serif text-5xl md:text-7xl font-semibold text-foreground leading-tight mb-6 text-balance">
          Gestão elegante para{" "}
          <span className="text-primary">salões de beleza</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Simplifique agendamentos, controle seu estoque e acompanhe o
          desempenho do seu salão em uma única plataforma intuitiva e moderna.
        </p>

        <menu className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <li>
            <Link
              href="/cadastro"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all hover:gap-3"
            >
              Comece gratuitamente
              <ArrowRight className="w-4 h-4" />
            </Link>
          </li>
          <li>
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border text-foreground rounded-xl font-medium hover:border-primary/50 transition-colors"
            >
              Ver demonstração
            </Link>
          </li>
        </menu>

        <p className="mt-8 text-sm text-muted-foreground">
          Teste grátis por 14 dias. Sem cartão de crédito.
        </p>
      </article>
    </section>
  );
}
