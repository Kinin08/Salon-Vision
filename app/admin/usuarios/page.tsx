"use client";

import { useState } from "react";
import { Search, MoreVertical, User, Mail, Calendar, Shield } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Maria Silva", email: "maria@studiobeauty.com", salon: "Studio Beauty", plan: "Profissional", status: "active", joinDate: "2026-01-15" },
  { id: 2, name: "Ana Costa", email: "ana@belezatotal.com", salon: "Beleza Total", plan: "Starter", status: "active", joinDate: "2026-02-20" },
  { id: 3, name: "Julia Santos", email: "julia@hairdesign.com", salon: "Hair Design", plan: "Enterprise", status: "active", joinDate: "2026-03-10" },
  { id: 4, name: "Patricia Lima", email: "patricia@beautyspace.com", salon: "Beauty Space", plan: "Profissional", status: "suspended", joinDate: "2026-04-05" },
  { id: 5, name: "Fernanda Oliveira", email: "fernanda@glamour.com", salon: "Glamour Studio", plan: "Starter", status: "active", joinDate: "2026-05-01" },
];

const statusColors = {
  active: "bg-success/10 text-success",
  suspended: "bg-destructive/10 text-destructive",
  pending: "bg-warning/10 text-warning",
};

const statusLabels = {
  active: "Ativo",
  suspended: "Suspenso",
  pending: "Pendente",
};

export default function AdminUsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">
            {mockUsers.length} usuários cadastrados
          </p>
        </article>
      </header>

      <form className="relative max-w-md mb-6">
        <label htmlFor="search-users" className="sr-only">Buscar usuários</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="search-users"
          type="search"
          placeholder="Buscar por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card text-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </form>

      <article className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usuário</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Salão</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Plano</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Cadastro</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <span className="flex items-center gap-3">
                    <figure className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </figure>
                    <article>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </article>
                  </span>
                </td>
                <td className="p-4 text-foreground">{user.salon}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.plan === "Enterprise" ? "bg-accent/10 text-accent-foreground" :
                    user.plan === "Profissional" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[user.status as keyof typeof statusColors]}`}>
                    {statusLabels[user.status as keyof typeof statusLabels]}
                  </span>
                </td>
                <td className="p-4 text-center text-sm text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.joinDate).toLocaleDateString("pt-BR")}
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
