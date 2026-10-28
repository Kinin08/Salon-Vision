// Salve como: _common/script/PainelPessoas.js (substitui o anterior)
// Mini painel (modal) com abas "Agendamentos" e "Profissionais", com busca.

import { FOTO_PADRAO } from './Default.js';

const ESTILO_ID = 'painel-pessoas-styles';

// Evita que nomes/e-mails com <, > ou aspas quebrem (ou injetem) HTML
function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function normalizar(texto) {
    return String(texto ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// "2026-10-28 14:00:00" -> Date (o 'T' evita erro no Safari)
function lerData(valor) {
    return new Date(String(valor ?? '').replace(' ', 'T'));
}

function formatarTelefone(valor) {
    const d = String(valor ?? '').replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return d;
}

function injetarEstilos() {
    if (document.getElementById(ESTILO_ID)) return;

    const style = document.createElement('style');
    style.id = ESTILO_ID;
    style.textContent = `
        .pp-overlay {
            position: fixed; inset: 0; z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            padding: 16px;
            background: rgba(0, 0, 0, 0.75);
        }
        .pp-box {
            width: 100%; max-width: 500px; max-height: 80vh;
            display: flex; flex-direction: column;
            padding: 22px;
            background: #1a1a1a;
            border: 1px solid #444; border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .pp-header {
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 14px;
        }
        .pp-title { font-size: 18px; font-weight: 500; color: var(--text, #fff); }
        .pp-title em { color: var(--gold, #FFCC7F); }
        .pp-close {
            background: none; border: none; cursor: pointer;
            color: var(--text-dim, #999); font-size: 20px; line-height: 1;
            transition: color 0.2s ease;
        }
        .pp-close:hover { color: var(--gold, #FFCC7F); }

        .pp-tabs {
            display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
            padding: 4px; margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.04); border-radius: 10px;
        }
        .pp-tab {
            padding: 9px 10px; border: none; border-radius: 8px; cursor: pointer;
            background: transparent; color: var(--text-dim, #999);
            font-size: 12px; font-weight: 500; transition: all 0.2s ease;
        }
        .pp-tab:hover { color: var(--text, #fff); }
        .pp-tab.active { background: var(--gold, #FFCC7F); color: #000; }
        .pp-count {
            margin-left: 4px; padding: 1px 7px; border-radius: 99px;
            background: rgba(0, 0, 0, 0.2); font-size: 10px;
        }

        .pp-search {
            width: 100%; margin-bottom: 12px; padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
            color: var(--text, #fff); font-size: 12px; outline: none;
        }
        .pp-search:focus { border-color: var(--gold, #FFCC7F); }

        .pp-list {
            display: flex; flex-direction: column; gap: 8px;
            overflow-y: auto; padding-right: 2px;
        }
        .pp-item {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 10px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .pp-item:hover {
            border-color: rgba(202, 148, 64, 0.3);
            background: rgba(202, 148, 64, 0.06);
        }
        .pp-avatar {
            width: 40px; height: 40px; flex-shrink: 0;
            border-radius: 50%; object-fit: cover;
        }
        .pp-info { min-width: 0; }
        .pp-name {
            font-size: 13px; font-weight: 500; color: var(--text, #fff);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pp-meta {
            margin-top: 2px; font-size: 11px; color: var(--text-dim, #999);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pp-status { margin-left: auto; flex-shrink: 0; }
        .pp-empty {
            padding: 24px 0; text-align: center;
            font-size: 12px; color: var(--text-dim, #999);
        }
    `;
    document.head.appendChild(style);
}

// ---------- Como cada aba desenha um item ----------

function itemAgendamento(a) {
    const data = lerData(a.date_time);
    const quando = isNaN(data)
        ? ''
        : data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    const meta = [a.service_name, quando].filter(Boolean).map(esc).join(' · ');

    return `
        <div class="pp-item">
            <img class="pp-avatar" src="${esc(a.client_photo || FOTO_PADRAO)}" alt="Foto de ${esc(a.client_name)}" />
            <div class="pp-info">
                <p class="pp-name">${esc(a.client_name)}</p>
                <p class="pp-meta">${meta || 'Sem detalhes'}</p>
            </div>
            <span class="status-pill ${esc(a.status)} pp-status">
                <span class="status-dot"></span>
                ${esc(a.status)}
            </span>
        </div>
    `;
}

function itemProfissional(p) {
    const contato = [p.email, formatarTelefone(p.telephone)].filter(Boolean).map(esc).join(' · ');

    return `
        <div class="pp-item">
            <img class="pp-avatar" src="${esc(p.photo || FOTO_PADRAO)}" alt="Foto de ${esc(p.name)}" />
            <div class="pp-info">
                <p class="pp-name">${esc(p.name)}</p>
                <p class="pp-meta">${contato || 'Sem contato'}</p>
            </div>
        </div>
    `;
}

export function abrirPainelPessoas({
    agendamentos = [],
    profissionais = [],
    abaInicial = 'agendamentos'
} = {}) {
    injetarEstilos();

    document.getElementById('painel-pessoas')?.remove();

    // Agendamentos em ordem cronológica
    const agendamentosOrdenados = [...agendamentos].sort(
        (a, b) => lerData(a.date_time) - lerData(b.date_time)
    );

    const abas = {
        agendamentos: {
            rotulo: 'Agendamentos',
            itens: agendamentosOrdenados,
            vazio: 'Nenhum agendamento encontrado.',
            textosBusca: (a) => [a.client_name, a.service_name, a.status],
            desenharItem: itemAgendamento
        },
        profissionais: {
            rotulo: 'Profissionais',
            itens: profissionais,
            vazio: 'Nenhum profissional cadastrado.',
            textosBusca: (p) => [p.name, p.email],
            desenharItem: itemProfissional
        }
    };

    let abaAtual = abas[abaInicial] ? abaInicial : 'agendamentos';
    let busca = '';

    const overlay = document.createElement('div');
    overlay.id = 'painel-pessoas';
    overlay.className = 'pp-overlay';

    overlay.innerHTML = `
        <div class="pp-box" role="dialog" aria-modal="true" aria-label="Agendamentos e profissionais">
            <div class="pp-header">
                <h2 class="pp-title">Ver <em>todos</em></h2>
                <button type="button" class="pp-close" aria-label="Fechar">
                    <i class="ti ti-x"></i>
                </button>
            </div>

            <div class="pp-tabs">
                ${Object.entries(abas).map(([chave, aba]) => `
                    <button type="button" class="pp-tab" data-aba="${chave}">
                        ${aba.rotulo}<span class="pp-count">${aba.itens.length}</span>
                    </button>
                `).join('')}
            </div>

            <input type="search" class="pp-search" placeholder="Buscar..." />

            <div class="pp-list"></div>
        </div>
    `;

    const lista = overlay.querySelector('.pp-list');
    const campoBusca = overlay.querySelector('.pp-search');

    function desenhar() {
        overlay.querySelectorAll('.pp-tab').forEach((botao) => {
            botao.classList.toggle('active', botao.dataset.aba === abaAtual);
        });

        const aba = abas[abaAtual];
        const termo = normalizar(busca);

        const filtrados = aba.itens.filter((item) =>
            !termo ||
            aba.textosBusca(item).some((texto) => normalizar(texto).includes(termo))
        );

        if (filtrados.length === 0) {
            lista.innerHTML = `<div class="pp-empty">${termo ? 'Nenhum resultado para a busca.' : aba.vazio}</div>`;
            return;
        }

        lista.innerHTML = filtrados.map(aba.desenharItem).join('');

        // Foto quebrada -> foto padrão
        lista.querySelectorAll('img').forEach((img) => {
            img.addEventListener('error', () => { img.src = FOTO_PADRAO; }, { once: true });
        });
    }

    function aoPressionarTecla(event) {
        if (event.key === 'Escape') fechar();
    }

    function fechar() {
        document.removeEventListener('keydown', aoPressionarTecla);
        overlay.remove();
    }

    overlay.querySelectorAll('.pp-tab').forEach((botao) => {
        botao.addEventListener('click', () => {
            abaAtual = botao.dataset.aba;
            desenhar();
        });
    });

    campoBusca.addEventListener('input', () => {
        busca = campoBusca.value;
        desenhar();
    });

    overlay.querySelector('.pp-close').addEventListener('click', fechar);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) fechar();
    });

    document.addEventListener('keydown', aoPressionarTecla);

    desenhar();
    document.body.appendChild(overlay);
    campoBusca.focus();
}