import { estrelas, toast } from '../helpers.js';
import { logout } from '../../../public/script/logout.js';

const API = 'http://localhost/Salon-Vision/api';

export async function renderPerfil(c) {

    c.innerHTML = `
        <div style="display:flex;justify-content:center;padding:40px;">
            Carregando perfil...
        </div>
    `;




    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const adminsReq = await fetch(`${API}/users/admin`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const result = await response.json();
        const adminRes = await adminsReq.json();

        const user = result.data;
        const admins = adminRes.data || [];

        function abrirModalAdmin(p) {

            let modal = document.getElementById('modalAdmin');

            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modalAdmin';
                modal.className = 'fixed inset-0 hidden items-center justify-center bg-black/60 backdrop-blur-sm z-50';

                modal.innerHTML = `
                    <div class="w-full max-w-md rounded-2xl bg-[#0B0B0B] p-6 shadow-2xl">

                        <div style="display:flex;justify-content:space-between;">
                        
                    <div class="panel-header">
                        <h1 class="panel-title">Perfil do <em>Admin</em></h1>
                    </div>
                            <button id="closeAdmin">✕</button>
                        </div>

                        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:20px;">
                            <img id="adminFoto" style="width:90px;height:90px;border-radius:50%;" />
                            <p id="adminNome" style="color:white;font-weight:600;"></p>
                            <p id="adminEmail" style="color:gray;font-size:12px;"></p>
                            <p id="adminTelephone" style="color:gray;font-size:12px;"></p>
                        </div>

                    </div>
                `;

                document.body.appendChild(modal);

                document.getElementById('closeAdmin')
                    .addEventListener('click', () => {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                    });
            }

            document.getElementById('adminFoto').src = p.photo || './assets/default-user.png';
            document.getElementById('adminNome').textContent = p.name;
            document.getElementById('adminEmail').textContent = p.email || '';
            document.getElementById('adminTelephone').textContent = p.telephone || '';

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }


        function fecharModalAdmin() {
            const modal = document.getElementById('modalCliente');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        c.innerHTML = `
        <div class="grid-2-1 fade-in">

            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Meu <em>Perfil</em></h1>
                </div>

                <!-- Avatar -->
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
                    <div class="profile-avatar-wrap">
                        <img
                            src="${user.photo || './assets/default-user.png'}"
                            class="profile-avatar"
                            id="perfil-foto"
                            alt="${user.name}"
                        />
                        <div class="profile-avatar-edit" id="btn-foto">
                            <i class="ti ti-camera"></i>
                        </div>
                    </div>

                    <div>
                        <p style="font-size:15px;font-weight:600;color:var(--text);">
                            ${user.name}
                        </p>
                        <p style="font-size:11px;color:var(--text-dim);">
                            ${user.email}
                        </p>
                    </div>
                </div>

                <!-- Input de foto escondido -->
                <input
                    type="file"
                    id="input-foto"
                    accept="image/jpeg,image/png,image/webp"
                    style="display:none"
                />

                <!-- Formulário -->
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-input" id="input-nome" value="${user.name ?? ''}"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="text" class="form-input" id="input-tel" value="${user.telephone ?? ''}"/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-input" id="input-email" value="${user.email ?? ''}"/>
                </div>

                <button class="btn btn-gold" id="btn-salvar" style="width:100%;justify-content:center;">
                    <i class="ti ti-device-floppy"></i>
                    Salvar Alterações
                </button>

                <button data-action="logout" class="btn" style="width:100%;justify-content:center;margin-top:8px;">
                    <i class="ti ti-logout"></i>
                    Sair
                </button>
            </div>

            <div class="gap-y">
                <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Admins <em>do sistema</em></h1>
                </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <div class="panel-header">
                            <h1 class="panel-title">Total de <em>Admins ${admins.length}</em></h1>
                        </div>
                    </div>

                <div id="admin-grid" style="display:flex;flex-direction:column;gap:10px;"></div>
            </div>
                
            </div>


        </div>
        `;

        /* ================= LISTA DE ADMINS ================= */
        const grid = document.getElementById('admin-grid');

        admins.forEach((p, i) => {

            const div = document.createElement('div');

            div.className = 'prof-card fade-in';
            div.style.animationDelay = `${i * 0.05}s`;

            div.innerHTML = `
                <img src="${p.photo || './assets/default-user.png'}" class="prof-avatar" />

                <div>
                    <p class="prof-name">${p.name}</p>
                </div>

                <button class="btn btn-ghost" data-action="view">
                    Ver
                </button>
            `;


            /* VER PERFIL */
            div.querySelector('[data-action="view"]')
                .addEventListener('click', () => {
                    abrirModalAdmin(p)
                });

            grid.appendChild(div);
        });

        /* ================= LOGOUT ================= */
        document.querySelector("[data-action='logout']")
            ?.addEventListener('click', logout);

    } catch (error) {
        console.error(error);
        c.innerHTML = `<div class="panel">Erro ao carregar perfil.</div>`;
    }
}