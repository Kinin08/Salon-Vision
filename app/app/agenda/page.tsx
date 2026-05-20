"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  X,
} from "lucide-react";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const mockAppointments = [
  { id: 1, client: "Ana Paula", service: "Corte", time: "09:00", duration: 1, professional: "Maria" },
  { id: 2, client: "Fernanda", service: "Manicure", time: "10:00", duration: 1, professional: "Carla" },
  { id: 3, client: "Juliana", service: "Coloração", time: "14:00", duration: 2, professional: "Maria" },
];

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Agenda
          </h1>
          <p className="text-muted-foreground capitalize">
            {formatDate(currentDate)}
          </p>
        </article>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </header>

      <nav className="flex items-center justify-between mb-6">
        <menu className="flex items-center gap-2">
          <li>
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Dia anterior"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
            >
              Hoje
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Próximo dia"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </li>
        </menu>

        <menu className="flex bg-muted rounded-lg p-1">
          <li>
            <button className="px-4 py-2 text-sm font-medium bg-card rounded-md shadow-sm">
              Dia
            </button>
          </li>
          <li>
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Semana
            </button>
          </li>
          <li>
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Mês
            </button>
          </li>
        </menu>
      </nav>

      <article className="bg-card rounded-2xl border border-border overflow-hidden">
        <header className="grid grid-cols-[80px_1fr_1fr] border-b border-border">
          <span className="p-4 text-sm font-medium text-muted-foreground border-r border-border">
            Horário
          </span>
          <span className="p-4 text-sm font-medium text-foreground border-r border-border">
            Maria
          </span>
          <span className="p-4 text-sm font-medium text-foreground">
            Carla
          </span>
        </header>

        <section className="relative">
          {timeSlots.map((time) => (
            <article
              key={time}
              className="grid grid-cols-[80px_1fr_1fr] border-b border-border last:border-b-0"
            >
              <span className="p-4 text-sm text-muted-foreground border-r border-border">
                {time}
              </span>
              <span className="p-2 border-r border-border min-h-[60px] relative">
                {mockAppointments
                  .filter((apt) => apt.time === time && apt.professional === "Maria")
                  .map((apt) => (
                    <button
                      key={apt.id}
                      className="w-full p-3 bg-primary/10 border-l-4 border-primary rounded-lg text-left hover:bg-primary/20 transition-colors"
                      style={{ height: `${apt.duration * 60 - 8}px` }}
                    >
                      <p className="font-medium text-foreground text-sm truncate">
                        {apt.client}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.service}
                      </p>
                    </button>
                  ))}
              </span>
              <span className="p-2 min-h-[60px] relative">
                {mockAppointments
                  .filter((apt) => apt.time === time && apt.professional === "Carla")
                  .map((apt) => (
                    <button
                      key={apt.id}
                      className="w-full p-3 bg-secondary/10 border-l-4 border-secondary rounded-lg text-left hover:bg-secondary/20 transition-colors"
                      style={{ height: `${apt.duration * 60 - 8}px` }}
                    >
                      <p className="font-medium text-foreground text-sm truncate">
                        {apt.client}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.service}
                      </p>
                    </button>
                  ))}
              </span>
            </article>
          ))}
        </section>
      </article>

      {showModal && (
        <aside className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <article className="bg-card rounded-2xl w-full max-w-md shadow-xl">
            <header className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Novo Agendamento
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
                  Cliente
                </span>
                <span className="relative block">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    className="w-full pl-10 pr-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Serviço
                </span>
                <select className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option>Selecione um serviço</option>
                  <option>Corte Feminino</option>
                  <option>Corte + Escova</option>
                  <option>Coloração</option>
                  <option>Manicure</option>
                  <option>Pedicure</option>
                  <option>Hidratação</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Profissional
                </span>
                <select className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option>Selecione o profissional</option>
                  <option>Maria</option>
                  <option>Carla</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Horário
                </span>
                <span className="relative block">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="time"
                    className="w-full pl-10 pr-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </span>
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
                    Agendar
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
