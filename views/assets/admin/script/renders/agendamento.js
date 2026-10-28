import { LABEL } from '../data.js';
import { toast, updateBadge, openModal } from '../helpers.js';
import { listIncomplete, listAll } from '../../../_common/Api/appointmants.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function pegar(obj, caminhos) {
    for (const caminho of caminhos) {
        const valor = caminho.split('.').reduce((acc, k) => acc?.[k], obj);

        if (valor === undefined || valor === null || valor === '') continue;

        if (typeof valor === 'object') {
            const nome = valor.name ?? valor.nome;
            if (nome) return nome;
            continue;
        }

        return valor;
    }
    return null;
}

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
                ${['Todos', 'Confirmado', 'Pendente', 'Concluído', 'Cancelado', 'agendados']
            .map((label, i) => `
                        <button
                            class="btn btn-ghost btn-sm filter-btn"
                            data-filter="${['all', 'confirmed', 'in_progress', 'completed', 'canceled', 'scheduled'][i]}"
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

    let appointments = [];
    let currentFilter = 'all';

    // Tenta listAll; se falhar ou vier vazio, tenta listIncomplete
    let carregou = false;

    for (const buscar of [listAll, listIncomplete]) {
        try {
            const response = await buscar();
            const lista = Array.isArray(response)
                ? response
                : response?.data ?? response?.appointments ?? [];

            carregou = true;

            if (Array.isArray(lista) && lista.length > 0) {
                appointments = lista;
                break;
            }
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    }

    if (!carregou) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Não foi possível carregar os agendamentos.
                </td>
            </tr>
        `;
        return;
    }

    function renderRows(filter) {
        currentFilter = filter;
        tbody.innerHTML = '';

        const filtered = filter === 'all'
            ? appointments
            : appointments.filter(a => a.status === filter);

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

                <td style="font-size:12px;color:var(--text-muted);">
                    ${esc(servico)}
                </td>

                <td style="font-size:12px;color:var(--text-muted);">
                    ${esc(profissional)}
                </td>

                <td style="font-size:12px;">
                    ${esc(data)}
                </td>

                <td style="font-size:12px;color:var(--gold);font-weight:500;">
                    ${esc(hora)}
                </td>

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
    tbody.addEventListener('click', async e => {
        const btn = e.target.closest('[data-action]');

        if (!btn) return;

        const id = Number(btn.dataset.id);
        const appointment = appointments.find(a => Number(a.id) === id);

        if (!appointment) return;

        if (btn.dataset.action === 'confirmar') {
            if (appointment.status !== 'pending') return;

            // Atualiza apenas a interface e os dados em memória.
            appointment.status = 'confirmed';

            toast('Agendamento confirmado!', 'ti-check');
            updateBadge();
            renderRows(currentFilter);
        }

        if (btn.dataset.action === 'cancelar') {
            if (!confirm('Cancelar este agendamento?')) return;

            appointment.status = 'cancelled';

            toast('Agendamento cancelado.', 'ti-x');
            updateBadge();
            renderRows(currentFilter);
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

    // Novo agendamento.
    c.querySelector('#btn-novo-apt')?.addEventListener('click', () => {
        openModal('modalAgendar');
    });

    renderRows('all');
}