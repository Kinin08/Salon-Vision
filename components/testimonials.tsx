import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Dona do Studio MS Beauty",
    content:
      "O Salon Vision transformou a gestão do meu salão. Reduzi as faltas em 40% com os lembretes automáticos.",
    rating: 5,
  },
  {
    name: "Carla Oliveira",
    role: "Gerente do Espaço Beleza Total",
    content:
      "Finalmente consigo ver relatórios claros do meu negócio. A interface é linda e super fácil de usar.",
    rating: 5,
  },
  {
    name: "Ana Paula Costa",
    role: "Proprietária do Ana Paula Hair",
    content:
      "Meus clientes adoram poder agendar pelo celular. O suporte é excelente e sempre me ajudam rápido.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <article className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
            Amado por profissionais de beleza
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Veja o que nossos clientes dizem sobre a experiência com o Salon
            Vision.
          </p>
        </header>

        <ul className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.name}
              className="p-8 bg-card rounded-2xl border border-border"
            >
              <figure className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </figure>
              <blockquote className="text-foreground leading-relaxed mb-6">
                {`"${testimonial.content}"`}
              </blockquote>
              <figcaption>
                <cite className="not-italic">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </cite>
              </figcaption>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
