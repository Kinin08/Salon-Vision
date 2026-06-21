import { setActive, nav, toast, updateBadge } from './helpers.js';
import { initModals } from './modals.js';
import { renderDashboard } from './renders/dashboard.js';
import { renderAgendamentos,  } from './renders/agendamento.js';
import { renderClientes } from './renders/clientes.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderServicos } from './renders/servicos.js';
import { renderAvaliacoes } from './renders/avaliacoes.js';
import { renderFaqs } from './renders/faqs.js';
import { renderPerfil } from './renders/perfil.js';

// Configuração de rotas
const rotas = {
    'nav-dashboard': { fn: renderDashboard, titulo: 'Dashboard <em>Geral</em>' },
    'nav-agendamentos': { fn: renderAgendamentos, titulo: 'Gestão de <em>Agendamentos</em>' },
    'nav-clientes': { fn: renderClientes, titulo: 'Gestão de <em>Clientes</em>' },
    'nav-profissionais': { fn: renderProfissionais, titulo: 'Nossa <em>Equipe</em>' },
    'nav-faqs': { fn: renderFaqs, titulo: 'Perguntas mais <em>Frequentes</em>' },
    'nav-servicos': { fn: renderServicos, titulo: 'Catálogo de <em>Serviços</em>' },
    'nav-avaliacoes': { fn: renderAvaliacoes, titulo: 'Central de <em>Avaliações</em>' },
    'nav-perfil': { fn: renderPerfil, titulo: '<em>Perfil</em>' },
};

// Inicializar navegação
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const rota = rotas[item.id];
            if (!rota) return;
            setActive(item.id);
            nav(rota.fn, rota.titulo);
        });
    });
}

// Inicializar data/hora do topbar
function initTopbarDate() {
    const topbarDate = document.getElementById('topbar-date');
    if (topbarDate) {
        topbarDate.textContent = new Date().toLocaleDateString('pt-BR', {
         weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }
}

// Inicializar aplicação
function init() {
    initTopbarDate();
    initNavigation();
    initModals();
    nav(renderDashboard, 'Dashboard <em>Geral</em>');
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}