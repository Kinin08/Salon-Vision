"use client";

import { useState } from "react";
import { User, Bell, Palette, Shield, CreditCard, Check } from "lucide-react";

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "assinatura", label: "Assinatura", icon: CreditCard },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu salão
        </p>
      </header>

      <article className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-64 flex-shrink-0">
          <ul className="bg-card rounded-2xl border border-border p-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="flex-1 bg-card rounded-2xl border border-border p-6">
          {activeTab === "perfil" && (
            <form className="space-y-6">
              <fieldset>
                <legend className="text-xl font-semibold text-foreground mb-6">
                  Informações do Salão
                </legend>

                <article className="flex items-center gap-6 mb-6">
                  <figure className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </figure>
                  <button
                    type="button"
                    className="px-4 py-2 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
                  >
                    Alterar foto
                  </button>
                </article>

                <section className="grid md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">
                      Nome do salão
                    </span>
                    <input
                      type="text"
                      defaultValue="Studio Beauty"
                      className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">
                      CNPJ
                    </span>
                    <input
                      type="text"
                      defaultValue="12.345.678/0001-90"
                      className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">
                      Email
                    </span>
                    <input
                      type="email"
                      defaultValue="contato@studiobeauty.com"
                      className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">
                      Telefone
                    </span>
                    <input
                      type="tel"
                      defaultValue="(11) 3456-7890"
                      className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-foreground mb-2 block">
                      Endereço
                    </span>
                    <input
                      type="text"
                      defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP"
                      className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </label>
                </section>
              </fieldset>

              <footer className="flex justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Salvo!
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </button>
              </footer>
            </form>
          )}

          {activeTab === "notificacoes" && (
            <article>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Preferências de Notificação
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <article>
                    <p className="font-medium text-foreground">Lembretes de agendamento</p>
                    <p className="text-sm text-muted-foreground">Enviar lembretes para clientes</p>
                  </article>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary/20" />
                </li>
                <li className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <article>
                    <p className="font-medium text-foreground">Alertas de estoque</p>
                    <p className="text-sm text-muted-foreground">Notificar quando produtos estiverem baixos</p>
                  </article>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary/20" />
                </li>
                <li className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <article>
                    <p className="font-medium text-foreground">Relatórios semanais</p>
                    <p className="text-sm text-muted-foreground">Receber resumo por email</p>
                  </article>
                  <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary/20" />
                </li>
              </ul>
            </article>
          )}

          {activeTab === "aparencia" && (
            <article>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Personalização Visual
              </h2>
              <section className="space-y-6">
                <label className="block">
                  <span className="text-sm font-medium text-foreground mb-3 block">
                    Tema
                  </span>
                  <menu className="flex gap-3">
                    <li>
                      <button className="p-4 bg-white border-2 border-primary rounded-xl">
                        <span className="block w-8 h-8 bg-gray-100 rounded-lg" />
                        <span className="text-sm mt-2 block">Claro</span>
                      </button>
                    </li>
                    <li>
                      <button className="p-4 bg-muted border border-border rounded-xl">
                        <span className="block w-8 h-8 bg-gray-800 rounded-lg" />
                        <span className="text-sm mt-2 block">Escuro</span>
                      </button>
                    </li>
                    <li>
                      <button className="p-4 bg-muted border border-border rounded-xl">
                        <span className="block w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-800 rounded-lg" />
                        <span className="text-sm mt-2 block">Sistema</span>
                      </button>
                    </li>
                  </menu>
                </label>
              </section>
            </article>
          )}

          {activeTab === "seguranca" && (
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Segurança da Conta
              </h2>
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Senha atual
                </span>
                <input
                  type="password"
                  className="w-full max-w-md px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Nova senha
                </span>
                <input
                  type="password"
                  className="w-full max-w-md px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Confirmar nova senha
                </span>
                <input
                  type="password"
                  className="w-full max-w-md px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
              >
                Alterar senha
              </button>
            </form>
          )}

          {activeTab === "assinatura" && (
            <article>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Plano Atual
              </h2>
              <section className="p-6 bg-primary/10 rounded-2xl border border-primary/20 mb-6">
                <header className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Profissional
                  </span>
                  <span className="text-2xl font-bold text-foreground">R$ 89/mês</span>
                </header>
                <p className="text-muted-foreground mb-4">
                  Sua próxima cobrança será em 15 de junho de 2026
                </p>
                <menu className="flex gap-3">
                  <li>
                    <button className="px-4 py-2 bg-card border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors">
                      Alterar plano
                    </button>
                  </li>
                  <li>
                    <button className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl font-medium transition-colors">
                      Cancelar assinatura
                    </button>
                  </li>
                </menu>
              </section>
            </article>
          )}
        </section>
      </article>
    </section>
  );
}
