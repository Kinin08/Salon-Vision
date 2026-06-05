import { agendamentos, clientes, profissionais, LABEL } from '../data.js';
import { stars } from '../helpers.js';
import { setActive, nav } from '../helpers.js';
import { renderAgendamentos } from './agendamento.js';

export function renderDashboard(c) {
    const total = agendamentos.length;
    const pendentes = agendamentos.filter(a => a.status === 'pending').length;
    const confirmados = agendamentos.filter(a => a.status === 'confirmed').length;

    c.innerHTML = `
    <!-- Stats -->
    <div class="stats-grid fade-in">
        <div class="stat-card gold">
            <div class="stat-icon gold"><i class="ti ti-calendar-check"></i></div>
            <div class="stat-value">${total}</div>
            <div class="stat-label">Agendamentos totais</div>
            <div class="stat-delta up"><i class="ti ti-trending-up"></i> +12% este mês</div>
        </div>
        <div class="stat-card rose">
            <div class="stat-icon rose"><i class="ti ti-users"></i></div>
            <div class="stat-value">${clientes.length}</div>
            <div class="stat-label">Clientes ativos</div>
            <div class="stat-delta up"><i class="ti ti-trending-up"></i> +3 novos esta semana</div>
        </div>
        <div class="stat-card green">
            <div class="stat-icon green"><i class="ti ti-currency-dollar"></i></div>
            <div class="stat-value">R$ 4.280</div>
            <div class="stat-label">Receita do mês</div>
            <div class="stat-delta up"><i class="ti ti-trending-up"></i> +8% vs mês anterior</div>
        </div>
        <div class="stat-card blue">
            <div class="stat-icon blue"><i class="ti ti-clock"></i></div>
            <div class="stat-value">${pendentes}</div>
            <div class="stat-label">Pendentes hoje</div>
            <div class="stat-delta down"><i class="ti ti-alert-circle"></i> Requer atenção</div>
        </div>
    </div>

    <div class="two-col fade-in">
        <!-- Agendamentos recentes -->
        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">Próximos <em>Agendamentos</em></h1>
                <button class="btn btn-ghost btn-sm" id="btn-ver-todos">Ver todos</button>
            </div>
            <table>
                <thead><tr>
                    <th>Cliente</th><th>Serviço</th><th>Data</th><th>Status</th>
                </tr></thead>
                <tbody>
                    ${agendamentos.slice(0, 5).map(a => `
                    <tr>
                        <td style="font-size:12px;font-weight:500;">${a.cliente}</td>
                        <td style="font-size:11px;color:var(--text-muted);">${a.servico}</td>
                        <td style="font-size:11px;color:var(--text-dim);">${a.data} · ${a.hora}</td>
                        <td><span class="pill ${a.status}"><span class="pill-dot"></span>${LABEL[a.status]}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>

        <!-- Atividade recente -->
        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">Atividade <em>Recente</em></h1>
            </div>
            <div>
                <div class="activity-item">
                    <div class="activity-dot" style="background:var(--green)"></div>
                    <div>
                        <p class="activity-text"><strong>Ana Costa</strong> confirmou agendamento de Coloração</p>
                        <p class="activity-time">Há 12 minutos</p>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-dot" style="background:var(--gold)"></div>
                    <div>
                        <p class="activity-text"><strong>Julia Moraes</strong> solicitou agendamento de Sobrancelha</p>
                        <p class="activity-time">Há 45 minutos</p>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-dot" style="background:var(--blue)"></div>
                    <div>
                        <p class="activity-text"><strong>Camila R.</strong> concluiu atendimento de Escova</p>
                        <p class="activity-time">Há 1h 20min</p>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-dot" style="background:var(--rose)"></div>
                    <div>
                        <p class="activity-text"><strong>Sofia Andrade</strong> deixou uma avaliação 5 estrelas</p>
                        <p class="activity-time">Há 2 horas</p>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-dot" style="background:var(--red)"></div>
                    <div>
                        <p class="activity-text"><strong>Paula Ribeiro</strong> cancelou agendamento de Coloração</p>
                        <p class="activity-time">Há 3 horas</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mini receita + profissionais top -->
    <div class="two-col fade-in">
        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">Receita <em>Semanal</em></h1>
                <span class="panel-action">R$ 1.240 esta semana</span>
            </div>
            <div class="chart-wrap">
                <canvas id="revenueChart" role="img"
                    aria-label="Gráfico de barras de faturamento mensal de janeiro a junho"></canvas>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">Top <em>Profissionais</em></h1>
            </div>
            ${profissionais.filter(p => p.ativo).slice(0, 4).map((p, i) => `
            <div class="client-row">
                <span style="font-size:11px;color:var(--text-dim);width:14px;">${i + 1}</span>
                <img src="${p.foto}" class="avatar-sm" />
                <div style="flex:1">
                    <p class="client-name">${p.nome}</p>
                    <p class="client-meta">${p.role}</p>
                </div>
                <div style="display:flex;gap:2px;font-size:11px;color:var(--gold);">${stars(5)}</div>
                <span style="font-size:11px;color:var(--gold-dark);margin-left:4px;">${p.nota}</span>
            </div>`).join('')}
        </div>
    </div>
    `;

    // Inicializar gráfico
    const canvas = document.getElementById('revenueChart');
    if (canvas && typeof Chart !== 'undefined') {
        const meses = [];
        const hoje = new Date();
        for (let i = 4; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            meses.push(data.toLocaleDateString('pt-BR', { month: 'short' }));
        }

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [28400, 31200, 35800, 33600, 42300, 48620],
                    backgroundColor: 'rgba(255,204,127,0.18)',
                    borderColor: 'rgba(255,204,127,0.5)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,204,127,0.05)' }, ticks: { color: 'rgba(245,239,230,0.45)' } },
                    y: { grid: { color: 'rgba(255,204,127,0.05)' }, ticks: { color: 'rgba(245,239,230,0.45)' } }
                }
            }
        });
    }

    // Evento do botão "Ver todos"
    const btnVerTodos = document.getElementById('btn-ver-todos');
    if (btnVerTodos) {
        btnVerTodos.addEventListener('click', () => {
            setActive('nav-agendamentos');
            nav(renderAgendamentos, 'Gestão de <em>Agendamentos</em>');
        });
    }
}