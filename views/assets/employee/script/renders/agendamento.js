import { LABEL } from '../data.js';
import { mostrarFeedback, mostrarRespostaAPI } from '../../../_common/script/Feedback.js';
import Appointmants from '../../../_common/classes/Appointmants.js';
import { myAppointmentsByPeriod } from '../../../_common/Api/appointmants.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function dataHora(a) {
    const d = new Date(String(a.date_time ?? '').replace(' ', 'T'));

    if (isNaN(d)) return { data: '—', hora: '—' };

    return {
        data: d.toLocaleDateString('pt-BR'),
        hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
}

const FILTROS = [
    { label: 'Todos',        value: 'all' },
    { label: 'Agendados',    value: 'scheduled' },
    { label: 'Confirmados',  value: 'confirmed' },
    { label: 'Em andamento', value: 'in_progress' },
    { label: 'Concluídos',   value: 'completed' }
];

const ESTILO_ATIVO = 'background:var(--surface-2);color:var(--text);border-color:var(--border-strong);';

export async function renderAgendamentos(c) {
    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">
                    Meus <em>Agendamentos</em>
                </h1>
            </div>

            <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
                ${FILTROS.map((f, i) => `
                    <button
                        class="btn btn-ghost btn-sm filter-btn"
                        data-filter="${f.value}"
                        style="${i === 0 ? ESTILO_ATIVO : ''}"
                    >
                        ${f.label}
                    </button>
                `).join('')}
            </div>

            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-apt"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = c.querySelector('#tbody-apt');
    const filterButtons = c.querySelectorAll('.filter-btn');

    const api = new Appointmants();
    let appointments = [];
    let currentFilter = 'all';

    async function loadAppointments() {
        appointments = await myAppointmentsByPeriod('all');
    }

    await loadAppointments();

    function filtrar(filter) {
        if (filter === 'all') return appointments;
        return appointments.filter(a => a.status === filter);
    }

    function renderRows(filter) {
        currentFilter = filter;
        tbody.innerHTML = '';

        const filtered = filtrar(filter);

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:24px;">
                        Nenhum agendamento encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(a => {
            const tr = document.createElement('tr');
            const { data, hora } = dataHora(a);

            const podeConfirmar = a.status === 'scheduled';
            const podeCancelar = ['scheduled', 'confirmed'].includes(a.status);

            tr.innerHTML = `
                <td>
                    <div class="client-cell">
                        <img
                            class="client-avatar"
                            src="${esc(a.client_photo || FOTO_PADRAO)}"
                            alt="Foto de ${esc(a.client_name)}"
                        />
                        <span class="client-name" style="font-weight:500;font-size:12.5px;">
                            ${esc(a.client_name ?? '—')}
                        </span>
                    </div>
                </td>

                <td style="font-size:12px;color:var(--text-muted);">${esc(a.service_name ?? '—')}</td>
                <td style="font-size:12px;">${esc(data)}</td>
                <td style="font-size:12px;color:var(--gold);font-weight:500;">${esc(hora)}</td>

                <td>
                    <span class="pill ${esc(a.status)}">
                        <span class="pill-dot"></span>
                        ${esc(LABEL[a.status] ?? a.status ?? 'Desconhecido')}
                    </span>
                </td>

                <td>
                    <div style="display:flex;gap:5px;">
                        ${podeConfirmar ? `
                            <button class="btn btn-green btn-sm"
                                    data-id="${esc(a.id)}" data-action="confirmar">
                                <i class="ti ti-check"></i> Confirmar
                            </button>` : ''}

                        ${podeCancelar ? `
                            <button class="btn btn-danger btn-sm"
                                    data-id="${esc(a.id)}" data-action="cancelar">
                                <i class="ti ti-x"></i>
                            </button>` : ''}
                    </div>
                </td>
            `;

            tr.querySelector('img')?.addEventListener('error', (e) => {
                e.target.src = FOTO_PADRAO;
            }, { once: true });

            tbody.appendChild(tr);
        });
    }

    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const id = Number(btn.dataset.id);
        if (!appointments.some(a => Number(a.id) === id)) return;

        const acao = btn.dataset.action;

        if (acao === 'cancelar' && !confirm('Cancelar este agendamento?')) return;

        btn.disabled = true;

        try {
            const resposta = acao === 'confirmar'
                ? await api.update(id, { status: 'confirmed' })
                : await api.softDelete(id);

            mostrarRespostaAPI(resposta);

            if (resposta?.code >= 200 && resposta?.code < 300) {
                await loadAppointments();
                renderRows(currentFilter);
                return;
            }

            btn.disabled = false;
        } catch (error) {
            console.error(`Erro ao ${acao} agendamento:`, error);
            mostrarFeedback('Não foi possível concluir a operação.', 'error');
            btn.disabled = false;
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.style.background = '';
                b.style.color = '';
                b.style.borderColor = '';
            });

            btn.style.cssText += ESTILO_ATIVO;
            renderRows(btn.dataset.filter);
        });
    });

    renderRows('all');
}