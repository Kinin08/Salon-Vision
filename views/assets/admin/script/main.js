import { setActive, nav } from './helpers.js';
import { initModals } from './modals.js';
import { FOTO_PADRAO } from '../../_common/script/Default.js';
import Users from '../../_common/classes/Users.js';

import { renderDashboard } from './renders/dashboard.js';
import { renderAgendamentos } from './renders/agendamento.js';
import { renderClientes } from './renders/clientes.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderServicos } from './renders/servicos.js';
import { renderAvaliacoes } from './renders/avaliacoes.js';
import { renderFaqs } from './renders/faqs.js';
import { renderServicosEmp } from './renders/serviceEmployee.js';
import { renderPerfil } from './renders/perfil.js';

/* ==================== AUTENTICAÇÃO ==================== */

const ADMIN_TYPE = 3;

// Ajuste "../cliente/index.html" para o nome real da pasta do cliente
const REDIRECTS = {
    4: '../cliente/index.html',
    5: '../employee/index.html'
};

const user = new Users();
const response = await user.me();

function redirecionar(url) {
    window.location.href = url;
}

if (!response || response.code !== 200) {
    redirecionar('../login/index.html');
    await new Promise(() => { }); // interrompe o módulo enquanto redireciona
}

const tipoUsuario = Number(response.data.user_type_id);

if (tipoUsuario !== ADMIN_TYPE) {
    redirecionar(REDIRECTS[tipoUsuario] ?? '../login/index.html');
    await new Promise(() => { });
}

const nome = response.data.name ?? 'Usuário';

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
    serviceEmployee: {
        fn: renderServicosEmp,
        titulo: 'Gestão de <em>Serviços e Funcionários</em>'
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

    topbarDate.textContent = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/* ==================== USUÁRIO NO TOPBAR / SIDEBAR ==================== */

function initTopbarUser() {
    const userName = document.getElementById('user-name');
    const foto = response.data.photo || FOTO_PADRAO;

    if (userName) userName.textContent = nome;

    for (const id of ['user-photo', 'user-avatar']) {
        const img = document.getElementById(id);
        if (!img) continue;

        img.onerror = () => {
            img.onerror = null;
            img.src = FOTO_PADRAO;
        };
        img.src = foto;
        img.alt = `Foto de ${nome}`;
    }
}

/* ==================== INICIALIZAÇÃO ==================== */

function init() {
    initTopbarDate();
    initTopbarUser();
    initNavigation();
    initModals();

    nav(renderDashboard, 'Dashboard <em>Geral</em>');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}