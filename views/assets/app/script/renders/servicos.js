import { catalogo } from '../data.js';
export function renderServicos(c) {
    c.innerHTML = `
        <div style="margin-bottom:16px;" class="fade-in">
            <h1 style="font-size:22px;font-weight:500;">Nossos <em>Serviços</em></h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">Escolha o serviço ideal para você e agende em poucos cliques.</p>
        </div>
        <div class="services-grid" id="services-grid"></div>
        `;

    const grid = document.getElementById('services-grid');
    catalogo.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = `service-card fade-in`;
        div.style.animationDelay = `${i * 0.06}s`;
        div.innerHTML = `
                <div class="service-card-icon"><i class="ti ${s.icon}"></i></div>
                <p class="service-card-name">${s.nome}</p>
                <p class="service-card-desc">${s.desc}</p>
                <div class="service-card-meta">
                    <span class="service-meta-item"><i class="ti ti-clock"></i> ${s.duracao}</span>
                </div>
                <p class="service-price">${s.valor}</p>
                <button class="btn btn-gold" style="margin-top:8px;width:100%;justify-content:center;" data-servico="${s.nome}">
                    <i class="ti ti-calendar-plus"></i> Agendar
                </button>
            `;
        grid.appendChild(div);
    });

    grid.addEventListener('click', e => {
        const btn = e.target.closest('[data-servico]');
        if (btn) {
            abrirModal(btn.dataset.servico);
        }
    });
}