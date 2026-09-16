import { meusAgendamentos } from '../data.js';
import { toast } from '../helpers.js';
import { CLIENTE } from '../data.js';

import { userMe, update } from './../../../_common/Api/user.js';

export async function renderPerfil(c) {
    const me = await userMe();
    c.innerHTML = `
        <style>
        .modal-overlay {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;

            z-index: 999999 !important;

            display: none !important;

            align-items: center !important;
            justify-content: center !important;

            background: rgba(0, 0, 0, 0.8) !important;

            cursor: pointer !important;
            pointer-events: auto !important;
        }

        .modal-overlay.is-open {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .modal-box {
            position: relative !important;

            z-index: 1000000 !important;

            width: min(92vw, 380px) !important;
            padding: 24px !important;

            background: #1a1a1a !important;
            border: 1px solid #444 !important;
            border-radius: 10px !important;

            text-align: center !important;

            cursor: default !important;
        }

        .modal-actions {
            display: flex;
            gap: 10px;
        }

        .modal-actions .btn {
            cursor: pointer !important;
            flex: 1;
            justify-content: center;
            transition: all 0.2s ease;
        }

        #btn-cancelar-delete:hover {
            background: var(--gold) !important;
            color: #000 !important;
            border-color: var(--gold) !important;
        }

        #btn-confirmar-delete:hover {
            background: #ff5a5f !important;
            color: #fff !important;
            border-color: #ff5a5f !important;
        }

        .modal-icon {
            font-size: 34px;
            color: #e5484d;
            margin-bottom: 10px;
        }

        .modal-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 8px;
        }

        .modal-text {
            font-size: 12px;
            color: var(--text-dim);
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .modal-actions {
            display: flex;
            gap: 10px;
        }

        .modal-actions .btn {
            cursor: pointer;
            flex: 1;
            justify-content: center;
        }
        .password-wrapper {
            position: relative;
            display: block;
        }

        .password-wrapper .form-input {
            width: 100%;
            padding-right: 38px;
        }

        .password-toggle {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
        
            display: flex;
            align-items: center;
            justify-content: center;
        
            width: 26px;
            height: 26px;
            padding: 0;
        
            background: none;
            border: none;
            cursor: pointer;
        
            color: var(--text-dim);
            font-size: 16px;
            line-height: 1;
        }
        
        .password-toggle:hover {
            color: var(--gold);
        }
            .perfil-grid {
                display: grid;
                grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                gap: 20px;
                align-items: start;
            }

            .perfil-resumo {
                position: sticky;
                top: 20px;
            }

            @media (max-width: 900px) {
                .perfil-grid {
                    grid-template-columns: 1fr;
                }

                .perfil-resumo {
                    position: static;
                }
            }
        </style>
        <div class="modal-overlay" id="modal-deletar">
            <div class="modal-box">

                <i class="ti ti-alert-triangle modal-icon"></i>

                <!-- PRIMEIRA ETAPA -->
                <div class="buttonsToDelete">
                    <p class="modal-title">
                        Deletar conta
                    </p>

                    <p class="modal-text">
                        Tem certeza que deseja deletar sua conta?
                        Esta ação é irreversível e todos os seus dados serão perdidos.
                    </p>

                    <div class="modal-actions">
                        <button
                            type="button"
                            class="btn btn-senha"
                            id="btn-cancelar-delete"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="btn btn-delet"
                            id="btn-confirmar-delete"
                        >
                            Sim, deletar
                        </button>
                    </div>
                </div>

                <!-- SEGUNDA ETAPA -->
                <div
                    class="senhaToDelete"
                    style="display: none;"
                >
                    <p class="modal-title">
                        Confirmar exclusão
                    </p>

                    <p class="modal-text">
                        Digite sua senha para excluir sua conta:
                    </p>

                    <div class="password-wrapper">
                        <input
                            type="password"
                            class="form-input"
                            id="senha-delete"
                            placeholder="Senha atual"
                        />

                        <button
                            type="button"
                            id="btn-visualizar-senha-delete"
                            class="password-toggle"
                        >
                            <i class="ti ti-eye"></i>
                        </button>
                    </div>

                    <div class="modal-actions" style="margin-top: 10px;">
                        <button
                            type="button"
                            class="btn btn-senha"
                            id="btn-cancelar-delete-senha"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="btn btn-delet"
                            id="btn-excluir-conta"
                        >
                            Excluir conta
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <div class="perfil-grid fade-in">

            <!-- Formulário -->
            <div class="panel">
                <div class="panel-header">
                    <h1 class="panel-title">Meu <em>Perfil</em></h1>
                </div>

                <!-- Avatar -->
                <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px;">

                    <div class="profile-avatar-wrap">
                        <img
                            src="${me.photo}"
                            class="profile-avatar"
                            id="perfil-foto"
                            alt="${me.name}"
                        />

                        <div class="profile-avatar-edit" onclick="toast('Upload de foto em breve!','ti-camera')">
                            <i class="ti ti-camera"></i>
                        </div>
                    </div>

                    <div style="text-align:center;margin-top:12px;">
                        <p style="font-size:15px;font-weight:600;color:var(--text);">
                            ${me.name}
                        </p>

                        <p style="font-size:11px;color:var(--text-dim);">
                            ${me.email}
                        </p>
                    </div>

                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-input" id="input-nome" value="${me.name}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Telefone</label>
                        <input type="text" class="form-input" id="input-tel" value="${me.telephone}" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-input" id="input-email" value="${me.email}" />
                </div>

                <div style="border-top:1px solid var(--border);margin:20px 0;padding-top:20px;">
                    <p style="font-size:12px;font-weight:500;color:var(--text);margin-bottom:14px;">
                        <i class="ti ti-lock" style="color:var(--gold-dark);margin-right:4px;"></i>
                        Alterar Senha
                    </p>
                    <div class="form-grid">
                        <button class="btn btn-senha" id="btn-alterar-senha">
                            Alterar Senha
                        </button>
                        <button class="btn btn-delet" id="btn-deletar-conta">
                            Deletar Conta
                        </button>
                    </div>
                </div>

                <div id="form-alterar-senha" style="display:none;border-top:1px solid var(--border);margin:20px 0;padding-top:20px;">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">
                                Senha atual
                            </label>

                            <div class="password-wrapper">
                                <input
                                    type="password"
                                    class="form-input"
                                    id="senha-atual"
                                    placeholder="Senha atual"
                                />

                                <button
                                    type="button"
                                    id="btn-visualizar-senha-atual"
                                    class="password-toggle"
                                >
                                    <i class="ti ti-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                Nova senha
                            </label>

                            <div class="password-wrapper">
                                <input
                                    type="password"
                                    class="form-input"
                                    id="nova-senha"
                                    placeholder="Nova senha"
                                />

                                <button
                                    type="button"
                                    id="btn-visualizar-senha"
                                    class="password-toggle"
                                >
                                    <i class="ti ti-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-gold" id="btn-salvar" style="width:100%;justify-content:center;">
                    <i class="ti ti-device-floppy"></i> Salvar Alterações
                </button>
            </div>

            <!-- Resumo -->
            <div class="gap-y perfil-resumo">
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
            </div>

        </div>
        `;

    function formatarTelefone(valor) {
        let input = valor.replace(/\D/g, '').slice(0, 11);

        if (input.length > 2) {
            input = input.slice(0, 2) + ' ' + input.slice(2);
        }

        if (input.length > 8) {
            input = input.slice(0, 8) + '-' + input.slice(8);
        }

        return input;
    }

    const inputTelefone = document.getElementById('input-tel');

    inputTelefone.value = formatarTelefone(me.telephone ?? '');

    inputTelefone.addEventListener('input', (event) => {
        event.target.value = formatarTelefone(event.target.value);
    });

    function ocultarSenha(botaoId, inputId) {
        const botao = document.getElementById(botaoId);
        const input = document.getElementById(inputId);

        if (!botao || !input) return;

        const icone = botao.querySelector('i');

        input.type = 'password';
        icone.classList.add('ti-eye');
        icone.classList.remove('ti-eye-off');
    }

    function configurarToggleSenha(botaoId, inputId) {
        const botao = document.getElementById(botaoId);
        const input = document.getElementById(inputId);

        if (!botao || !input) return;

        botao.addEventListener('click', () => {
            const icone = botao.querySelector('i');
            const estaOculta = input.type === 'password';

            input.type = estaOculta ? 'text' : 'password';

            icone.classList.toggle('ti-eye', !estaOculta);
            icone.classList.toggle('ti-eye-off', estaOculta);
        });
    }

    configurarToggleSenha('btn-visualizar-senha-atual', 'senha-atual');
    configurarToggleSenha('btn-visualizar-senha', 'nova-senha');
    configurarToggleSenha('btn-visualizar-senha-delete','senha-delete');

    document.getElementById('btn-alterar-senha')?.addEventListener('click', () => {
        const formSenha = document.getElementById('form-alterar-senha');

        formSenha.style.display =
            formSenha.style.display === 'none' ? 'block' : 'none';

        ocultarSenha('btn-visualizar-senha-atual', 'senha-atual');
        ocultarSenha('btn-visualizar-senha', 'nova-senha');

        if (formSenha.style.display === 'block') {
            document.getElementById('senha-atual').value = '';
            document.getElementById('nova-senha').value = '';

            document.getElementById('senha-atual').focus();
        }
    });

    const modalDeletar = document.getElementById('modal-deletar');

    function abrirModalDeletar() {
        modalDeletar.classList.add('is-open');

        buttonsToDelete.style.display = 'block';
        senhaToDelete.style.display = 'none';

        document.getElementById('senha-delete').value = '';
    }

    function fecharModalDeletar() {
        modalDeletar.classList.remove('is-open');

        buttonsToDelete.style.display = 'block';
        senhaToDelete.style.display = 'none';

        document.getElementById('senha-delete').value = '';
    }

    document
        .getElementById('btn-cancelar-delete')
        ?.addEventListener('click', fecharModalDeletar);
    document
        .getElementById('btn-deletar-conta')
        ?.addEventListener('click', abrirModalDeletar);

    document
        .getElementById('btn-cancelar-delete')
        ?.addEventListener('click', fecharModalDeletar);

    modalDeletar?.addEventListener('click', (event) => {
        if (event.target === modalDeletar) {
            fecharModalDeletar();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalDeletar?.classList.contains('is-open')) {
            fecharModalDeletar();
        }
    });

    const buttonsToDelete = document.querySelector('.buttonsToDelete');
    const senhaToDelete = document.querySelector('.senhaToDelete');

    const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');
    const btnCancelarDeleteSenha = document.getElementById('btn-cancelar-delete-senha');
    btnConfirmarDelete?.addEventListener('click', () => {
        buttonsToDelete.style.display = 'none';
        senhaToDelete.style.display = 'block';

        document.getElementById('senha-delete').value = '';
        document.getElementById('senha-delete').focus();
    });

    btnCancelarDeleteSenha?.addEventListener(
        'click',
        fecharModalDeletar
    );

    document.getElementById('btn-salvar')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-salvar');

        const nome = document.getElementById('input-nome').value;
        const email = document.getElementById('input-email').value;
        const telephone = document
            .getElementById('input-tel')
            .value
            .replace(/\D/g, '');

        const currentPassword = document.getElementById('senha-atual').value;
        const newPassword = document.getElementById('nova-senha').value;

        btn.disabled = true;
        btn.innerHTML = `<i class="ti ti-loader-2"></i> Salvando...`;

        const updated = await update({
            name: nome,
            email: email,
            telephone: telephone,
            currentPassword: currentPassword,
            password: newPassword
        });

        btn.disabled = false;
        btn.innerHTML = `<i class="ti ti-device-floppy"></i> Salvar Alterações`;

        if (updated.code === 200) {
            toast(updated.message, 'ti-check');
        } else {
            toast(updated.message ?? 'Erro ao atualizar perfil.', 'ti-alert-triangle');
        }
    });
}