import { listEmployees } from '../../../_common/Api/user.js';
import { receitaMensal, appointmentsByPeriod } from '../../../_common/Api/appointmants.js';
import { listClients } from '../../../_common/Api/user.js';
import { abrirPainelPessoas } from '../../../_common/script/PainelPessoas.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';
import { porcentageOfServices } from '../../../_common/Api/services.js';
import { montarCalendario } from '../../../_common/script/Calendario.js';

export async function renderDashboard(c) {

    const receita = await receitaMensal();
    const appointmentsByPeriodData = await appointmentsByPeriod('week');

    let doMes = [];
    try {
        const resposta = await appointmentsByPeriod('month');
        if (Array.isArray(resposta)) doMes = resposta;
    } catch { }

    const unicos = new Map();
    [...appointmentsByPeriodData, ...doMes].forEach((a) => {
        unicos.set(a.id ?? JSON.stringify(a), a);
    });
    const agendamentosDoMes = [...unicos.values()];

    const clients = await listClients();

    const servicesPorcentage = await porcentageOfServices();

    const listEmployee = await listEmployees();

    c.innerHTML = `

        <!-- METRICS -->

        <div class="metrics-grid">

            <div class="metric-card fade-in cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon gold">
                        <i class="ti ti-calendar-check"></i>
                    </div>
                </div>

                <h1 class="metric-value">${appointmentsByPeriodData.length}</h1>
                <h2 class="metric-label">
                    Agendamentos esta semana
                </h2>

            </div>


            <div class="metric-card fade-in delay-1 cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon rose">
                        <i class="ti ti-currency-dollar"></i>
                    </div>
                </div>

                <h1 class="metric-value">
                    R$ ${receita.revenue}
                </h1>

                <h2 class="metric-label">
                    Faturamento do mês
                </h2>

            </div>


            <div class="metric-card fade-in delay-2 cursor-pointer" id="card-clientes">

                <div class="metric-top">
                    <div class="metric-icon green">
                        <i class="ti ti-users"></i>
                    </div>
                </div>

                <h1 class="metric-value">
                    ${clients.length}
                </h1>

                <h2 class="metric-label">
                    Cadastro de clientes
                </h2>

            </div>

        </div>


        <!-- SERVIÇOS + AGENDAMENTOS -->

        <div class="grid-2 fade-in delay-2">

            <div class="panel">

                <div class="panel-header">

                    <h1 class="panel-title">
                        Serviços <em>top</em>
                    </h1>

                </div>

                <div id="services-bars"></div>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <h1 class="panel-title">
                        Agendamentos <em>desta semana</em>
                    </h1>

                    <button class="panel-action cursor-pointer" id="btn-ver-client">
                        Ver todos
                        <i class="ti ti-arrow-right"></i>
                    </button>

                </div>


                <table class="apt-table">

                    <thead>

                        <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Hora</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody id="apt-tbody"></tbody>

                </table>

            </div>

        </div>


        <!-- CALENDÁRIO + AÇÕES RÁPIDAS -->

        <div class="grid-2 fade-in delay-3">

            <div class="panel">
                <div class="panel-header">
                   <h1 class="panel-title" id="cal-title"></h1>
                   <div style="display:flex;gap:6px;">
                       <button type="button" class="panel-action cursor-pointer" id="cal-prev">
                           <i class="ti ti-chevron-left"></i>
                       </button>
                       <button type="button" class="panel-action cursor-pointer" id="cal-next">
                           <i class="ti ti-chevron-right"></i>
                       </button>
                   </div>
               </div>

                <div
                    id="cal-grid"
                    class="cal-grid"
                ></div>

            </div>


            <div class="panel">

                <div
                    class="panel-header"
                    style="margin-bottom:12px;"
                >

                    <h1 class="panel-title">
                        Ações <em>rápidas</em>
                    </h1>

                </div>


                <div class="quick-grid">

                    <button class="quick-btn">
                        <i class="ti ti-calendar-plus"></i>
                        Novo agendamento
                    </button>

                    <button class="quick-btn">
                        <i class="ti ti-user-plus"></i>
                        Novo cliente
                    </button>

                    <button class="quick-btn">
                        <i class="ti ti-receipt"></i>
                        Gerar relatório
                    </button>

                    <button class="quick-btn">
                        <i class="ti ti-send"></i>
                        Enviar lembrete
                    </button>

                </div>

            </div>

        </div>


        <!-- PROFISSIONAIS + PRÓXIMOS -->

        <div class="fade-in delay-4">

            <div class="panel">

                <div class="panel-header">

                    <h1 class="panel-title">
                        Profissionais <em>em serviço</em>
                    </h1>

                    <button type="button" class="panel-action cursor-pointer" id="btn-ver-prof">
                        Ver todos
                        <i class="ti ti-arrow-right"></i>
                    </button>

                </div>

                <div
                    class="staff-grid"
                    id="staff-grid"
                ></div>

            </div>

        </div>

    `;

    /* ==================== DATA ATUAL ==================== */

    const topbarDate = document.getElementById('topbar-date');

    if (topbarDate) {

        const d = new Date();

        topbarDate.textContent = d.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    }


    const servicesBars = document.getElementById('services-bars');

    if (servicesBars) {
        servicesBars.innerHTML = '';

        const servicesToShow = servicesPorcentage.slice(0, 5);

        servicesToShow.forEach((service, index) => {

            const percentage = Number(service.percentage);

            servicesBars.innerHTML += `
            <div class="service-item">

                <div class="service-header">
                    <span class="service-name">
                        ${service.service_name}
                    </span>

                    <span class="service-pct">
                        ${percentage.toFixed(0)}%
                    </span>
                </div>

                <div
                    class="bar-track"
                    style="
                        width: 100%;
                        height: 10px;
                        background: #2a2a2a;
                        overflow: hidden;
                        border-radius: 10px;
                    "
                >
                    <div
                        class="bar-fill"
                        style="
                            width: ${percentage}%;
                            height: 100%;
                            background: #FFCC7F;
                            border-radius: 10px;
                        "
                    ></div>
                </div>

            </div>
        `;
        });
    }


    /* ==================== AGENDAMENTOS ==================== */
    const tbody = document.getElementById('apt-tbody');

    if (tbody) {
        tbody.innerHTML = '';

        appointmentsByPeriodData.forEach(appointment => {
            const date = new Date(appointment.date_time);

            const hora = date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            tbody.innerHTML += `
            <tr>
                <td>
                    <div class="client-cell">
                   <img
                        src="${appointment.client_photo || FOTO_PADRAO}"
                        onerror="this.onerror=null;this.src='${FOTO_PADRAO}'"
                        class="client-avatar"
                        alt="Foto de ${appointment.client_name}"
                    />
                        <span class="client-name">
                            ${appointment.client_name}
                        </span>
                    </div>
                </td>

                <td style="font-size:12px;color:var(--text-muted);">
                    ${appointment.service_name}
                </td>

                <td style="font-size:12px;color:var(--gold);font-weight:500;">
                    ${hora}
                </td>

                <td>
                    <span class="status-pill ${appointment.status}">
                        <span class="status-dot"></span>
                        ${appointment.status}
                    </span>
                </td>
            </tr>
        `;
        });
    }


    /* ==================== CALENDÁRIO ==================== */


    montarCalendario({
        grid: document.getElementById('cal-grid'),
        titulo: document.getElementById('cal-title'),
        anterior: document.getElementById('cal-prev'),
        proximo: document.getElementById('cal-next'),
        agendamentos: agendamentosDoMes
    });

    /* ==================== PROFISSIONAIS ==================== */

    const staffGrid = document.getElementById('staff-grid');

    if (staffGrid) {
        staffGrid.innerHTML = '';

        listEmployee.forEach(professional => {
            staffGrid.innerHTML += `
            <div class="staff-card">
                <img
                    src="${professional.photo || FOTO_PADRAO}"
                    onerror="this.onerror=null;this.src='${FOTO_PADRAO}'"
                    class="staff-avatar"
                    alt="Foto de ${professional.name}"
                />

                <h2 class="staff-name">
                    ${professional.name}
                </h2>
            </div>
        `;
        });
    }

    document.getElementById('btn-ver-client')?.addEventListener('click', () => {
        console.log('agendamentos do painel:', agendamentosDoMes);
        abrirPainelPessoas({
            agendamentos: agendamentosDoMes,
            profissionais: listEmployee,
            abaInicial: 'agendamentos'
        });
    });

    document.getElementById('btn-ver-prof')?.addEventListener('click', () => {
        abrirPainelPessoas({
            agendamentos: agendamentosDoMes,
            profissionais: listEmployee,
            abaInicial: 'profissionais'
        });
    });
}