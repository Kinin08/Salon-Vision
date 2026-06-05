import { meusAgendamentos } from './data.js';

/** Atualiza classe active na sidebar */
export function setNavActive(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

/** Troca o conteúdo com fade */
export function navegarPara(renderFn, containerId = 'page-content') {
    const c = document.getElementById(containerId);
    c.style.transition = 'opacity 0.25s ease';
    c.style.opacity = '0';
    setTimeout(() => {
        c.innerHTML = '';
        renderFn(c);
        c.style.opacity = '1';
    }, 250);
}

/** Exibe toast */
export function toast(msg, icon = 'ti-check') {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    t.querySelector('i').className = `ti ${icon}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

/** Gera estrelas HTML */
export function estrelas(n) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += `<i class="ti ti-star${i <= n ? '-filled star-filled' : ''}"></i>`;
    }
    return s;
}

/** Atualiza o título do topbar */
export function updateTopbarTitle(titulo) {
    document.getElementById('topbar-title').innerHTML = titulo;
}