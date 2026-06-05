import { meusAgendamentos, STATUS_LABEL } from '../data.js';
import { toast } from '../helpers.js';
import { abrirModal } from '../modals.js';

export function renderAgendamentos(c) {
    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">Meus <em>Agendamentos</em></h1>
                <button class="btn btn-gold" id="btnNovoAptTabela">
                    <i class="ti ti-calendar-plus"></i> Novo Agendamento
                </button>
            </div>

            <div style="overflow-x:auto;">
                <table class="apt-table" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Profissional</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-agendamentos"></tbody>
                </table>
            </div>

            ${meusAgendamentos.length === 0 ? `
                <p style="text-align:center;color:var(--text-dim);padding:28px 0;font-size:13px;">
                    Nenhum agendamento ativo.
                </p>` : ''}
        </div>
    `;

    const tbody = document.getElementById('tbody-agendamentos');
    meusAgendamentos.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size:13px;font-weight:500;">${a.servico}</td>
            <td style="font-size:12px;color:var(--text-muted);">${a.profissional}</td>
            <td style="font-size:12px;color:var(--text-muted);">${a.data}</td>
            <td style="font-size:12px;color:var(--gold);font-weight:500;">${a.hora}</td>
            <td><span class="status-pill ${a.status}"><span class="status-dot"></span>${STATUS_LABEL[a.status]}</span></td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-ghost" style="padding:5px 10px;font-size:11px;" data-id="${a.id}" data-action="reagendar">
                        <i class="ti ti-edit"></i> Reagendar
                    </button>
                    <button class="btn btn-danger" style="padding:5px 10px;font-size:11px;" data-id="${a.id}" data-action="cancelar">
                        <i class="ti ti-x"></i> Cancelar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'cancelar') {
            if (confirm('Deseja cancelar este agendamento?')) {
                const apt = meusAgendamentos.find(x => x.id === id);
                if (apt) apt.status = 'cancelled';
                toast('Agendamento cancelado.', 'ti-x');
                navegarPara(renderAgendamentos);
            }
        }
        if (action === 'reagendar') {
            abrirModal();
            toast('Selecione a nova data e horário.', 'ti-calendar');
        }
    });

    document.getElementById('btnNovoAptTabela')?.addEventListener('click', () => abrirModal());
}