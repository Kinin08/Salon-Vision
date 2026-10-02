export function renderDashboard(c) {

    c.innerHTML = `

        <!-- METRICS -->

        <div class="metrics-grid">

            <div class="metric-card fade-in cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon gold">
                        <i class="ti ti-calendar-check"></i>
                    </div>
                </div>

                <h1 class="metric-value">47</h1>
                <h2 class="metric-label">
                    Agendamentos hoje
                </h2>

            </div>


            <div class="metric-card fade-in delay-1 cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon rose">
                        <i class="ti ti-currency-dollar"></i>
                    </div>
                </div>

                <h1 class="metric-value">
                    R$ 3.840
                </h1>

                <h2 class="metric-label">
                    Faturamento hoje
                </h2>

            </div>


            <div class="metric-card fade-in delay-2 cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon green">
                        <i class="ti ti-users"></i>
                    </div>
                </div>

                <h1 class="metric-value">
                    1.284
                </h1>

                <h2 class="metric-label">
                    Cadastro de clientes
                </h2>

            </div>


            <div class="metric-card fade-in delay-3 cursor-pointer">

                <div class="metric-top">
                    <div class="metric-icon blue">
                        <i class="ti ti-star"></i>
                    </div>
                </div>

                <h1 class="metric-value">
                    4.87
                </h1>

                <h2 class="metric-label">
                    Avaliação média
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
                        Agendamentos <em>de hoje</em>
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

        <div class="grid-2 fade-in delay-4">

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


            <div class="panel">

                <div class="panel-header">

                    <h2 class="panel-title">
                        Próximos <em>horários</em>
                    </h2>

                </div>

                <div id="upcoming-list"></div>

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


    /* ==================== SERVIÇOS TOP ==================== */

    const services = [
        {
            name: 'Coloração',
            pct: 82,
            color: '#FFCC7F'
        },
        {
            name: 'Corte feminino',
            pct: 74,
            color: '#F4C0AD'
        },
        {
            name: 'Escova & Tratamento',
            pct: 61,
            color: '#CA9440'
        },
        {
            name: 'Manicure',
            pct: 48,
            color: '#e8ae92'
        },
        {
            name: 'Sobrancelha',
            pct: 35,
            color: '#FFCC7F'
        }
    ];

    const servicesBars = document.getElementById('services-bars');

    if (servicesBars) {

        servicesBars.innerHTML = '';

        services.forEach(service => {

            servicesBars.innerHTML += `
                <div class="service-item">

                    <div class="service-header">

                        <span class="service-name">
                            ${service.name}
                        </span>

                        <span class="service-pct">
                            ${service.pct}%
                        </span>

                    </div>

                    <div class="bar-track">

                        <div
                            class="bar-fill"
                            style="
                                width: ${service.pct}%;
                                background: ${service.color};
                            "
                        ></div>

                    </div>

                </div>
            `;

        });

    }


    /* ==================== AGENDAMENTOS ==================== */

    const apts = [
        {
            name: 'Mariana S.',
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
            service: 'Coloração',
            hora: '09:00',
            status: 'confirmed'
        },
        {
            name: 'Bruna L.',
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
            service: 'Corte + Escova',
            hora: '10:30',
            status: 'confirmed'
        },
        {
            name: 'Carlos M.',
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
            service: 'Barba',
            hora: '11:00',
            status: 'pending'
        },
        {
            name: 'Jéssica O.',
            img: 'https://randomuser.me/api/portraits/women/12.jpg',
            service: 'Manicure',
            hora: '13:00',
            status: 'done'
        },
        {
            name: 'Fernanda R.',
            img: 'https://randomuser.me/api/portraits/women/65.jpg',
            service: 'Hidratação',
            hora: '14:30',
            status: 'cancelled'
        },
        {
            name: 'Tatiane V.',
            img: 'https://randomuser.me/api/portraits/women/30.jpg',
            service: 'Sobrancelha',
            hora: '15:00',
            status: 'confirmed'
        }
    ];

    const statusLabel = {
        confirmed: 'Confirmado',
        pending: 'Pendente',
        cancelled: 'Cancelado',
        done: 'Concluído'
    };

    const tbody = document.getElementById('apt-tbody');

    if (tbody) {

        tbody.innerHTML = '';

        apts.forEach(appointment => {

            tbody.innerHTML += `
                <tr>

                    <td>

                        <div class="client-cell">

                            <img
                                src="${appointment.img}"
                                class="client-avatar"
                                alt="${appointment.name}"
                            />

                            <span class="client-name">
                                ${appointment.name}
                            </span>

                        </div>

                    </td>

                    <td style="font-size:12px;color:var(--text-muted);">
                        ${appointment.service}
                    </td>

                    <td style="font-size:12px;color:var(--gold);font-weight:500;">
                        ${appointment.hora}
                    </td>

                    <td>

                        <span class="status-pill ${appointment.status}">

                            <span class="status-dot"></span>

                            ${statusLabel[appointment.status]}

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


    /* ==================== PRÓXIMOS HORÁRIOS ==================== */

    const upcoming = [
        {
            hour: '15',
            min: '00',
            period: 'PM',
            service: 'Coloração — Tatiane V.',
            prof: 'Camila R.'
        },
        {
            hour: '15',
            min: '30',
            period: 'PM',
            service: 'Corte masculino — Paulo M.',
            prof: 'Lucas T.'
        },
        {
            hour: '16',
            min: '00',
            period: 'PM',
            service: 'Hidratação profunda',
            prof: 'Priya A.'
        },
        {
            hour: '16',
            min: '30',
            period: 'PM',
            service: 'Manicure & Pedicure',
            prof: 'Aline F.'
        },
        {
            hour: '17',
            min: '00',
            period: 'PM',
            service: 'Escova modeladora',
            prof: 'Camila R.'
        }
    ];

    const upcomingList = document.getElementById('upcoming-list');

    if (upcomingList) {

        upcomingList.innerHTML = '';

        upcoming.forEach(item => {

            upcomingList.innerHTML += `
                <div class="upcoming-item">

                    <h1 class="upcoming-time">

                        <div class="hour">
                            ${item.hour}:${item.min}
                        </div>

                        <div class="period">
                            ${item.period}
                        </div>

                    </h1>

                    <div class="upcoming-dot"></div>

                    <div class="upcoming-info">

                        <p>
                            ${item.service}
                        </p>

                        <span>
                            com ${item.prof}
                        </span>

                    </div>

                </div>
            `;

        });

    }

}