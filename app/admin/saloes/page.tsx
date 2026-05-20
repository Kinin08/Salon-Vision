"use client";

import { useState } from "react";
import { Search, MoreVertical, Building2, Users, Calendar, DollarSign } from "lucide-react";

const mockSalons = [
  { id: 1, name: "Studio Beauty", owner: "Maria Silva", users: 3, plan: "Profissional", revenue: "R$ 890", status: "active", joinDate: "2026-01-15" },
  { id: 2, name: "Beleza Total", owner: "Ana Costa", users: 1, plan: "Starter", revenue: "R$ 0", status: "trial", joinDate: "2026-05-15" },
  { id: 3, name: "Hair Design", owner: "Julia Santos", users: 8, plan: "Enterprise", revenue: "R$ 1.990", status: "active", joinDate: "2026-03-10" },
  { id: 4, name: "Beauty Space", owner: "Patricia Lima", users: 2, plan: "Profissional", revenue: "R$ 890", status: "overdue", joinDate: "2026-04-05" },
  { id: 5, name: "Glamour Studio", owner: "Fernanda Oliveira", users: 1, plan: "Starter", revenue: "R$ 0", status: "trial", joinDate: "2026-05-10" },
];

const statusColors = {
  active: "bg-success/10 text-success",
  trial: "bg-primary/10 text-primary",
  overdue: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  active: "Ativo",
  trial: "Trial",
  overdue: "Inadimplente",
};

export default function AdminSaloesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSalons = mockSalons.filter(
    (salon) =>
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Gestão de Salões
          </h1>
          <p className="text-muted-foreground">
            {mockSalons.length} salões cadastrados
          </p>
        </article>
      </header>

      <form className="relative max-w-md mb-6">
        <label htmlFor="search-salons" className="sr-only">Buscar salões</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="search-salons"
          type="search"
          placeholder="Buscar por nome ou proprietário..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card text-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </form>

      <article className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Salão</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Usuários</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Plano</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Receita</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalons.map((salon) => (
              <tr key={salon.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <span className="flex items-center gap-3">
                    <figure className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-secondary" />
                    </figure>
                    <article>
                      <p className="font-medium text-foreground">{salon.name}</p>
                      <p className="text-sm text-muted-foreground">{salon.owner}</p>
                    </article>
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="flex items-center justify-center gap-1 text-foreground">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    {salon.users}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    salon.plan === "Enterprise" ? "bg-accent/10 text-accent-foreground" :
                    salon.plan === "Profissional" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {salon.plan}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="flex items-center justify-center gap-1 font-medium text-foreground">
                    {salon.revenue}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[salon.status as keyof typeof statusColors]}`}>
                    {statusLabels[salon.status as keyof typeof statusLabels]}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Mais opções">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
