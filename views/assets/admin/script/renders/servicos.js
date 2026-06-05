import { catalogo } from '../data.js';
import { toast, openModal } from '../helpers.js';
import { nav } from '../helpers.js';
import { initModals } from '../modals.js';
export function renderServicos(c) {
    c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;" class="fade-in">
        <div>
            <h1 style="font-size:22px;font-weight:500;">Catálogo de <em>Serviços</em></h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:3px;">${catalogo.length} serviços ativos</p>
        </div>
        <button class="btn btn-gold" id="btn-novo-serv"><i class="ti ti-plus"></i> Novo Serviço</button>
    </div>
    <div class="service-grid fade-in" id="service-grid"></div>`;

    function renderGrid() {
        const grid = document.getElementById('service-grid');
        grid.innerHTML = '';
        catalogo.forEach(s => {
            const div = document.createElement('div');
            div.className = 'service-card';
            div.innerHTML = `
            <div class="service-icon"><i class="ti ${s.icon}"></i></div>
            <p class="service-name">${s.nome}</p>
            <p class="service-desc">${s.desc}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                <span style="font-size:10px;color:var(--text-dim);"><i class="ti ti-clock"></i> ${s.duracao}</span>
                <span class="service-price">${s.valor}</span>
            </div>
            <div style="display:flex;gap:6px;margin-top:10px;">
                <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="toast('Editando ${s.nome} em breve!')"><i class="ti ti-edit"></i> Editar</button>
                <button class="btn btn-danger btn-sm" data-del-serv="${s.id}"><i class="ti ti-trash"></i></button>
            </div>`;
            grid.appendChild(div);
        });
        grid.querySelectorAll('[data-del-serv]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.delServ);
                const sv = catalogo.find(x => x.id === id);
                if (confirm(`Remover serviço "${sv.nome}"?`)) {
                    catalogo = catalogo.filter(x => x.id !== id);
                    toast(`"${sv.nome}" removido.`, 'ti-trash');
                    renderGrid();
                }
            });
        });
    }

    renderGrid();
    document.getElementById('btn-novo-serv')?.addEventListener('click', () => openModal('modalServico'));
}