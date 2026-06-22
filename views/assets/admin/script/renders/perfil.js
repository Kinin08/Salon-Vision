import { toast } from '../helpers.js';
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

        const result = await response.json();
        const user   = result.data;

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
                        <h1 class="panel-title">Resumo <em>da conta</em></h1>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <div style="display:flex;justify-content:space-between;">
                            <span>Agendamentos</span>
                            <span>${user.totalAppointments ?? 0}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span>Avaliações</span>
                            <span>${user.totalRatings ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        `;

        // ── Upload de foto ─────────────────────────────────────
        document.getElementById('btn-foto')
            ?.addEventListener('click', () => {
                document.getElementById('input-foto').click();
            });

        document.getElementById('input-foto')
            ?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('photo', file);

                try {
                    toast('Enviando foto...', 'ti-upload');

                    const res = await fetch(`${API}/users/upload-photo`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        toast(data.message ?? 'Erro ao enviar foto.', 'ti-alert-circle');
                        return;
                    }

                    document.getElementById('perfil-foto').src = data.data.photo;
                    toast('Foto atualizada!', 'ti-check');

                } catch (err) {
                    console.error(err);
                    toast('Erro de conexão.', 'ti-alert-circle');
                }
            });

        // ── Logout ─────────────────────────────────────────────
        document.querySelector("[data-action='logout']")
            ?.addEventListener('click', logout);

        // ── Salvar dados ───────────────────────────────────────
        document.getElementById('btn-salvar')
            ?.addEventListener('click', async () => {
                try {
                    const body = {
                        name:      document.getElementById('input-nome').value,
                        email:     document.getElementById('input-email').value,
                        telephone: document.getElementById('input-tel').value,
                    };

                    const res = await fetch(`${API}/users/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(body),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        toast(data.message ?? 'Erro ao salvar.', 'ti-alert-circle');
                        return;
                    }

                    toast('Perfil atualizado com sucesso!', 'ti-check');

                } catch (err) {
                    console.error(err);
                    toast('Erro de conexão.', 'ti-alert-circle');
                }
            });

    } catch (error) {
        console.error(error);
        c.innerHTML = `<div class="panel">Erro ao carregar perfil.</div>`;
    }
}