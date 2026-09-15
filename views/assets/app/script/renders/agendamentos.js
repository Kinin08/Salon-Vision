import { toast } from '../helpers.js';
import { abrirModal } from '../modals.js';
import { meusAgendamentos } from '../../../_common/Api/appointmants.js';

export async function renderAgendamentos(c) {

    const agendamentos = await meusAgendamentos();

    c.innerHTML = `

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
                            <th>Comentário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="tbody-agendamentos"></tbody>

                </table>

            </div>

            ${agendamentos.length === 0
            ? `
                        <p style="
                            text-align:center;
                            color:var(--text-dim);
                            padding:28px 0;
                            font-size:13px;
                        ">
                            Nenhum agendamento ativo.
                        </p>
                    `
            : ''
        }

        </div>

    `;

    const tbody = document.getElementById('tbody-agendamentos');

    agendamentos.forEach(a => {

        const tr = document.createElement('tr');

        const [data, hora] = a.date_time.split(' ');

        tr.innerHTML = `

            <!-- Serviço -->
            <td style="
                font-size:13px;
                font-weight:500;
            ">
                ${a.service_name}
            </td>

            <!-- Profissional -->
            <td style="
                font-size:12px;
                color:var(--text-muted);
            ">
                ${a.employee_name}
            </td>

            <!-- Data -->
            <td style="
                font-size:12px;
                color:var(--text-muted);
            ">
                ${data}
            </td>

            <!-- Horário -->
            <td style="
                font-size:12px;
                color:var(--gold);
                font-weight:500;
            ">
                ${hora}
            </td>

            <!-- Status -->
            <td>
                <span class="status-pill ${a.status}">
                    <span class="status-dot"></span>
                    ${a.status_label ?? a.status}
                </span>
            </td>

            < td style = "
                font-size: 12px;
                color: var(--text-muted);
                max-width: 220px;
                white-space: normal;
                overflow-wrap: break-word;
                word-break: break-word;
            ">
            ${
                a.comment
                    ? `<span title="${a.comment}">
                    ${a.comment}
                </span>`
                    : `<span style="
                    color: var(--text-dim);
                    font-style: italic;
                ">
                    Sem comentário
                </span>`
            }
            </td >


            <td>

                <div style="
                    display:flex;
                    gap:6px;
                ">

                    <button
                        class="btn btn-ghost"
                        style="
                            padding:5px 10px;
                            font-size:11px;
                        "
                        data-id="${a.id}"
                        data-service-id="${a.service_id}"
                        data-action="reagendar"
                    >
                        <i class="ti ti-edit"></i>
                        Reagendar
                    </button>

                    <button
                        class="btn btn-danger"
                        style="
                            padding:5px 10px;
                            font-size:11px;
                        "
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

    tbody.addEventListener('click', async e => {

        const btn = e.target.closest('[data-action]');

        if (!btn) return;

        const id = parseInt(btn.dataset.id);
        const serviceId = parseInt(btn.dataset.serviceId);
        const action = btn.dataset.action;

        const appointments = new Appointmants();

        if (action === 'cancelar') {

            if (!confirm('Deseja cancelar este agendamento?')) {
                return;
            }

            try {

                const response = await appointments.softDelete(id);

                if (response.code === 200) {

                    toast(
                        'Agendamento cancelado.',
                        'ti-x'
                    );

                    await renderAgendamentos(c);

                } else {

                    toast(
                        response.message ?? 'Erro ao cancelar agendamento.',
                        'ti-x'
                    );

                }

            } catch (error) {

                console.error('Erro ao cancelar:', error);

                toast(
                    'Erro ao cancelar agendamento.',
                    'ti-x'
                );
            }

            return;
        }

        // Reagendar
        if (action === 'reagendar') {

            abrirModal(null, id);

            toast(
                'Selecione a nova data e horário.',
                'ti-calendar'
            );

            return;
        }
    });

    // Abrir modal para novo agendamento
    document
        .getElementById('btnNovoAptTabela')
        ?.addEventListener(
            'click',
            () => abrirModal()
        );
}
