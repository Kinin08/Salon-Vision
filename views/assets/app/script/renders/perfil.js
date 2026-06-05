import { meusAgendamentos } from '../data.js';
import { toast, navegarPara } from '../helpers.js';
import { CLIENTE } from '../data.js';
export function renderPerfil(c) {
            c.innerHTML = `
        <div class="grid-2-1 fade-in">

            <!-- Formulário -->
            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Meu <em>Perfil</em></h1>
                </div>

                <!-- Avatar -->
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
                    <div class="profile-avatar-wrap">
                        <img src="${CLIENTE.foto}" class="profile-avatar" id="perfil-foto" alt="${CLIENTE.nome}" />
                        <div class="profile-avatar-edit" onclick="toast('Upload de foto em breve!','ti-camera')">
                            <i class="ti ti-camera"></i>
                        </div>
                    </div>
                    <div>
                        <p style="font-size:15px;font-weight:600;color:var(--text);">${CLIENTE.nome}</p>
                        <p style="font-size:11px;color:var(--text-dim);">${CLIENTE.email}</p>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-input" id="input-nome" value="${CLIENTE.nome}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="text" class="form-input" id="input-tel" value="${CLIENTE.telefone}" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-input" id="input-email" value="${CLIENTE.email}" />
                </div>

                <div style="border-top:1px solid var(--border);margin:20px 0;padding-top:20px;">
                    <p style="font-size:12px;font-weight:500;color:var(--text);margin-bottom:14px;">
                        <i class="ti ti-lock" style="color:var(--gold-dark);margin-right:4px;"></i>
                        Alterar Senha
                    </p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Senha atual</label>
                            <input type="password" class="form-input" placeholder="••••••••" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nova senha</label>
                            <input type="password" class="form-input" placeholder="••••••••" />
                        </div>
                    </div>
                </div>

                <button class="btn btn-gold" id="btn-salvar" style="width:100%;justify-content:center;">
                    <i class="ti ti-device-floppy"></i> Salvar Alterações
                </button>
            </div>

            <!-- Resumo -->
            <div class="gap-y">
                <div class="panel fade-in delay-1">
                    <div class="panel-header" style="margin-bottom:12px;">
                        <h1 class="panel-title">Resumo <em>da conta</em></h1>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;color:var(--text-dim);">Agendamentos realizados</span>
                            <span style="font-size:14px;font-weight:600;color:var(--gold);">${CLIENTE.totalAgendamentos}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;color:var(--text-dim);">Avaliações feitas</span>
                            <span style="font-size:14px;font-weight:600;color:var(--gold);">${CLIENTE.avaliacoesFeitas}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;color:var(--text-dim);">Próximos agendamentos</span>
                            <span style="font-size:14px;font-weight:600;color:var(--gold);">${meusAgendamentos.filter(a => a.status !== 'cancelled').length}</span>
                        </div>
                    </div>
                </div>

                <div class="panel fade-in delay-2">
                    <div class="panel-header" style="margin-bottom:12px;">
                        <h1 class="panel-title">Serviços <em>favoritos</em></h1>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                        ${CLIENTE.favoritos.map(f => `<span class="fav-chip"><i class="ti ti-heart-filled" style="font-size:10px;"></i> ${f}</span>`).join('')}
                    </div>
                </div>
            </div>

        </div>
        `;

            document.getElementById('btn-salvar')?.addEventListener('click', () => {
                CLIENTE.nome = document.getElementById('input-nome').value;
                CLIENTE.email = document.getElementById('input-email').value;
                CLIENTE.telefone = document.getElementById('input-tel').value;
                toast('Perfil atualizado com sucesso!', 'ti-check');
            });
        }