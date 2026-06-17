import { estrelas } from '../helpers.js';

export async function renderHistorico(c) {

    c.innerHTML = `
        <div class="panel fade-in">
            <div class="panel-header">
                <h1 class="panel-title">
                    Histórico de <em>Atendimentos</em>
                </h1>
            </div>

            <div id="historico-list"></div>
        </div>
    `;

    const list = document.getElementById('historico-list');

    try {

        const token = localStorage.getItem('token');

        const response = await fetch(
            'http://localhost/Salon-Vision/api/appointments/history',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        const historico = result.data || [];

        document.querySelector('.panel-action')?.remove();

        const header = document.querySelector('.panel-header');

        header.insertAdjacentHTML(
            'beforeend',
            `<span class="panel-action">${historico.length} atendimentos</span>`
        );

        if (!historico.length) {
            list.innerHTML = `
                <p style="text-align:center;padding:30px;">
                    Nenhum atendimento encontrado.
                </p>
            `;
            return;
        }

        historico.forEach(h => {

            const data = new Date(h.date_time);

            const item = document.createElement('div');

            item.className = 'history-item';

            item.innerHTML = `
                <div class="history-icon">
                    <i class="ti ti-cut"></i>
                </div>

                <div class="history-info">
                    <p class="history-service">
                        ${h.service}
                    </p>

                    <p class="history-meta">
                        com ${h.employee}
                        ·
                        ${data.toLocaleDateString('pt-BR')}
                    </p>
                </div>

                <div class="history-right">
                    <p class="history-value">
                        R$ ${Number(h.price).toFixed(2)}
                    </p>

                    <p class="history-stars">
                        ${estrelas(h.rating || 0)}
                    </p>
                </div>
            `;

            list.appendChild(item);
        });

    } catch (error) {

        console.error(error);

        list.innerHTML = `
            <p style="text-align:center;padding:30px;">
                Erro ao carregar histórico.
            </p>
        `;
    }
}