import Link from "next/link";
import { Scissors } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Scissors className="w-6 h-6 text-primary group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-serif text-xl font-semibold text-foreground">
            Salon Vision
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </Link>
          </li>
          <li>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Depoimentos
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Planos
            </Link>
          </li>
          <li>
            <Link
              href="/contato"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </Link>
          </li>
        </ul>

        <menu className="flex items-center gap-4">
          <li>
            <Link
              href="/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Entrar
            </Link>
          </li>
          <li>
            <Link
              href="/cadastro"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              Criar conta
            </Link>
          </li>
        </menu>
      </nav>
    </header>
  );
}
