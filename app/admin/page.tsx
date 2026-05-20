import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

const stats = [
  { title: "Total de Usuários", value: "1.234", change: "+12%", icon: Users },
  { title: "Salões Ativos", value: "89", change: "+5%", icon: Building2 },
  { title: "Receita Mensal", value: "R$ 12.450", change: "+18%", icon: DollarSign },
  { title: "Taxa de Conversão", value: "23%", change: "+3%", icon: TrendingUp },
];

const recentUsers = [
  { id: 1, name: "Maria Silva", salon: "Studio Beauty", plan: "Profissional", date: "2026-05-20" },
  { id: 2, name: "Ana Costa", salon: "Beleza Total", plan: "Starter", date: "2026-05-19" },
  { id: 3, name: "Julia Santos", salon: "Hair Design", plan: "Enterprise", date: "2026-05-18" },
  { id: 4, name: "Patricia Lima", salon: "Beauty Space", plan: "Profissional", date: "2026-05-17" },
];

const alerts = [
  { type: "warning", message: "5 salões com pagamento pendente" },
  { type: "error", message: "2 usuários reportaram problemas de acesso" },
  { type: "info", message: "Nova versão disponível para deploy" },
];

export default function AdminPage() {
  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Salon Vision
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <li
            key={stat.title}
            className="p-6 bg-card rounded-2xl border border-border"
          >
            <header className="flex items-center justify-between mb-4">
              <figure className="w-12 h-12 bg-foreground/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-foreground" />
              </figure>
              <span className="flex items-center gap-1 text-sm font-medium text-success">
                <ArrowUpRight className="w-4 h-4" />
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

      <section className="grid lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Novos Cadastros
            </h2>
            <a
              href="/admin/usuarios"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Ver todos
            </a>
          </header>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Usuário</th>
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Salão</th>
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Plano</th>
                <th className="text-right pb-3 text-sm font-medium text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-b-0">
                  <td className="py-4 font-medium text-foreground">{user.name}</td>
                  <td className="py-4 text-muted-foreground">{user.salon}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.plan === "Enterprise" ? "bg-accent/10 text-accent-foreground" :
                      user.plan === "Profissional" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 text-right text-sm text-muted-foreground">
                    {new Date(user.date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="bg-card rounded-2xl border border-border p-6">
          <header className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Alertas do Sistema
            </h2>
          </header>

          <ul className="space-y-4">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  alert.type === "error" ? "bg-destructive/10" :
                  alert.type === "warning" ? "bg-warning/10" :
                  "bg-primary/10"
                }`}
              >
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.type === "error" ? "text-destructive" :
                  alert.type === "warning" ? "text-warning" :
                  "text-primary"
                }`} />
                <p className="text-sm text-foreground">{alert.message}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
