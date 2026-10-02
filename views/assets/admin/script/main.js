import { setActive, nav } from './helpers.js';
import { initModals } from './modals.js';

import { renderDashboard } from './renders/dashboard.js';
import { renderAgendamentos } from './renders/agendamento.js';
import { renderClientes } from './renders/clientes.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderServicos } from './renders/servicos.js';
import { renderAvaliacoes } from './renders/avaliacoes.js';
import { renderFaqs } from './renders/faqs.js';
import { renderPerfil } from './renders/perfil.js';


/* ==================== ROTAS ==================== */

const rotas = {

    dashboard: {
        fn: renderDashboard,
        titulo: 'Dashboard <em>Geral</em>'
    },

    agendamentos: {
        fn: renderAgendamentos,
        titulo: 'Gestão de <em>Agendamentos</em>'
    },

    clientes: {
        fn: renderClientes,
        titulo: 'Gestão de <em>Clientes</em>'
    },

    profissionais: {
        fn: renderProfissionais,
        titulo: 'Nossa <em>Equipe</em>'
    },

    faqs: {
        fn: renderFaqs,
        titulo: 'Perguntas mais <em>Frequentes</em>'
    },

    servicos: {
        fn: renderServicos,
        titulo: 'Catálogo de <em>Serviços</em>'
    },

    avaliacoes: {
        fn: renderAvaliacoes,
        titulo: 'Central de <em>Avaliações</em>'
    },

    perfil: {
        fn: renderPerfil,
        titulo: '<em>Perfil</em>'
    }

};


/* ==================== NAVEGAÇÃO ==================== */

function initNavigation() {

    document.querySelectorAll('.nav-item').forEach(item => {

        item.addEventListener('click', event => {

            event.preventDefault();

            const rota = rotas[item.id];

            if (!rota) return;

            setActive(item.id);

            nav(rota.fn, rota.titulo);

        });

    });

}


/* ==================== DATA DO TOPBAR ==================== */

function initTopbarDate() {

    const topbarDate = document.getElementById('topbar-date');

    if (!topbarDate) return;

    topbarDate.textContent = new Date().toLocaleDateString(
        'pt-BR',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    );

}


/* ==================== INICIALIZAÇÃO ==================== */

function init() {

    initTopbarDate();

    initNavigation();

    initModals();

    nav(
        renderDashboard,
        'Dashboard <em>Geral</em>'
    );

}


/* ==================== INICIAR ==================== */

if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', init);

} else {

    init();

}