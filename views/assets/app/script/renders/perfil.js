import { toast } from '../helpers.js';

export async function renderPerfil(c) {

    c.innerHTML = `
        <div style="display:flex;justify-content:center;padding:40px;">
            Carregando perfil...
        </div>
    `;

    try {

        const token = localStorage.getItem('token');

        const response = await fetch(
            'http://localhost/Salon-Vision/api/users/profile',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        const user = result.data;

        c.innerHTML = `
        <div class="grid-2-1 fade-in">

            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Meu <em>Perfil</em></h1>
                </div>

                <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
                    <div class="profile-avatar-wrap">
                        <img
                            src="${user.photo || './assets/default-user.png'}"
                            class="profile-avatar"
                            id="perfil-foto"
                            alt="${user.name}"
                        />

                        <div
                            class="profile-avatar-edit"
                            onclick="toast('Upload de foto em breve!','ti-camera')"
                        >
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

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nome</label>

                        <input
                            type="text"
                            class="form-input"
                            id="input-nome"
                            value="${user.name ?? ''}"
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Telefone</label>

                        <input
                            type="text"
                            class="form-input"
                            id="input-tel"
                            value="${user.telephone ?? ''}"
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">E-mail</label>

                    <input
                        type="email"
                        class="form-input"
                        id="input-email"
                        value="${user.email ?? ''}"
                    />
                </div>

                <button
                    class="btn btn-gold"
                    id="btn-salvar"
                    style="width:100%;justify-content:center;"
                >
                    <i class="ti ti-device-floppy"></i>
                    Salvar Alterações
                </button>
            </div>

            <div class="gap-y">
                <div class="panel">
                    <div class="panel-header">
                        <h1 class="panel-title">
                            Resumo <em>da conta</em>
                        </h1>
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

        document
            .getElementById('btn-salvar')
            ?.addEventListener('click', async () => {

                try {

                    const body = {
                        name: document.getElementById('input-nome').value,
                        email: document.getElementById('input-email').value,
                        telephone: document.getElementById('input-tel').value
                    };

                    const response = await fetch(
                        'http://localhost/Salon-Vision/api/users/update',
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(body)
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        toast(result.message, 'ti-alert-circle');
                        return;
                    }

                    toast(
                        'Perfil atualizado com sucesso!',
                        'ti-check'
                    );

                } catch (error) {
                    console.error(error);
                    toast(
                        'Erro ao atualizar perfil',
                        'ti-alert-circle'
                    );
                }
            });

    } catch (error) {

        console.error(error);

        c.innerHTML = `
            <div class="panel">
                Erro ao carregar perfil.
            </div>
        `;
    }
}