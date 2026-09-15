import { abrirModal } from '../modals.js';
import Services from "../../../_common/classes/Services.js";

export async function servicos() {

    try {

        const service = new Services();

        const responseData = await service.listAll();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Serviços:", error);

        return [];

    }

}

export async function renderServicos(c) {

    const services = await servicos();

    c.innerHTML = `
        <div style="margin-bottom:16px;" class="fade-in">

            <h1 style="font-size:22px;font-weight:500;">
                Nossos <em>Serviços</em>
            </h1>

            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">
                Escolha o serviço ideal para você e agende em poucos cliques.
            </p>

        </div>

        <div class="services-grid" id="services-grid"></div>
    `;

    const grid = document.getElementById('services-grid');

    services.forEach((s, i) => {

        const div = document.createElement('div');

        div.className = `service-card fade-in`;

        div.style.animationDelay = `${i * 0.06}s`;

        div.innerHTML = `
            <p class="service-card-name">
                ${s.name}
            </p>

            <p class="service-card-desc">
                ${s.description}
            </p>

            <div class="service-card-meta">
                <span class="service-meta-item">
                    <i class="ti ti-clock"></i>
                    ${s.duration}
                </span>
            </div>

            <p class="service-price">
                ${s.price}
            </p>

            <button
                class="btn btn-gold"
                style="margin-top:8px;width:100%;justify-content:center;"
                data-servico="${s.name}"
            >
                <i class="ti ti-calendar-plus"></i>
                Agendar
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

    document
        .getElementById('btnNovoAgendamentoInicio')
        ?.addEventListener('click', () => {
            abrirModal();
        });

}