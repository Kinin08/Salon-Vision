import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Agendamentos Hoje",
    value: "12",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Clientes Ativos",
    value: "248",
    change: "+18",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Faturamento Mensal",
    value: "R$ 12.450",
    change: "+12%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Taxa de Ocupação",
    value: "78%",
    change: "-5%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
];

const appointments = [
  {
    id: 1,
    client: "Ana Paula",
    service: "Corte + Escova",
    time: "09:00",
    professional: "Maria",
    status: "confirmed",
  },
  {
    id: 2,
    client: "Fernanda Silva",
    service: "Manicure",
    time: "10:30",
    professional: "Carla",
    status: "confirmed",
  },
  {
    id: 3,
    client: "Juliana Costa",
    service: "Coloração",
    time: "14:00",
    professional: "Maria",
    status: "pending",
  },
  {
    id: 4,
    client: "Patricia Souza",
    service: "Hidratação",
    time: "16:00",
    professional: "Carla",
    status: "confirmed",
  },
];

const statusColors = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
};

export default function DashboardPage() {
  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vinda de volta! Aqui está o resumo do seu salão.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <li
            key={stat.title}
            className="p-6 bg-card rounded-2xl border border-border"
          >
            <header className="flex items-center justify-between mb-4">
              <figure className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </figure>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </header>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </li>
        ))}
      </ul>

      <section className="grid lg:grid-cols-2 gap-6">
        <article className="bg-card rounded-2xl border border-border p-6">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Agendamentos de Hoje
            </h2>
            <a
              href="/app/agenda"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Ver todos
            </a>
          </header>

          <ul className="space-y-4">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
              >
                <figure className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </figure>
                <article className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {appointment.client}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment.service} • {appointment.professional}
                  </p>
                </article>
                <aside className="text-right flex-shrink-0">
                  <p className="font-medium text-foreground">
                    {appointment.time}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[appointment.status as keyof typeof statusColors]
                    }`}
                  >
                    {statusLabels[appointment.status as keyof typeof statusLabels]}
                  </span>
                </aside>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-card rounded-2xl border border-border p-6">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Alertas de Estoque
            </h2>
            <a
              href="/app/estoque"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Ver estoque
            </a>
          </header>

          <ul className="space-y-4">
            <li className="flex items-center gap-4 p-4 bg-warning/10 rounded-xl">
              <figure className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <span className="text-warning font-bold">!</span>
              </figure>
              <article className="flex-1">
                <p className="font-medium text-foreground">
                  Shampoo Profissional 1L
                </p>
                <p className="text-sm text-muted-foreground">
                  Apenas 3 unidades restantes
                </p>
              </article>
            </li>
            <li className="flex items-center gap-4 p-4 bg-destructive/10 rounded-xl">
              <figure className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                <span className="text-destructive font-bold">!</span>
              </figure>
              <article className="flex-1">
                <p className="font-medium text-foreground">
                  Tinta Loiro Médio
                </p>
                <p className="text-sm text-muted-foreground">
                  Estoque esgotado
                </p>
              </article>
            </li>
            <li className="flex items-center gap-4 p-4 bg-warning/10 rounded-xl">
              <figure className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <span className="text-warning font-bold">!</span>
              </figure>
              <article className="flex-1">
                <p className="font-medium text-foreground">
                  Esmalte Rosa Claro
                </p>
                <p className="text-sm text-muted-foreground">
                  Apenas 5 unidades restantes
                </p>
              </article>
            </li>
          </ul>
        </article>
      </section>
    </section>
  );
}
