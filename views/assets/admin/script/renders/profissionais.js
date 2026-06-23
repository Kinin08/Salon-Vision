import { estrelas, toast } from '../helpers.js';

const BASE_URL = 'http://localhost/Salon-Vision/api';
const token = localStorage.getItem("token");

function garantirModalPerfil() {
    if (document.getElementById('modalPerfilProf')) return;
    const modal = document.createElement('div');
    modal.id = 'modalPerfilProf';
    modal.className = 'fixed inset-0 hidden items-center justify-center bg-black/60 backdrop-blur-sm z-50';

    modal.innerHTML = `
        <div class="w-full max-w-md rounded-2xl bg-[#0B0B0B] p-6 shadow-2xl animate-fade-in">

            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-white">
                    Perfil do <span class="text-[#FFCC7F]">Profissional</span>
                </h2>

                <button id="modalPerfilFechar" class="text-gray-400 hover:text-red-500 text-xl font-bold">
                    ✕
                </button>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                <img
                    id="perfilFoto"
                    src=""
                    alt=""
                    style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:2px solid #FFCC7F;"
                />

                <p id="perfilNome" style="font-size:18px;font-weight:600;color:#fff;"></p>

                <p style="font-size:12px;color:var(--text-dim);">
                    Funcionário
                </p>

                <div id="perfilStars" style="display:flex;align-items:center;gap:4px;"></div>

                <p id="perfilEmail" style="font-size:13px;color:var(--text-dim);margin-top:6px;"></p>
                <p id="perfilTelefone" style="font-size:13px;color:var(--text-dim);"></p>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById('modalPerfilFechar')
        .addEventListener('click', () => fecharModalPerfil());
}

function abrirModalPerfil(p) {
    garantirModalPerfil();

    document.getElementById('perfilFoto').src = p.photo || './assets/default-user.png';
    document.getElementById('perfilFoto').alt = p.name;
    document.getElementById('perfilNome').textContent = p.name;
    document.getElementById('perfilStars').innerHTML = `
        ${estrelas(5)}
        <span style="color:var(--text-dim);margin-left:2px;">5.0</span>
    `;
    document.getElementById('perfilEmail').textContent = p.email
        ? `📧 ${p.email}`
        : '';
    document.getElementById('perfilTelefone').textContent = p.telephone
        ? `📞 ${p.telephone}`
        : '';

    const modal = document.getElementById('modalPerfilProf');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function fecharModalPerfil() {
    const modal = document.getElementById('modalPerfilProf');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

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
            'http://localhost/Salon-Vision/api/users/employee'
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
                    data-action="ver-perfil"
                >
                    <i class="ti ti-user"></i>
                    Ver Perfil
                </button>
                <button class="btn btn-gold" data-action="promote">
                        🧑‍💼 Admin
                    </button>

                    <button class="btn btn-danger" data-action="delete">
                        👤 Cliente
                    </button>
            `;

            div.querySelector('[data-action="ver-perfil"]')
                .addEventListener('click', () => abrirModalPerfil(p));
            div.querySelector('[data-action="promote"]')

                .addEventListener('click', async () => {
                    if (!confirm('Promover para Admin?')) return;

                    console.log('USER:', p);
                    const res = await fetch(`${BASE_URL}/users/roleAdmin/${p.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        toast('Funcionario promovido para Admin');
                        div.remove();
                    } else {
                        toast('Erro ao promover');
                    }
                });
            div.querySelector('[data-action="delete"]')
                .addEventListener('click', async () => {
                    if (!confirm('Promover para Cliente?')) return;

                    const res = await fetch(`${BASE_URL}/users/roleCliente/${p.id}`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (res.ok) {
                        toast('Funcionario virou cliente');
                        div.remove();
                    } else {
                        toast('Erro ao promover');
                    }
                });
            grid.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>Erro ao carregar profissionais.</p>';
    }
}