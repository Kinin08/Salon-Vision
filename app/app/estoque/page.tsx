"use client";

import { useState } from "react";
import { Search, Plus, Package, AlertTriangle, X } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Shampoo Profissional 1L", category: "Cabelo", stock: 3, minStock: 5, price: 45.90, status: "low" },
  { id: 2, name: "Condicionador Profissional 1L", category: "Cabelo", stock: 8, minStock: 5, price: 42.90, status: "ok" },
  { id: 3, name: "Tinta Loiro Médio", category: "Coloração", stock: 0, minStock: 10, price: 28.00, status: "out" },
  { id: 4, name: "Oxidante 20 Vol", category: "Coloração", stock: 12, minStock: 5, price: 15.00, status: "ok" },
  { id: 5, name: "Esmalte Rosa Claro", category: "Unhas", stock: 5, minStock: 10, price: 8.90, status: "low" },
  { id: 6, name: "Acetona", category: "Unhas", stock: 20, minStock: 10, price: 6.50, status: "ok" },
  { id: 7, name: "Hidratante Capilar", category: "Tratamento", stock: 7, minStock: 5, price: 55.00, status: "ok" },
];

const statusColors = {
  ok: "bg-success/10 text-success",
  low: "bg-warning/10 text-warning",
  out: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  ok: "Em estoque",
  low: "Estoque baixo",
  out: "Esgotado",
};

export default function EstoquePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = mockProducts.filter((p) => p.status === "low" || p.status === "out").length;

  return (
    <section>
      <header className="flex items-center justify-between mb-8">
        <article>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Estoque
          </h1>
          <p className="text-muted-foreground">
            {mockProducts.length} produtos cadastrados
          </p>
        </article>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </header>

      {lowStockCount > 0 && (
        <aside className="flex items-center gap-3 p-4 bg-warning/10 rounded-xl mb-6">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-sm text-foreground">
            <strong>{lowStockCount} produtos</strong> precisam de reposição
          </p>
        </aside>
      )}

      <nav className="flex flex-col sm:flex-row gap-4 mb-6">
        <form className="relative flex-1 max-w-md">
          <label htmlFor="search-products" className="sr-only">Buscar produtos</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="search-products"
            type="search"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card text-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </form>

        <menu className="flex bg-muted rounded-lg p-1">
          <li>
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterStatus === "all" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Todos
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilterStatus("low")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterStatus === "low" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Baixo
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilterStatus("out")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterStatus === "out" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Esgotado
            </button>
          </li>
        </menu>
      </nav>

      <article className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produto</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Quantidade</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Preço</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <span className="flex items-center gap-3">
                    <figure className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </figure>
                    <span className="font-medium text-foreground">{product.name}</span>
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                <td className="p-4 text-center">
                  <span className={product.stock <= product.minStock ? "text-warning font-semibold" : "text-foreground"}>
                    {product.stock}
                  </span>
                  <span className="text-muted-foreground text-sm"> / {product.minStock} min</span>
                </td>
                <td className="p-4 text-right font-medium text-foreground">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[product.status as keyof typeof statusColors]}`}>
                    {statusLabels[product.status as keyof typeof statusLabels]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {showModal && (
        <aside className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <article className="bg-card rounded-2xl w-full max-w-md shadow-xl">
            <header className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Novo Produto
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
                  Nome do produto
                </span>
                <input
                  type="text"
                  placeholder="Ex: Shampoo Profissional"
                  className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Categoria
                </span>
                <select className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option>Selecione a categoria</option>
                  <option>Cabelo</option>
                  <option>Coloração</option>
                  <option>Unhas</option>
                  <option>Tratamento</option>
                </select>
              </label>

              <fieldset className="grid grid-cols-2 gap-4">
                <legend className="sr-only">Quantidade e preço</legend>
                <label className="block">
                  <span className="text-sm font-medium text-foreground mb-2 block">
                    Quantidade
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground mb-2 block">
                    Estoque mínimo
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="5"
                    className="w-full px-4 py-3 bg-input text-input-foreground rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </label>
              </fieldset>

              <label className="block">
                <span className="text-sm font-medium text-foreground mb-2 block">
                  Preço (R$)
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
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
