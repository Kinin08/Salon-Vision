import { setActive, nav } from './helpers.js';
import { initModals } from './modals.js';
import { userMe } from '../../_common/Api/user.js';
import { FOTO_PADRAO } from '../../_common/script/Default.js';

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
async function carregarUsuarioLogado() {
    const me = await userMe();
    console.log('me:', me);
    console.log('foto:', me?.photo, '| padrão:', FOTO_PADRAO);
    console.log('ids:', {
        nome: !!document.getElementById('user-name'),
        avatar: !!document.getElementById('user-avatar'),
        topFoto: !!document.getElementById('user-photo')
    });
    if (!me || !me.id) return;

    const foto = me.photo || FOTO_PADRAO;

    const nome = document.getElementById('user-name');
    const avatar = document.getElementById('user-avatar');
    const topFoto = document.getElementById('user-photo');

    if (nome) nome.textContent = me.name;

    [avatar, topFoto].forEach(img => {
        if (!img) return;
        img.src = foto;
        img.onerror = () => {
            img.onerror = null;
            img.src = FOTO_PADRAO;
        };
    });
}

carregarUsuarioLogado();