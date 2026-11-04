import { LABEL } from '../data.js';
import { mostrarFeedback, mostrarRespostaAPI } from '../../../_common/script/Feedback.js';
import Appointmants from '../../../_common/classes/Appointmants.js';
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

// A API/telas misturam as grafias (cancelled/canceled, done/completed)
const CANCELADO = ['cancelled', 'canceled'];
const CONCLUIDO = ['done', 'completed'];

export async function renderAgendamentos(c) {
    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">
                    Todos os <em>Agendamentos</em>
                </h1>
            </div>

            <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
                ${['Todos', 'Pendente', 'Concluído', 'Cancelado', 'Agendados']
            .map((label, i) => `
                        <button
                            class="btn btn-ghost btn-sm filter-btn"
                            data-filter="${['all', 'in_progress', 'completed', 'canceled', 'scheduled'][i]}"
                            style="${i === 0
                    ? 'background:var(--surface-2);color:var(--text);border-color:var(--border-strong);'
                    : ''}"
                        >
                            ${label}
                        </button>
                    `).join('')}
            </div>

            <div style="overflow-x:auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Profissional</th>
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

    // Tenta listAll; se falhar ou vier vazio, tenta listIncomplete

    const api = new Appointmants();
    let appointments = [];
    let currentFilter = 'all';

    async function loadAppointments() {
        const response = await api.listAll();
        const lista = Array.isArray(response)
            ? response
            : response?.data ?? response?.appointments ?? [];
        appointments = Array.isArray(lista) ? lista : [];
    }

    try {
        await loadAppointments();
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        tbody.innerHTML = `
        <tr><td colspan="7">Não foi possível carregar os agendamentos.</td></tr>
    `;
        return;
    }

    function filtrar(filter) {
        if (filter === 'all') return appointments;
        if (filter === 'canceled') return appointments.filter(a => CANCELADO.includes(a.status));
        if (filter === 'completed') return appointments.filter(a => CONCLUIDO.includes(a.status));
        return appointments.filter(a => a.status === filter);
    }

    function renderRows(filter) {
        currentFilter = filter;
        tbody.innerHTML = '';

        const filtered = filtrar(filter);

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:24px;">
                        Nenhum agendamento encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(a => {
            const tr = document.createElement('tr');

            const { data, hora } = dataHora(a);

            const nomeCliente = a.client ?? '—';
            const fotoCliente = a.photo;
            const servico = a.service ?? '—';
            const profissional = a.employee ?? '—';

            const cancelado = CANCELADO.includes(a.status);
            const concluido = CONCLUIDO.includes(a.status);

            tr.innerHTML = `
                <td>
                    <div class="client-cell">
                        <img
                            class="client-avatar"
                            src="${esc(fotoCliente || FOTO_PADRAO)}"
                            alt="Foto de ${esc(nomeCliente)}"
                        />
                        <span class="client-name" style="font-weight:500;font-size:12.5px;">
                            ${esc(nomeCliente)}
                        </span>
                    </div>
                </td>

                <td style="font-size:12px;color:var(--text-muted);">${esc(servico)}</td>
                <td style="font-size:12px;color:var(--text-muted);">${esc(profissional)}</td>
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
                        ${a.status === 'pending'
                    ? `
                                <button
                                    class="btn btn-green btn-sm"
                                    data-id="${esc(a.id)}"
                                    data-action="confirmar"
                                >
                                    <i class="ti ti-check"></i>
                                    Confirmar
                                </button>
                            `
                    : ''}

                        ${!cancelado && !concluido
                    ? `
                                <button
                                    class="btn btn-danger btn-sm"
                                    data-id="${esc(a.id)}"
                                    data-action="cancelar"
                                >
                                    <i class="ti ti-x"></i>
                                </button>
                            `
                    : ''}
                    </div>
                </td>
            `;

            // Foto quebrada -> foto padrão
            tr.querySelector('img')?.addEventListener('error', (e) => {
                e.target.src = FOTO_PADRAO;
            }, { once: true });

            tbody.appendChild(tr);
        });
    }

    // Um único evento para confirmar ou cancelar.
    tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const appointment = appointments.find(a => Number(a.id) === id);
    if (!appointment) return;

    if (btn.dataset.action === 'confirmar') {
        if (appointment.status !== 'pending') return;

        // ainda só em memória
        appointment.status = 'confirmed';
        mostrarFeedback('Agendamento confirmado!', 'success');
        renderRows(currentFilter);
        return;
    }

    if (btn.dataset.action === 'cancelar') {
        if (!confirm('Cancelar este agendamento?')) return;

        btn.disabled = true;

        try {
            const resposta = await api.softDelete(id);
            console.log('Resposta cancelar agendamento:', resposta);

            if (resposta?.code === 200 || resposta?.code === 201) {
                mostrarFeedback('Agendamento cancelado com sucesso.', 'success');
            } else if (resposta?.code === 404) {
                mostrarFeedback('Esse agendamento já foi cancelado.', 'warning');
            } else {
                mostrarRespostaAPI(resposta);
                btn.disabled = false;
                return;
            }

            await loadAppointments();
            renderRows(currentFilter);
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            mostrarFeedback('Não foi possível cancelar o agendamento.', 'error');
            btn.disabled = false;
        }
    }
});

    // Filtros.
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.style.background = '';
                b.style.color = '';
                b.style.borderColor = '';
            });

            btn.style.background = 'var(--surface-2)';
            btn.style.color = 'var(--text)';
            btn.style.borderColor = 'var(--border-strong)';

            renderRows(btn.dataset.filter);
        });
    });

    renderRows('all');
}