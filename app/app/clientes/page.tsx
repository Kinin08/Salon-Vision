"use client";

import { useState } from "react";
import { Search, Plus, Phone, Mail, Calendar, X, User } from "lucide-react";

const mockClients = [
  { id: 1, name: "Ana Paula Silva", email: "ana@email.com", phone: "(11) 99999-1111", visits: 12, lastVisit: "2026-05-15" },
  { id: 2, name: "Fernanda Costa", email: "fernanda@email.com", phone: "(11) 99999-2222", visits: 8, lastVisit: "2026-05-18" },
  { id: 3, name: "Juliana Santos", email: "juliana@email.com", phone: "(11) 99999-3333", visits: 25, lastVisit: "2026-05-10" },
  { id: 4, name: "Patricia Oliveira", email: "patricia@email.com", phone: "(11) 99999-4444", visits: 5, lastVisit: "2026-05-19" },
  { id: 5, name: "Mariana Lima", email: "mariana@email.com", phone: "(11) 99999-5555", visits: 15, lastVisit: "2026-05-12" },
];

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            {mockClients.length} clientes cadastrados
          </p>
        </article>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </header>

      <form className="relative max-w-md mb-6">
        <label htmlFor="search-clients" className="sr-only">Buscar clientes</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="search-clients"
          type="search"
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card text-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </form>

      <ul className="grid gap-4">
        {filteredClients.map((client) => (
          <li
            key={client.id}
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors"
          >
            <article className="flex items-start gap-4">
              <figure className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </figure>
              <section className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  {client.name}
                </h3>
                <menu className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <li className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </li>
                  <li className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </li>
                </menu>
              </section>
              <aside className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary">{client.visits}</p>
                <p className="text-xs text-muted-foreground">visitas</p>
              </aside>
            </article>
            <footer className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Última visita: {new Date(client.lastVisit).toLocaleDateString("pt-BR")}
              </p>
              <menu className="flex gap-2">
                <li>
                  <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    Ver histórico
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    Agendar
                  </button>
                </li>
              </menu>
            </footer>
          </li>
        ))}
      </ul>

      {showModal && (
        <aside className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <article className="bg-card rounded-2xl w-full max-w-md shadow-xl">
            <header className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Novo Cliente
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </header>

            <form className="p-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Nome completo
                </span>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Telefone
                </span>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Data de nascimento
                </span>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <menu className="flex gap-3 pt-4">
                <li className="flex-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
                  >
                    Cancelar
                  </button>
                </li>
                <li className="flex-1">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
                  >
                    Cadastrar
                  </button>
                </li>
              </menu>
            </form>
          </article>
        </aside>
      )}
    </section>
  );
}
