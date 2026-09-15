
import {
    setNavActive,
    navegarPara,
    updateTopbarTitle
} from './helpers.js';

import { initModals } from './modals.js';

import { renderInicio } from './renders/inicio.js';
import { renderAgendamentos } from './renders/agendamentos.js';
import { renderHistorico } from './renders/historico.js';
import { renderServicos } from './renders/servicos.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderFaqs } from './renders/faqs.js';
import { renderPerfil } from './renders/perfil.js';

import Users from "../../_common/classes/Users.js";

const user = new Users();

const responseData = await user.me();

const nome = responseData?.data?.name ?? 'Usuário';

const avatar = responseData?.data?.photo ?? '';


const rotas = {

    'nav-inicio': {
        fn: renderInicio,
        titulo: `Olá, <em>${nome}</em>`
    },

    'nav-agendamentos': {
        fn: renderAgendamentos,
        titulo: 'Meus <em>Agendamentos</em>'
    },

    'nav-historico': {
        fn: renderHistorico,
        titulo: 'Histórico de <em>Atendimentos</em>'
    },

    'nav-faqs': {
        fn: renderFaqs,
        titulo: 'Perguntas <em>Pendentes</em>'
    },

    'nav-servicos': {
        fn: renderServicos,
        titulo: 'Nossos <em>Serviços</em>'
    },

    'nav-profissionais': {
        fn: renderProfissionais,
        titulo: 'Nossa <em>Equipe</em>'
    },

    'nav-perfil': {
        fn: renderPerfil,
        titulo: 'Meu <em>Perfil</em>'
    }

};

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

function initTopbarDate() {

    const hoje = new Date();

    document
        .getElementById('topbar-date')
        .textContent = hoje.toLocaleDateString('pt-BR', {

            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'

        });

}


function initTopbarUser() {

    const userName = document.getElementById('user-name');

    const userAvatar = document.getElementById('user-avatar');

    if (userName) {

        userName.textContent = nome;

    }

    if (userAvatar && avatar) {

        userAvatar.src = avatar;

        userAvatar.alt = nome;

    }

}

function init() {

    initTopbarDate();

    initTopbarUser();

    initNavigation();

    initModals();

    navegarPara(renderInicio);

}


if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', init);

} else {

    init();

}
