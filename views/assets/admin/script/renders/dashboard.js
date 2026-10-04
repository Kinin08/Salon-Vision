import { listAll, receitaMensal, appointmentsByPeriod } from '../../../_common/Api/appointmants.js';
import { listClients } from '../../../_common/Api/user.js';
import { porcentageOfServices } from '../../../_common/Api/services.js';

export async function renderDashboard(c) {

    const receita = await receitaMensal();
    const appointmentsByPeriodData = await appointmentsByPeriod('week');
    console.log('appointmentsByPeriodData:', appointmentsByPeriodData);

    const clients = await listClients();

    const servicesPorcentage = await porcentageOfServices();
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


            <div class="metric-card fade-in delay-2 cursor-pointer">

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

                    <button class="panel-action cursor-pointer">
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

                    <h1 class="panel-title">
                        Junho <em>2025</em>
                    </h1>

                    <div style="display:flex;gap:6px;">

                        <span class="panel-action">
                            <i class="ti ti-chevron-left"></i>
                        </span>

                        <span class="panel-action">
                            <i class="ti ti-chevron-right"></i>
                        </span>

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

                    <span class="panel-action">
                        Gerenciar
                        <i class="ti ti-arrow-right"></i>
                    </span>

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
                                src="${appointment.client_name}"
                                class="client-avatar"
                                alt="${appointment.client_photo}"
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

    const calGrid = document.getElementById('cal-grid');

    if (calGrid) {

        calGrid.innerHTML = '';

        const weekDays = [
            'Dom',
            'Seg',
            'Ter',
            'Qua',
            'Qui',
            'Sex',
            'Sáb'
        ];

        weekDays.forEach(day => {

            calGrid.innerHTML += `
                <div class="cal-day-label">
                    ${day}
                </div>
            `;

        });

        const startDay = 0;
        const daysInMonth = 30;
        const today = 31;

        const withApt = [
            2,
            5,
            8,
            10,
            13,
            15,
            18,
            20,
            22,
            25,
            27,
            28
        ];

        for (let i = 0; i < startDay; i++) {

            calGrid.innerHTML += `
                <div class="cal-day other">
                    —
                </div>
            `;

        }

        for (let day = 1; day <= daysInMonth; day++) {

            const isToday = day === today;
            const hasApt = withApt.includes(day);

            let className = 'cal-day';

            if (isToday) {

                className += ' today';

            } else if (hasApt) {

                className += ' has-apt';

            }

            calGrid.innerHTML += `
                <div class="${className}">
                    ${day}
                </div>
            `;

        }

    }


    /* ==================== PROFISSIONAIS ==================== */

    const staff = [
        {
            name: 'Camila R.',
            role: 'Colorista',
            img: 'https://randomuser.me/api/portraits/women/21.jpg',
            count: 8
        },
        {
            name: 'Priya A.',
            role: 'Cabeleireira',
            img: 'https://randomuser.me/api/portraits/women/33.jpg',
            count: 6
        },
        {
            name: 'Lucas T.',
            role: 'Barbeiro',
            img: 'https://randomuser.me/api/portraits/men/45.jpg',
            count: 5
        },
        {
            name: 'Aline F.',
            role: 'Manicure',
            img: 'https://randomuser.me/api/portraits/women/57.jpg',
            count: 7
        },
        {
            name: 'Renata M.',
            role: 'Estética',
            img: 'https://randomuser.me/api/portraits/women/10.jpg',
            count: 4
        },
        {
            name: 'Diego P.',
            role: 'Cabeleireiro',
            img: 'https://randomuser.me/api/portraits/men/22.jpg',
            count: 6
        }
    ];

    const staffGrid = document.getElementById('staff-grid');

    if (staffGrid) {

        staffGrid.innerHTML = '';

        staff.forEach(professional => {

            staffGrid.innerHTML += `
                <div class="staff-card">

                    <img
                        src="${professional.img}"
                        class="staff-avatar"
                        alt="${professional.name}"
                    />

                    <h1 class="staff-name">
                        ${professional.name}
                    </h1>

                    <h1 class="staff-role">
                        ${professional.role}
                    </h1>

                    <h1 class="staff-count">
                        ${professional.count}
                    </h1>

                    <h1 class="staff-lbl">
                        hoje
                    </h1>

                </div>
            `;

        });

    }

}