import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Scissors,
} from "lucide-react";

const stats = [
  { label: "Faturamento", value: "R$ 12.450", change: "+12%", trend: "up", icon: DollarSign },
  { label: "Novos Clientes", value: "23", change: "+8%", trend: "up", icon: Users },
  { label: "Agendamentos", value: "156", change: "-3%", trend: "down", icon: Calendar },
  { label: "Serviços Realizados", value: "142", change: "+5%", trend: "up", icon: Scissors },
];

const topServices = [
  { name: "Corte Feminino", count: 45, revenue: "R$ 2.250" },
  { name: "Coloração", count: 32, revenue: "R$ 3.840" },
  { name: "Manicure", count: 38, revenue: "R$ 1.140" },
  { name: "Escova", count: 28, revenue: "R$ 1.400" },
  { name: "Hidratação", count: 22, revenue: "R$ 1.320" },
];

const topProfessionals = [
  { name: "Maria", services: 68, revenue: "R$ 5.440" },
  { name: "Carla", services: 52, revenue: "R$ 3.640" },
  { name: "Ana", services: 22, revenue: "R$ 1.320" },
];

export default function RelatoriosPage() {
  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Relatórios
          </h1>
          <p className="text-muted-foreground">Maio 2026</p>
        </article>
        <select className="px-4 py-2 bg-card border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
          <option>Maio 2026</option>
          <option>Abril 2026</option>
          <option>Março 2026</option>
        </select>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <li key={stat.label} className="p-6 bg-card rounded-2xl border border-border">
            <header className="flex items-center justify-between mb-4">
              <figure className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </figure>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </header>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </li>
        ))}
      </ul>

      <section className="grid lg:grid-cols-2 gap-6">
        <article className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Serviços Mais Realizados
          </h2>
          <ul className="space-y-4">
            {topServices.map((service, index) => (
              <li key={service.name} className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <article className="flex-1">
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.count} serviços
                  </p>
                </article>
                <span className="font-semibold text-foreground">
                  {service.revenue}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Desempenho por Profissional
          </h2>
          <ul className="space-y-4">
            {topProfessionals.map((prof, index) => (
              <li key={prof.name} className="flex items-center gap-4">
                <span className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-sm font-semibold text-secondary">
                  {index + 1}
                </span>
                <article className="flex-1">
                  <p className="font-medium text-foreground">{prof.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {prof.services} serviços
                  </p>
                </article>
                <span className="font-semibold text-foreground">
                  {prof.revenue}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Faturamento Diário
          </h2>
          <figure className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 15 }).map((_, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <span
                  key={i}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`Dia ${i + 1}`}
                />
              );
            })}
          </figure>
          <figcaption className="flex justify-between mt-4 text-sm text-muted-foreground">
            <span>1 Mai</span>
            <span>15 Mai</span>
          </figcaption>
        </article>
      </section>
    </section>
  );
}
