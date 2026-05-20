"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", href: "/admin" },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: Building2, label: "Salões", href: "/admin/saloes" },
  { icon: FileText, label: "Relatórios", href: "/admin/relatorios" },
  { icon: Settings, label: "Sistema", href: "/admin/sistema" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-foreground text-background flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <header className="p-4 border-b border-background/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <figure className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </figure>
          {!collapsed && (
            <article>
              <span className="font-serif text-lg font-semibold block">
                Salon Vision
              </span>
              <span className="text-xs text-background/60">Admin</span>
            </article>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-background/60 hover:text-background hover:bg-background/10 rounded-lg transition-colors"
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
                      : "text-background/70 hover:bg-background/10 hover:text-background"
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

      <footer className="p-4 border-t border-background/10">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-3 text-background/70 hover:text-destructive hover:bg-destructive/20 rounded-xl transition-colors"
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </Link>
      </footer>
    </aside>
  );
}
