import { toast } from '../helpers.js';

const BASE_URL = 'http://localhost/Salon-Vision/api';

function getTypeId(u) {
    return Number(u.user_type_id ?? u.userTypeId ?? 0);
}

/* ================= MODAL ================= */

function garantirModalCliente() {
    if (document.getElementById('modalCliente')) return;

    const modal = document.createElement('div');
    modal.id = 'modalCliente';
    modal.className = 'fixed inset-0 hidden items-center justify-center bg-black/60 backdrop-blur-sm z-50';

    modal.innerHTML = `
        <div class="w-full max-w-md rounded-2xl bg-[#0B0B0B] p-6 shadow-2xl animate-fade-in">

            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-white">
                    Perfil do <span class="text-[#FFCC7F]">Cliente</span>
                </h2>

                <button id="fecharModalCliente" class="text-gray-400 hover:text-red-500 text-xl font-bold">
                    ✕
                </button>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                <img id="clienteFoto"
                    src=""
                    style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:2px solid #FFCC7F;"
                />

                <p id="clienteNome" style="font-size:18px;font-weight:600;color:#fff;"></p>

                <div id="clienteStars" style="display:flex;align-items:center;gap:4px;"></div>

                <p id="clienteEmail" style="font-size:13px;color:var(--text-dim);margin-top:6px;"></p>
                <p id="clienteTelefone" style="font-size:13px;color:var(--text-dim);"></p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('fecharModalCliente')
        .addEventListener('click', fecharModalCliente);
}

function abrirModalCliente(c) {
    garantirModalCliente();

    document.getElementById('clienteFoto').src = c.photo || './assets/default-user.png';
    document.getElementById('clienteNome').textContent = c.name;

    document.getElementById('clienteEmail').textContent = c.email ? `📧 ${c.email}` : '';
    document.getElementById('clienteTelefone').textContent = c.telephone ? `📞 ${c.telephone}` : '';

    const modal = document.getElementById('modalCliente');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function fecharModalCliente() {
    const modal = document.getElementById('modalCliente');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

/* ================= RENDER ================= */

export async function renderClientesAdmin(c) {
    c.innerHTML = `
        <div class="fade-in" style="margin-bottom:16px;">
            <h1 style="font-size:22px;font-weight:500;">
                Gestão de <em>Clientes</em>
            </h1>

            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">
                Gerencie clientes cadastrados no sistema.
            </p>
        </div>

        <div class="prof-grid" id="clientes-grid"></div>
    `;

    const grid = document.getElementById('clientes-grid');

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${BASE_URL}/users/cliente`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const result = await response.json();

        const clientes = (result.data || []).filter(u => getTypeId(u) === 4);

        if (!clientes.length) {
            grid.innerHTML = `<p>Nenhum cliente encontrado.</p>`;
            return;
        }

        clientes.forEach((c, i) => {
            const card = document.createElement('div');

            card.className = 'prof-card fade-in';
            card.style.animationDelay = `${i * 0.06}s`;

            card.innerHTML = `
                <img
                    src="${c.photo || './assets/default-user.png'}"
                    class="prof-avatar"
                />

                <p class="prof-name">${c.name}</p>

                <div style="display:flex;gap:6px;justify-content:center;margin-top:10px;flex-wrap:wrap;">

                    <button class="btn btn-ghost" data-action="view">
                        👁 Perfil
                    </button>

                    <button class="btn btn-gold" data-action="promote">
                        🧑‍💼 Funcionario
                    </button>

                    <button class="btn btn-danger" data-action="delete">
                        🗑 Excluir
                    </button>

                </div>
            `;

            /* 👁 PERFIL */
            card.querySelector('[data-action="view"]')
                .addEventListener('click', () => abrirModalCliente(c));

            /* 👔 PROMOVER */
            card.querySelector('[data-action="promote"]')
                .addEventListener('click', async () => {
                    if (!confirm('Promover para Funcionario?')) return;
                    console.log('USER:', c);
                    const res = await fetch(`${BASE_URL}/users/roleFunc/${c.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        toast('Usuário promovido para Funcionário');
                        card.remove();
                    } else {
                        toast('Erro ao promover');
                    }
                });

            /* 🗑 EXCLUIR */
            card.querySelector('[data-action="delete"]')
                .addEventListener('click', async () => {
                    if (!confirm('Excluir cliente?')) return;

                    const res = await fetch(`${BASE_URL}/users/delete/${c.id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });


                    if (res.ok) {
                        toast('Cliente removido');
                        card.remove();
                    } else {
                        toast('Erro ao remover');
                    }
                });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p>Erro ao carregar clientes.</p>`;
    }
}