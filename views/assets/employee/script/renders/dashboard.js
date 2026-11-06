import { myAppointmentsByPeriod } from '../../../_common/Api/appointmants.js';
import { abrirPainelPessoas } from '../../../_common/script/PainelPessoas.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';
import { montarCalendario } from '../../../_common/script/Calendario.js';

export async function renderDashboard(c) {
    const [semana, doMes] = await Promise.all([
        myAppointmentsByPeriod('week'),
        myAppointmentsByPeriod('month')
    ]);

    const unicos = new Map();
    [...semana, ...doMes].forEach(a => unicos.set(a.id, a));
    const agendamentosDoMes = [...unicos.values()];

    // clientes únicos atendidos por este funcionário no mês
    const totalClientes = new Set(
        agendamentosDoMes.map(a => a.client_id ?? a.client_name)
    ).size;

    c.innerHTML = `
        <div class="metrics-grid">
            <div class="metric-card fade-in">
                <div class="metric-top"><div class="metric-icon gold"><i class="ti ti-calendar-check"></i></div></div>
                <h1 class="metric-value">${semana.length}</h1>
                <h2 class="metric-label">Meus agendamentos esta semana</h2>
            </div>
            <div class="metric-card fade-in delay-2" id="card-clientes">
                <div class="metric-top"><div class="metric-icon green"><i class="ti ti-users"></i></div></div>
                <h1 class="metric-value">${totalClientes}</h1>
                <h2 class="metric-label">Clientes atendidos no mês</h2>
            </div>
        </div>

        <div class="grid-2 fade-in delay-2">
            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Meus <em>agendamentos da semana</em></h1>
                    <button class="panel-action cursor-pointer" id="btn-ver-client">
                        Ver todos <i class="ti ti-arrow-right"></i>
                    </button>
                </div>
                <table class="apt-table">
                    <thead><tr><th>Cliente</th><th>Serviço</th><th>Hora</th><th>Status</th></tr></thead>
                    <tbody id="apt-tbody"></tbody>
                </table>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title" id="cal-title"></h1>
                    <div style="display:flex;gap:6px;">
                        <button type="button" class="panel-action cursor-pointer" id="cal-prev"><i class="ti ti-chevron-left"></i></button>
                        <button type="button" class="panel-action cursor-pointer" id="cal-next"><i class="ti ti-chevron-right"></i></button>
                    </div>
                </div>
                <div id="cal-grid" class="cal-grid"></div>
            </div>
        </div>

        <div class="panel fade-in delay-3">
            <div class="panel-header" style="margin-bottom:12px;">
                <h1 class="panel-title">Ações <em>rápidas</em></h1>
            </div>
            <div class="quick-grid">
                <button class="quick-btn"><i class="ti ti-calendar-plus"></i> Novo agendamento</button>
                <button class="quick-btn"><i class="ti ti-user-plus"></i> Novo cliente</button>
                <button class="quick-btn"><i class="ti ti-send"></i> Enviar lembrete</button>
            </div>
        </div>
    `;

    // data no topo
    const topbarDate = document.getElementById('topbar-date');
    if (topbarDate) {
        topbarDate.textContent = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    // tabela
    const tbody = document.getElementById('apt-tbody');
    if (tbody) {
        tbody.innerHTML = semana.length
            ? semana.map(a => {
                const hora = new Date(a.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return `
                <tr>
                    <td>
                        <div class="client-cell">
                            <img src="${a.client_photo || FOTO_PADRAO}"
                                 onerror="this.onerror=null;this.src='${FOTO_PADRAO}'"
                                 class="client-avatar" alt="Foto de ${a.client_name}" />
                            <span class="client-name">${a.client_name}</span>
                        </div>
                    </td>
                    <td style="font-size:12px;color:var(--text-muted);">${a.service_name}</td>
                    <td style="font-size:12px;color:var(--gold);font-weight:500;">${hora}</td>
                    <td><span class="status-pill ${a.status}"><span class="status-dot"></span>${a.status}</span></td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="4" style="text-align:center;padding:16px;font-size:12px;color:var(--text-muted);">
                   Nenhum agendamento esta semana.
               </td></tr>`;
    }

    montarCalendario({
        grid: document.getElementById('cal-grid'),
        titulo: document.getElementById('cal-title'),
        anterior: document.getElementById('cal-prev'),
        proximo: document.getElementById('cal-next'),
        agendamentos: agendamentosDoMes
    });

    document.getElementById('btn-ver-client')?.addEventListener('click', () => {
        abrirPainelPessoas({
            agendamentos: agendamentosDoMes,
            profissionais: [],
            abaInicial: 'agendamentos'
        });
    });
}