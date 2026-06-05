import { profissionais } from '../data.js';
import { estrelas, toast } from '../helpers.js';
import { navegarPara } from '../helpers.js';
export function renderProfissionais(c) {
    c.innerHTML = `
        <div style="margin-bottom:16px;" class="fade-in">
            <h1 style="font-size:22px;font-weight:500;">Nossa <em>Equipe</em></h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">Conheça os profissionais prontos para cuidar de você.</p>
        </div>
        <div class="prof-grid" id="prof-grid"></div>
        `;

    const grid = document.getElementById('prof-grid');
    profissionais.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'prof-card fade-in';
        div.style.animationDelay = `${i * 0.06}s`;
        div.innerHTML = `
                <img src="${p.foto}" class="prof-avatar" alt="${p.nome}" />
                <p class="prof-name">${p.nome}</p>
                <p class="prof-role">${p.role}</p>
                <div class="prof-stars">${estrelas(Math.round(p.nota))} <span style="color:var(--text-dim);margin-left:2px;">${p.nota}</span></div>
                <button class="btn btn-ghost" style="margin-top:10px;font-size:11px;" onclick="toast('Perfil de ${p.nome} em breve!','ti-user')">
                    <i class="ti ti-user"></i> Ver Perfil
                </button>
            `;
        grid.appendChild(div);
    });
}