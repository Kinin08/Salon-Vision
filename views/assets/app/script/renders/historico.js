import { historico } from '../data.js';
import { estrelas } from '../helpers.js';
export function renderHistorico(c) {
    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">Histórico de <em>Atendimentos</em></h1>
                <span class="panel-action">${historico.length} atendimentos</span>
            </div>
            <div id="historico-list"></div>
        </div>
        `;

    const list = document.getElementById('historico-list');
    historico.forEach(h => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
                <div class="history-icon"><i class="ti ti-cut"></i></div>
                <div class="history-info">
                    <p class="history-service">${h.servico}</p>
                    <p class="history-meta">com ${h.profissional} · ${h.data}</p>
                </div>
                <div class="history-right">
                    <p class="history-value">${h.valor}</p>
                    <p class="history-stars">${estrelas(h.avaliacao)}</p>
                </div>
            `;
        list.appendChild(div);
    });
}