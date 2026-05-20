import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <article className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6 text-balance">
          Pronta para transformar a gestão do seu salão?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          Junte-se a milhares de profissionais de beleza que já simplificaram
          sua rotina com o Salon Vision.
        </p>
        <Link
          href="/cadastro"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all hover:gap-3"
        >
          Começar agora gratuitamente
          <ArrowRight className="w-4 h-4" />
        </Link>
      </article>
    </section>
  );
}
