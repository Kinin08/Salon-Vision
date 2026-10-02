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

    setTimeout(async () => {

        c.innerHTML = '';

        try {

            await renderFn(c);

            c.style.opacity = '1';

        } catch (error) {

            console.error('ERRO AO RENDERIZAR:', error);

            c.innerHTML = `
                <div style="padding: 30px;">
                    <h2>Erro ao carregar esta página</h2>
                    <p>Veja o Console para mais detalhes.</p>
                </div>
            `;

            c.style.opacity = '1';
        }

    }, 250);
}


/** Atualiza o título do topbar */
export function updateTopbarTitle(titulo) {
    document.getElementById('topbar-title').innerHTML = titulo;
}