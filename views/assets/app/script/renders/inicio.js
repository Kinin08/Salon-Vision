import { CLIENTE, meusAgendamentos, STATUS_LABEL } from '../data.js';
import { setNavActive, navegarPara } from '../helpers.js';
import { renderAgendamentos } from './agendamentos.js';
import { renderServicos } from './servicos.js';
import { renderHistorico } from './historico.js';
import { abrirModal } from '../modals.js';

export function renderInicio(c) {
    const proximo = meusAgendamentos[0];

    c.innerHTML = `
        <div class="greeting-hero fade-in" style="margin-bottom:20px;">
            <p class="greeting-kicker">Bem-vinda de volta</p>
            <h2 class="greeting-title">Olá, <strong>${CLIENTE.nome.split(' ')[0]}!</strong></h2>
            <p class="greeting-sub">Seu próximo momento de cuidado está chegando — aproveite.</p>
        </div>

        <div class="metrics-grid" style="margin-bottom:20px;">
            <div class="metric-card fade-in" style="grid-column: span 2;">
                <p style="font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--gold-dark);margin-bottom:10px;">
                    <i class="ti ti-calendar-event" style="margin-right:4px;"></i> Próximo agendamento
                </p>
                ${proximo ? `
                <p class="next-apt-service">${proximo.servico}</p>
                <div class="next-apt-row"><i class="ti ti-user"></i> ${proximo.profissional}</div>
                <div class="next-apt-row"><i class="ti ti-calendar"></i> ${proximo.data}</div>
                <div class="next-apt-row"><i class="ti ti-clock"></i> ${proximo.hora}</div>
                <div style="margin-top:10px;">
                    <span class="status-pill ${proximo.status}"><span class="status-dot"></span>${STATUS_LABEL[proximo.status]}</span>
                </div>
                ` : `<p style="color:var(--text-dim);font-size:12px;">Nenhum agendamento próximo.</p>`}
            </div>

            <div class="metric-card fade-in delay-1">
                <div class="metric-icon gold"><i class="ti ti-calendar-check"></i></div>
                <h1 class="metric-value">${CLIENTE.totalAgendamentos}</h1>
                <h2 class="metric-label">Agendamentos realizados</h2>
            </div>

            <div class="metric-card fade-in delay-2">
                <div class="metric-icon rose"><i class="ti ti-star"></i></div>
                <h1 class="metric-value">${CLIENTE.avaliacoesFeitas}</h1>
                <h2 class="metric-label">Avaliações feitas</h2>
            </div>
        </div>

        <div class="panel fade-in delay-2" style="margin-bottom:20px;">
            <div class="panel-header">
                <h1 class="panel-title">Meus <em>favoritos</em></h1>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${CLIENTE.favoritos.map(f => `
                    <span class="fav-chip">
                        <i class="ti ti-heart-filled" style="font-size:10px;"></i> ${f}
                    </span>
                `).join('')}
            </div>
        </div>

        <div class="panel fade-in delay-3">
            <div class="panel-header">
                <h1 class="panel-title">Ações <em>rápidas</em></h1>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                <button class="btn btn-gold cursor-pointer" id="btnNovoApt">
                    <i class="ti ti-calendar-plus"></i> Novo Agendamento
                </button>
                <button class="btn btn-ghost cursor-pointer" id="btnVerServicos">
                    <i class="ti ti-cut"></i> Ver Serviços
                </button>
                <button class="btn btn-ghost cursor-pointer" id="btnVerHistorico">
                    <i class="ti ti-clock-history"></i> Meu Histórico
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
    
    document.getElementById('btnVerHistorico')?.addEventListener('click', () => {
        setNavActive('nav-historico');
        navegarPara(renderHistorico);
    });
}