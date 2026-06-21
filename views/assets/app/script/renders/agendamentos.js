import { estrelas, toast } from '../helpers.js';
import { abrirModal } from '../modals.js';
import { carregarDadosAgendamento } from './agendamentosService.js';

export async function renderAgendamentos(c) {
    const STATUS_LABEL = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        in_progress: 'Em andamento',
        completed: 'Concluído',
        canceled: 'Cancelado'
    };
    try {

        const token = localStorage.getItem('token');

        const response = await fetch(
            'http://localhost/Salon-Vision/api/appointments/my',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        const agendamentos = result.data || [];

        const ativos = agendamentos.filter(a =>
            ['scheduled', 'confirmed', 'in_progress'].includes(a.status)
        );

        const historico = agendamentos.filter(a =>
            ['completed', 'canceled'].includes(a.status)
        );

        c.innerHTML = `
            <div class="gap-y">

                <div class="panel fade-in">
                    <div class="panel-header">
                        <h1 class="panel-title">
                            Meus <em>Agendamentos</em>
                        </h1>

                        <button
                            class="btn btn-gold"
                            id="btnNovoAptTabela"
                        >
                            <i class="ti ti-calendar-plus"></i>
                            Novo Agendamento
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
                </div>

                <div class="panel fade-in">
                    <div class="panel-header">
                        <h1 class="panel-title">
                            Histórico de <em>Atendimentos</em>
                        </h1>

                        <span class="panel-action">
                            ${historico.length} registros
                        </span>
                    </div>

                    <div id="historico-list"></div>
                </div>

            </div>
        `;

        const tbody = document.getElementById('tbody-agendamentos');

        if (!ativos.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;padding:20px;color:var(--text-dim);">
                        Nenhum agendamento ativo.
                    </td>
                </tr>
            `;
        }

        ativos.forEach(a => {
            const tr = document.createElement('tr');

            const data = new Date(a.date_time);

            tr.innerHTML = `
                <td>${a.service}</td>
                <td>${a.employee}</td>
                <td>${data.toLocaleDateString('pt-BR')}</td>
                <td>
                    ${data.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })}
                </td>

                <td>
                    <span class="status-pill ${a.status}">
                        <span class="status-dot"></span>
                        ${STATUS_LABEL[a.status] || a.status}
                    </span>
                </td>

                <td>
                    <div style="display:flex;gap:6px;">
                        <button
                            class="btn btn-ghost"
                            style="padding:5px 10px;font-size:11px;"
                            data-id="${a.id}"
                            data-action="reagendar"
                        >
                            <i class="ti ti-edit"></i>
                            Reagendar
                        </button>

                        <button
                            class="btn btn-danger"
                            style="padding:5px 10px;font-size:11px;"
                            data-id="${a.id}"
                            data-action="cancelar"
                        >
                            <i class="ti ti-x"></i>
                            Cancelar
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        const historicoList = document.getElementById('historico-list');

        if (!historico.length) {
            historicoList.innerHTML = `
                <p style="text-align:center;padding:20px;color:var(--text-dim);">
                    Nenhum atendimento encontrado.
                </p>
            `;
        }

        historico.forEach(h => {
            const div = document.createElement('div');

            div.className = 'history-item';

            div.innerHTML = `
                <div class="history-icon">
                    <i class="ti ti-cut"></i>
                </div>

                <div class="history-info">
                    <p class="history-service">
                        ${h.service}
                    </p>

                    <p class="history-meta">
                        com ${h.employee}
                        ·
                        ${new Date(h.date_time)
                    .toLocaleDateString('pt-BR')}
                    </p>
                </div>

                <div class="history-right">
                    <p class="history-value">
                        R$ ${Number(h.price).toFixed(2)}
                    </p>

                    ${h.rating
                    ? `
                            <p class="history-stars">
                                ${estrelas(h.rating)}
                            </p>
                        `
                    : ''
                }
                </div>
            `;

            historicoList.appendChild(div);
        });

        tbody.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-action]');

            if (!btn) return;

            const id = btn.dataset.id;
            const action = btn.dataset.action;

            if (action === 'reagendar') {
                try {
                    const detalheRes = await fetch(
                        `http://localhost/Salon-Vision/api/appointments/list/${id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const detalheResult = await detalheRes.json();
                    const agendamentoCompleto = detalheResult.data;

                    abrirModal(agendamentoCompleto); // agora com serviceId/employeeId reais

                    toast('Selecione uma nova data e horário.', 'ti-calendar');

                } catch (error) {
                    console.error(error);
                    toast('Erro ao carregar dados do agendamento.', 'ti-alert-circle');
                }

                return;
            }

            if (action === 'cancelar') {
                if (!confirm('Deseja cancelar este agendamento?')) {
                    return;
                }

                try {
                    const response = await fetch(
                        `http://localhost/Salon-Vision/api/appointments/delete/${id}`,
                        {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        toast(
                            result.message || 'Erro ao cancelar.',
                            'ti-alert-circle'
                        );
                        return;
                    }

                    toast(
                        'Agendamento cancelado.',
                        'ti-check'
                    );

                    renderAgendamentos(c);

                } catch (error) {
                    console.error(error);

                    toast(
                        'Erro ao cancelar agendamento.',
                        'ti-alert-circle'
                    );
                }
            }
        });

        document
            .getElementById('btnNovoAptTabela')
            ?.addEventListener('click', () => {
                abrirModal();
            });

    } catch (error) {
        console.error(error);

        c.innerHTML = `
            <div class="panel">
                <p style="padding:20px;text-align:center;">
                    Erro ao carregar agendamentos.
                </p>
            </div>
        `;
    }
}
