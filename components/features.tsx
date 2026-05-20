import { Calendar, Package, BarChart3, Users, Bell, Smartphone } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description:
      "Gerencie sua agenda com facilidade. Clientes podem agendar online 24/7.",
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    description:
      "Monitore produtos, receba alertas de reposição e evite desperdícios.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description:
      "Acompanhe faturamento, serviços mais populares e desempenho da equipe.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description:
      "Histórico completo, preferências e lembretes de aniversário automáticos.",
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description:
      "Lembretes por WhatsApp e SMS para reduzir faltas e cancelamentos.",
  },
  {
    icon: Smartphone,
    title: "Acesso Mobile",
    description:
      "Gerencie seu salão de qualquer lugar pelo celular ou tablet.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <article className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ferramentas pensadas especialmente para o dia a dia do seu salão de
            beleza.
          </p>
        </header>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <figure className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </figure>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
