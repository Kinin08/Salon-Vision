import { historico } from '../data.js';
import { estrelas } from '../helpers.js';
import { meusAtendimentos } from '../../../_common/Api/appointmants.js';

export async function renderHistorico(c) {
    const atendimentos = await meusAtendimentos();
    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">Histórico de <em>Atendimentos</em></h1>
                <span class="panel-action">${atendimentos.length} atendimentos</span>
            </div>
            <div id="historico-list"></div>
        </div>
        `;

    const list = document.getElementById('historico-list');
    atendimentos.forEach(h => {
        const div = document.createElement('div');
        const [data, hora] = h.date_time.split(' ');

        div.className = 'history-item';
        div.innerHTML = `
                <div class="history-icon"><i class="ti ti-cut"></i></div>
                <div class="history-info">
                    <p class="history-service">${h.service_name}</p>
                    <p class="history-meta">com ${h.employee_name} · ${data}</p>
                </div>
                <div class="history-right">
                    <p class="history-value">Price: R$ ${h.price}</p>
                </div>
            `;
        list.appendChild(div);
    });
}