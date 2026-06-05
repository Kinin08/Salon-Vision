import { avaliacoesPendentes } from '../data.js';
import { stars } from '../helpers.js';
export function renderAvaliacoes(c) {
    const media =
        (avaliacoesPendentes.reduce((s, a) => s + a.nota, 0) / avaliacoesPendentes.length).toFixed(1);

    const total5 = avaliacoesPendentes.filter(a => a.nota === 5).length;
    const total4 = avaliacoesPendentes.filter(a => a.nota === 4).length;
    const total3 = avaliacoesPendentes.filter(a => a.nota === 3).length;
    const total2 = avaliacoesPendentes.filter(a => a.nota === 2).length;
    const total1 = avaliacoesPendentes.filter(a => a.nota === 1).length;

    c.innerHTML = `
    <div class="fade-in">

        <!-- Resumo -->
        <div class="metrics-grid" style="margin-bottom:20px;">

            <div class="metric-card">
                <div class="metric-icon gold">
                    <i class="ti ti-star-filled"></i>
                </div>
                <h1 class="metric-value">${media}</h1>
                <h2 class="metric-label">Nota média</h2>
            </div>

            <div class="metric-card">
                <div class="metric-icon rose">
                    <i class="ti ti-message-circle"></i>
                </div>
                <h1 class="metric-value">${avaliacoesPendentes.length}</h1>
                <h2 class="metric-label">Avaliações</h2>
            </div>

            <div class="metric-card">
                <div class="metric-icon gold">
                    <i class="ti ti-mood-smile"></i>
                </div>
                <h1 class="metric-value">
                    ${Math.round((total5 / avaliacoesPendentes.length) * 100)}%
                </h1>
                <h2 class="metric-label">Satisfação</h2>
            </div>

        </div>

        <!-- Distribuição -->
        <div class="panel" style="margin-bottom:20px;">
            <div class="panel-header">
                <h1 class="panel-title">Distribuição das <em>Notas</em></h1>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px;">
                ${[
            [5, total5],
            [4, total4],
            [3, total3],
            [2, total2],
            [1, total1]
        ].map(([nota, total]) => `
                    <div>
                        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                            <span>${nota} ★</span>
                            <span>${total}</span>
                        </div>
                        <div style="
                            height:8px;
                            border-radius:999px;
                            background:rgba(255,255,255,.05);
                            overflow:hidden;">
                            <div style="
                                width:${(total / avaliacoesPendentes.length) * 100}%;
                                height:100%;
                                background:linear-gradient(90deg,var(--gold),var(--gold-dark));
                                border-radius:999px;">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Lista -->
        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">Últimas <em>Avaliações</em></h1>
            </div>

            <div id="aval-list" style="display:flex;flex-direction:column;gap:14px;"></div>
        </div>

    </div>
    `;

    const list = document.getElementById('aval-list');

    avaliacoesPendentes.forEach(av => {
        const div = document.createElement('div');

        div.innerHTML = `
        <div style="
            padding:18px;
            border:1px solid var(--border);
            border-radius:18px;
            background:rgba(255,255,255,.02);
            transition:.3s;">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:16px;">

                <div style="display:flex;gap:12px;">
                    <div style="
                        width:46px;
                        height:46px;
                        border-radius:14px;
                        background:rgba(255,204,127,.12);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:var(--gold);
                        font-size:20px;">
                        <i class="ti ti-user"></i>
                    </div>

                    <div>
                        <h3 style="
                            font-size:14px;
                            font-weight:600;
                            color:var(--text);">
                            ${av.cliente}
                        </h3>

                        <p style="
                            font-size:11px;
                            color:var(--text-dim);
                            margin-top:2px;">
                            ${av.servico} • ${av.prof}
                        </p>

                        <div style="
                            display:flex;
                            gap:2px;
                            margin-top:8px;">
                            ${stars(av.nota)}
                        </div>
                    </div>
                </div>

                <span style="
                    font-size:11px;
                    color:var(--text-dim);">
                    ${av.data}
                </span>

            </div>

            <p style="
                margin-top:14px;
                color:var(--text-muted);
                line-height:1.6;
                font-size:13px;">
                "${av.comentario}"
            </p>
        </div>
        `;

        list.appendChild(div);
    });
}