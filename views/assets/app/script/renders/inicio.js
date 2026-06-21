import { STATUS_LABEL } from '../data.js';
import { setNavActive, navegarPara } from '../helpers.js';
import { renderAgendamentos } from './agendamentos.js';
import { renderServicos } from './servicos.js';

export async function renderInicio(c) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            c.innerHTML = `
                <div class="panel">
                    <p style="text-align:center;padding:20px;">
                        Você não está logado.
                    </p>
                </div>
            `;
            return;
        }

        const [profileResponse, appointmentsResponse] =
            await Promise.all([
                fetch('http://localhost/Salon-Vision/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost/Salon-Vision/api/appointments/my', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

        const profileResult = await profileResponse.json();
        const appointmentsResult = await appointmentsResponse.json();

        const user = profileResult?.data;

        if (!user) {
            c.innerHTML = `
                <div class="panel">
                    <p style="text-align:center;padding:20px;">
                        Sessão expirada. Faça login novamente.
                    </p>
                </div>
            `;
            return;
        }

        const appointments = appointmentsResult.data || [];

        const proximo = appointments
            .filter(a =>
                ['scheduled', 'confirmed', 'in_progress']
                    .includes(a.status)
            )
            .sort(
                (a, b) => new Date(a.date_time) - new Date(b.date_time)
            )[0];

        const totalAgendamentos = appointments.length;

        c.innerHTML = `
            <div class="greeting-hero fade-in" style="margin-bottom:20px;">
                <p class="greeting-kicker">Bem-vindo de volta</p>

                <h2 class="greeting-title">
                    Olá,
                    <strong>
                        ${user?.name?.split(' ')?.[0] || 'Usuário'}!
                    </strong>
                </h2>

                <p class="greeting-sub">
                    Seu próximo momento de cuidado está chegando.
                </p>
            </div>

            <div class="metrics-grid" style="margin-bottom:20px;">

                <div class="metric-card fade-in" style="grid-column: span 2;">
                    <p style="
                        font-size:10px;
                        text-transform:uppercase;
                        letter-spacing:.1em;
                        color:var(--gold-dark);
                        margin-bottom:10px;
                    ">
                        <i class="ti ti-calendar-event" style="margin-right:4px;"></i>
                        Próximo agendamento
                    </p>

                    ${
                        proximo
                            ? `
                                <p class="next-apt-service">
                                    ${proximo.service}
                                </p>

                                <div class="next-apt-row">
                                    <i class="ti ti-user"></i>
                                    ${proximo.employee}
                                </div>

                                <div class="next-apt-row">
                                    <i class="ti ti-calendar"></i>
                                    ${new Date(proximo.date_time).toLocaleDateString('pt-BR')}
                                </div>

                                <div class="next-apt-row">
                                    <i class="ti ti-clock"></i>
                                    ${new Date(proximo.date_time).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>

                                <div style="margin-top:10px;">
                                    <span class="status-pill ${proximo.status}">
                                        <span class="status-dot"></span>
                                        ${STATUS_LABEL[proximo.status] || proximo.status}
                                    </span>
                                </div>
                            `
                            : `
                                <p style="color:var(--text-dim);font-size:12px;">
                                    Nenhum agendamento próximo.
                                </p>
                            `
                    }
                </div>

                <div class="metric-card fade-in delay-1">
                    <div class="metric-icon gold">
                        <i class="ti ti-calendar-check"></i>
                    </div>

                    <h1 class="metric-value">
                        ${totalAgendamentos}
                    </h1>

                    <h2 class="metric-label">
                        Agendamentos realizados
                    </h2>
                </div>

            </div>

            <div class="panel fade-in delay-3">
                <div class="panel-header">
                    <h1 class="panel-title">
                        Ações <em>rápidas</em>
                    </h1>
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    <button class="btn btn-gold cursor-pointer" id="btnNovoApt">
                        <i class="ti ti-calendar-plus"></i>
                        Novo Agendamento
                    </button>

                    <button class="btn btn-ghost cursor-pointer" id="btnVerServicos">
                        <i class="ti ti-cut"></i>
                        Ver Serviços
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btnNovoApt')?.addEventListener('click', () => {
            setNavActive('nav-agendamentos');
            navegarPara(renderAgendamentos);
        });

        document.getElementById('btnVerServicos')?.addEventListener('click', () => {
            setNavActive('nav-servicos');
            navegarPara(renderServicos);
        });

    } catch (error) {
        console.error(error);

        c.innerHTML = `
            <div class="panel">
                <p style="text-align:center;padding:20px;">
                    Erro ao carregar dashboard.
                </p>
            </div>
        `;
    }
}