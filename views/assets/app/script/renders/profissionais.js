import { estrelas, toast } from '../helpers.js';

export async function renderProfissionais(c) {
    c.innerHTML = `
        <div style="margin-bottom:16px;" class="fade-in">
            <h1 style="font-size:22px;font-weight:500;">
                Nossa <em>Equipe</em>
            </h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">
                Conheça os profissionais prontos para cuidar de você.
            </p>
        </div>

        <div class="prof-grid" id="prof-grid"></div>
    `;

    const grid = document.getElementById('prof-grid');

    try {
        const response = await fetch(
            'http://localhost/Salon-Vision/api/users/employees'
        );

        const result = await response.json();

        if (!result.data?.length) {
            grid.innerHTML = '<p>Nenhum profissional encontrado.</p>';
            return;
        }

        result.data.forEach((p, i) => {
            const div = document.createElement('div');

            div.className = 'prof-card fade-in';
            div.style.animationDelay = `${i * 0.06}s`;

            div.innerHTML = `
                <img
                    src="${p.photo || './assets/default-user.png'}"
                    class="prof-avatar"
                    alt="${p.name}"
                />

                <p class="prof-name">${p.name}</p>

                <p class="prof-role">
                    Funcionário
                </p>

                <div class="prof-stars">
                    ${estrelas(5)}
                    <span style="color:var(--text-dim);margin-left:2px;">
                        5.0
                    </span>
                </div>

                <button
                    class="btn btn-ghost"
                    style="margin-top:10px;font-size:11px;"
                    onclick="toast('Perfil de ${p.name} em breve!','ti-user')"
                >
                    <i class="ti ti-user"></i>
                    Ver Perfil
                </button>
            `;

            grid.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>Erro ao carregar profissionais.</p>';
    }
}