import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    description: "Para começar a organizar seu salão",
    features: [
      "Até 50 agendamentos/mês",
      "1 profissional",
      "Lembretes por email",
      "Relatórios básicos",
    ],
    cta: "Começar grátis",
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$ 89",
    period: "/mês",
    description: "Para salões em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Até 5 profissionais",
      "WhatsApp + SMS",
      "Controle de estoque",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
    cta: "Começar teste grátis",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "R$ 199",
    period: "/mês",
    description: "Para redes e franquias",
    features: [
      "Tudo do Profissional",
      "Profissionais ilimitados",
      "Múltiplas unidades",
      "API personalizada",
      "Gerente de conta dedicado",
      "Treinamento incluso",
    ],
    cta: "Falar com vendas",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <article className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
            Planos para cada momento do seu negócio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comece grátis e evolua conforme seu salão cresce.
          </p>
        </header>

        <ul className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  Mais popular
                </span>
              )}

              <h3
                className={`text-xl font-semibold mb-2 ${
                  plan.popular ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {plan.name}
              </h3>

              <p
                className={`text-sm mb-4 ${
                  plan.popular
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {plan.description}
              </p>

              <p
                className={`text-4xl font-bold mb-6 ${
                  plan.popular ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {plan.price}
                {plan.period && (
                  <span className="text-base font-normal">{plan.period}</span>
                )}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.popular ? "text-accent" : "text-primary"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular
                          ? "text-primary-foreground/90"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cadastro"
                className={`block w-full py-3 text-center font-medium rounded-xl transition-colors ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover"
                }`}
              >
                {plan.cta}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
