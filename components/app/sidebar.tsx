"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
  { icon: Calendar, label: "Agenda", href: "/app/agenda" },
  { icon: Users, label: "Clientes", href: "/app/clientes" },
  { icon: Package, label: "Estoque", href: "/app/estoque" },
  { icon: BarChart3, label: "Relatórios", href: "/app/relatorios" },
  { icon: Settings, label: "Configurações", href: "/app/configuracoes" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <header className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/app" className="flex items-center gap-3">
          <figure className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Scissors className="w-5 h-5 text-primary-foreground" />
          </figure>
          {!collapsed && (
            <span className="font-serif text-lg font-semibold text-foreground">
              Salon Vision
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </header>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-4 border-t border-border">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </footer>
    </aside>
  );
}
