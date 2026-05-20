import Link from "next/link";
import { Scissors, Instagram, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#features" },
    { label: "Planos", href: "#pricing" },
    { label: "Integrações", href: "/integracoes" },
    { label: "Atualizações", href: "/novidades" },
  ],
  empresa: [
    { label: "Sobre nós", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Carreiras", href: "/carreiras" },
    { label: "Contato", href: "/contato" },
  ],
  suporte: [
    { label: "Central de Ajuda", href: "/ajuda" },
    { label: "Tutoriais", href: "/tutoriais" },
    { label: "Status do Sistema", href: "/status" },
    { label: "API Docs", href: "/api-docs" },
  ],
  legal: [
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos de Uso", href: "/termos" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <article className="max-w-7xl mx-auto px-6">
        <section className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <header className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-semibold">
                Salon Vision
              </span>
            </Link>
            <p className="text-sm text-background/70 mb-4">
              Sistema de gestão completo para salões de beleza.
            </p>
            <nav aria-label="Redes sociais">
              <menu className="flex gap-4">
                <li>
                  <Link
                    href="https://instagram.com"
                    className="text-background/70 hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://facebook.com"
                    className="text-background/70 hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com"
                    className="text-background/70 hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </li>
              </menu>
            </nav>
          </header>

          <nav aria-label="Produto">
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Suporte">
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <footer className="pt-8 border-t border-background/20">
          <p className="text-sm text-background/60 text-center">
            &copy; {new Date().getFullYear()} Salon Vision. Todos os direitos
            reservados.
          </p>
        </footer>
      </article>
    </footer>
  );
}
