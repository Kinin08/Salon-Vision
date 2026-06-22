import { setNavActive, navegarPara, updateTopbarTitle } from './helpers.js';
import { initModals } from './modals.js';
import { renderInicio } from './renders/inicio.js';
import { renderAgendamentos } from './renders/agendamentos.js';
import { renderServicos } from './renders/servicos.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderFaqs } from './renders/faqs.js';
import { renderPerfil } from './renders/perfil.js';
import { renderClientesAdmin } from './renders/clientes.js';

// Configuração das rotas
const rotas = {
    'nav-dashboard': { fn: renderInicio, titulo: 'Olá, <em>Ana!</em>' },
    'nav-agendamentos': { fn: renderAgendamentos, titulo: 'Meus <em>Agendamentos</em>' },
    'nav-faqs': { fn: renderFaqs, titulo: 'Perguntas <em>Pendentes</em>' },
    'nav-servicos': { fn: renderServicos, titulo: 'Nossos <em>Serviços</em>' },
    'nav-profissionais': { fn: renderProfissionais, titulo: 'Nossa <em>Equipe</em>' },
    'nav-perfil': { fn: renderPerfil, titulo: 'Meu <em>Perfil</em>' },
    'nav-clientes': { fn: renderClientesAdmin, titulo: 'Meus <em>Clientes</em>' },
};

// Inicializar navegação
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const id = item.id;
            const rota = rotas[id];
            if (!rota) return;

            setNavActive(id);
            updateTopbarTitle(rota.titulo);
            navegarPara(rota.fn);
        });
    });
}

// Inicializar data no topbar
function initTopbarDate() {
    const hoje = new Date();
    document.getElementById('topbar-date').textContent = hoje.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Inicializar aplicação
function init() {
    initTopbarDate();
    initNavigation();
    initModals();
    navegarPara(renderInicio);
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}