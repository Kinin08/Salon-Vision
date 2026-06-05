import { profissionais } from '../data.js';
import { stars } from '../helpers.js';
import { toast, openModal } from '../helpers.js';
import { initModals } from '../modals.js';

export function renderProfissionais(c) {
    c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;" class="fade-in">
        <div>
            <h1 style="font-size:22px;font-weight:500;">Nossa <em>Equipe</em></h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:3px;">${profissionais.length} profissionais cadastrados</p>
        </div>
        <button class="btn btn-gold" id="btn-novo-prof"><i class="ti ti-user-plus"></i> Novo Profissional</button>
    </div>
    <div class="prof-grid fade-in" id="prof-grid"></div>`;

    function renderGrid() {
        const grid = document.getElementById('prof-grid');
        grid.innerHTML = '';
        profissionais.forEach(p => {
            const div = document.createElement('div');
            div.className = 'prof-card';
            div.innerHTML = `
            <img src="${p.foto}" class="prof-avatar" />
            <p class="prof-name">${p.nome}</p>
            <p class="prof-role">${p.role}</p>
            <div class="prof-stars">${stars(Math.round(p.nota))} <span style="color:var(--text-dim);margin-left:3px;font-size:11px;">${p.nota}</span></div>
            <span class="pill ${p.ativo ? 'confirmed' : 'cancelled'}" style="margin:8px 0 10px;font-size:9px;">
                <span class="pill-dot"></span>${p.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="toast('Editando ${p.nome} em breve!')"><i class="ti ti-edit"></i> Editar</button>
                <button class="btn btn-danger btn-sm" data-del-prof="${p.id}"><i class="ti ti-trash"></i></button>
            </div>`;
            grid.appendChild(div);
        });
        grid.querySelectorAll('[data-del-prof]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.delProf);
                const pr = profissionais.find(x => x.id === id);
                if (confirm(`Remover ${pr.nome}?`)) {
                    profissionais = profissionais.filter(x => x.id !== id);
                    toast(`${pr.nome} removido.`, 'ti-trash');
                    renderGrid();
                }
            });
        });
    }

    renderGrid();
    document.getElementById('btn-novo-prof')?.addEventListener('click', () => openModal('modalProf'));
}
