"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <form className="relative max-w-md flex-1">
        <label htmlFor="search" className="sr-only">
          Buscar
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="search"
          type="search"
          placeholder="Buscar clientes, agendamentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </form>

      <nav className="flex items-center gap-4">
        <button
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors">
          <figure className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </figure>
          <span className="hidden md:block text-sm font-medium text-foreground">
            Maria Silva
          </span>
        </button>
      </nav>
    </header>
  );
}
