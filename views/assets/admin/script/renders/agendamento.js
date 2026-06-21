import { toast, updateBadge, openModal } from '../helpers.js';
export function renderAgendamentos(c) {
    const STATUS_LABEL = {
        scheduled: 'scheduled',
        confirmed: 'confirmed',
        inProgress: 'in_progress',
        completed: 'completed',
        canceled: 'canceled'
    };
    c.innerHTML = `
    <div class="panel fade-in">
        <div class="panel-header">
            <h1 class="panel-title">Todos os <em>Agendamentos</em></h1>
            <button class="btn btn-gold" id="btn-novo-apt"><i class="ti ti-calendar-plus"></i> Novo Agendamento</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
            ${['Todos', 'Confirmado', 'Pendente', 'Concluído', 'Cancelado'].map((l, i) => `
            <button class="btn btn-ghost btn-sm filter-btn" data-filter="${['all', 'confirmed', 'pending', 'done', 'cancelled'][i]}"
                style="${i === 0 ? 'background:var(--surface-2);color:var(--text);border-color:var(--border-strong);' : ''}">
                ${l}
            </button>`).join('')}
        </div>
        <div style="overflow-x:auto;">
            <table>
                <thead><tr>
                    <th>Cliente</th><th>Serviço</th><th>Profissional</th>
                    <th>Data</th><th>Hora</th><th>Status</th><th>Ações</th>
                </tr></thead>
                <tbody id="tbody-apt"></tbody>
            </table>
        </div>
    </div>`;

    function renderRows(filter) {
        const tbody = document.getElementById('tbody-apt');
        tbody.innerHTML = '';
        const filtered = filter === 'all' ? agendamentos : agendamentos.filter(a => a.status === filter);
        filtered.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td style="font-weight:500;font-size:12.5px;">${a.cliente}</td>
            <td style="font-size:12px;color:var(--text-muted);">${a.servico}</td>
            <td style="font-size:12px;color:var(--text-muted);">${a.prof}</td>
            <td style="font-size:12px;">${a.data}</td>
            <td style="font-size:12px;color:var(--gold);font-weight:500;">${a.hora}</td>
            <td><span class="pill ${a.status}"><span class="pill-dot"></span>${LABEL[a.status]}</span></td>
            <td>
                <div style="display:flex;gap:5px;">
                    ${a.status === 'pending' ? `<button class="btn btn-green btn-sm" data-id="${a.id}" data-action="confirmar"><i class="ti ti-check"></i> Confirmar</button>` : ''}
                    ${a.status !== 'cancelled' && a.status !== 'done' ? `<button class="btn btn-danger btn-sm" data-id="${a.id}" data-action="cancelar"><i class="ti ti-x"></i></button>` : ''}
                </div>
            </td>`;
            tbody.appendChild(tr);
        });

        tbody.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id = parseInt(btn.dataset.id);
            const apt = agendamentos.find(x => x.id === id);
            if (!apt) return;
            if (btn.dataset.action === 'confirmar') {
                apt.status = 'confirmed';
                toast('Agendamento confirmado!', 'ti-check');
                updateBadge();
                renderRows(filter);
            }
            if (btn.dataset.action === 'cancelar') {
                if (confirm('Cancelar este agendamento?')) {
                    apt.status = 'cancelled';
                    toast('Agendamento cancelado.', 'ti-x');
                    updateBadge();
                    renderRows(filter);
                }
            }
        });
    }

    renderRows('all');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = ''; b.style.color = ''; b.style.borderColor = '';
            });
            btn.style.background = 'var(--surface-2)';
            btn.style.color = 'var(--text)';
            btn.style.borderColor = 'var(--border-strong)';
            renderRows(btn.dataset.filter);
        });
    });

    document.getElementById('btn-novo-apt')?.addEventListener('click', () => openModal('modalAgendar'));
}