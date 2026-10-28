
import {
    setNavActive,
    navegarPara,
    updateTopbarTitle
} from './helpers.js';

import { initModals } from './modals.js';
import { FOTO_PADRAO } from '../../_common/script/Default.js';
import { renderInicio } from './renders/inicio.js';
import { renderAgendamentos } from './renders/agendamentos.js';
import { renderHistorico } from './renders/historico.js';
import { renderServicos } from './renders/servicos.js';
import { renderProfissionais } from './renders/profissionais.js';
import { renderFaqs } from './renders/faqs.js';
import { renderPerfil } from './renders/perfil.js';

import Users from "../../_common/classes/Users.js";

const user = new Users();

const response = await user.me();

if (response.code !== 200) {
    window.location.href = "../login/index.html";
} else {

    const userTypeId = Number(response.data.user_type_id);

    if (userTypeId !== 4) {
        if (userTypeId === 3) {
            window.location.href = "../admin/index.html";
        } else if (userTypeId === 5) {
            window.location.href = "../employee/index.html";
        } else {
            window.location.href = "../login/index.html";
        }
    }
}

const nome = response.data.name ?? 'Usuário';

const rotas = {

    'nav-inicio': {
        fn: renderInicio,
        titulo: `Visão <em>geral</em>`
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
    const foto = response.data.photo || FOTO_PADRAO;

    if (userName) {
        userName.textContent = nome;
    }

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
