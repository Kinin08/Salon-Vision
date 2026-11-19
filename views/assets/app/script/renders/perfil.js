import { mostrarFeedback } from '../../../_common/script/Feedback.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';
import { meusAgendamentos, nextAgendamentos } from '../../../_common/Api/appointmants.js';
import { userMe, update, uploadPhoto, deletarUsuario } from './../../../_common/Api/user.js';

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
}

// Segunda 00:00 até domingo 23:59:59 da semana atual
function intervaloDaSemana() {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));

    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 7);
    fim.setMilliseconds(-1);

    return { inicio, fim };
}

function filtrarSemana(lista) {
    const { inicio, fim } = intervaloDaSemana();

    return (Array.isArray(lista) ? lista : [])
        .map(a => ({ ...a, _data: new Date(String(a.date_time).replace(' ', 'T')) }))
        .filter(a => !Number.isNaN(a._data.getTime()))
        .filter(a => a._data >= inicio && a._data <= fim)
        .filter(a => a.status !== 'canceled')
        .sort((a, b) => a._data - b._data);
}

function renderListaAgendamentos(agendamentos) {
    if (!agendamentos.length) {
        return `<p style="font-size:12px;color:var(--text-dim);text-align:center;padding:12px 0;">
                    Nenhum agendamento esta semana.
                </p>`;
    }

    return agendamentos.map(a => {
        const dia = a._data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        const hora = a._data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return `
        <div class="agenda-item">
            <div class="agenda-quando">
                <span class="agenda-dia">${escapeHTML(dia)}</span>
                <span class="agenda-hora">${escapeHTML(hora)}</span>
            </div>
            <div class="agenda-info">
                <span class="agenda-cliente">${escapeHTML(a.service_name)}</span>
                <span class="agenda-servico">${escapeHTML(a.employee_name ?? '')}</span>
            </div>
        </div>`;
    }).join('');
}

export async function renderPerfil(c) {

    const me = await userMe();
    const proximo = await nextAgendamentos();
    const agendamentos = await meusAgendamentos();
    const agendamentosSemana = filtrarSemana(agendamentos);

    c.innerHTML = `
        <style>
        .agenda-total {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 14px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--border);
        }
        .agenda-total-num { font-size: 34px; font-weight: 600; color: var(--gold); line-height: 1; }
        .agenda-total-label { font-size: 12px; color: var(--text-dim); }
        .agenda-lista { display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto; }
        .agenda-item {
            display: flex; gap: 12px; align-items: center;
            padding: 8px 10px; border-radius: 8px;
            background: rgba(255, 255, 255, 0.04);
        }
        .agenda-quando { display: flex; flex-direction: column; min-width: 64px; font-size: 11px; }
        .agenda-dia { color: var(--text-dim); text-transform: capitalize; }
        .agenda-hora { color: var(--gold); font-weight: 600; font-size: 13px; }
        .agenda-info { display: flex; flex-direction: column; min-width: 0; }
        .agenda-cliente {
            font-size: 13px; font-weight: 500; color: var(--text);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .agenda-servico {
            font-size: 11px; color: var(--text-dim);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
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

        /* Botão alterar senha */
        .modal-actions .btn-senha,
        #btn-alterar-senha,
        #btn-cancelar-delete-senha {
            background: var(--gold);
            color: #000;
            border: 1px solid var(--gold);
        }
        
        /* Botão excluir conta */
        .modal-actions .btn-delet,
        #btn-deletar-conta,
        #btn-excluir-conta {
            background: #e5484d;
            color: #fff;
            border: 1px solid #e5484d;
        }
        
        /* Efeito ao passar o mouse */
        #btn-alterar-senha:hover,
        #btn-cancelar-delete-senha:hover {
            background: var(--gold-dark);
        }
        
        #btn-deletar-conta:hover,
        #btn-excluir-conta:hover {
            background: #c9363b;
        }
        
        /* Transição */
        #btn-alterar-senha,
        #btn-deletar-conta,
        .modal-actions .btn {
            transition: all 0.2s ease;
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
        .form-foto-perfil {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
        }

        .form-foto-perfil .profile-avatar-wrap {
            position: relative;
        }

        .form-foto-perfil .profile-avatar-edit {
            cursor: pointer;
        }

        .form-foto-perfil .nome-perfil {
            font-size: 15px;
            font-weight: 600;
            color: var(--text);
        }

        .form-foto-perfil .email-perfil {
            font-size: 11px;
            color: var(--text-dim);
        }

        #btn-salvar-foto {
            width: 100%;
            justify-content: center;
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
                
                <!-- Formulário exclusivo da foto -->
                <form id="form-foto-perfil" class="form-foto-perfil">
                    <div class="profile-avatar-wrap">
                        <img
                            src="${me.photo || FOTO_PADRAO}"
                            onerror="this.onerror=null;this.src='${FOTO_PADRAO}'"
                            class="profile-avatar"
                            id="perfil-foto"
                            alt="Foto de perfil"
                        />

                        <label
                            for="input-foto"
                            class="profile-avatar-edit"
                            title="Alterar foto"
                        >
                            <i class="ti ti-camera"></i>
                        </label>
                    </div>
                
                    <input
                        type="file"
                        id="input-foto"
                        name="photo"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                    />
                </form>

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
<div class="gap-y perfil-resumo">
    <div class="panel fade-in delay-1">
        <div class="panel-header" style="margin-bottom:12px;">
            <h1 class="panel-title">Agendamentos <em>da semana</em></h1>
        </div>

        <div class="agenda-total">
            <span class="agenda-total-num">${agendamentosSemana.length}</span>
            <span class="agenda-total-label">
                ${agendamentosSemana.length === 1 ? 'agendamento' : 'agendamentos'} esta semana
            </span>
        </div>

        <div class="agenda-lista">
            ${renderListaAgendamentos(agendamentosSemana)}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">
            <span style="font-size:12px;color:var(--text-dim);">Próximo agendamento</span>
            <span style="font-size:13px;font-weight:600;color:var(--gold);">${proximo && !Array.isArray(proximo)
            ? new Date(proximo.date_time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
            : 'Nenhum'}</span>
        </div>
    </div>
</div>

        </div>
        `;


    const formularioFoto = c.querySelector('#form-foto-perfil');
    const inputFoto = c.querySelector('#input-foto');
    const imagemPerfil = c.querySelector('#perfil-foto');

    // Foto escolhida, mas ainda não enviada (vai junto com "Salvar Alterações")
    let fotoSelecionada = null;

    // Não deixa o form recarregar a página
    formularioFoto?.addEventListener('submit', (event) => event.preventDefault());

    inputFoto?.addEventListener('change', () => {
        const arquivo = inputFoto.files[0];
        if (!arquivo) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
            mostrarFeedback('Formato de imagem não permitido.', 'error');
            inputFoto.value = '';
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            mostrarFeedback('A imagem deve ter no máximo 5 MB.', 'error');
            inputFoto.value = '';
            return;
        }

        fotoSelecionada = arquivo;
        imagemPerfil.src = URL.createObjectURL(arquivo); // preview
    });
    async function enviarFoto(arquivo) {
        try {
            const resultado = await uploadPhoto(arquivo);

            console.log("Resposta completa:", resultado);

            if (!resultado) {
                throw new Error("A API não retornou nenhuma resposta.");
            }

            if (resultado.code !== 200 || !resultado.data?.photo) {
                throw new Error(
                    resultado.message || "Erro ao atualizar a foto."
                );
            }

            return resultado.data.photo;

        } catch (erro) {
            console.error("Erro detalhado no upload:", erro);
            throw erro;
        }
    }


    // ============================================================
    // BLOCO 2
    // Substitua o handler do botão #btn-salvar (o último do arquivo) por este.
    // ============================================================

    document.getElementById('btn-salvar')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-salvar');
        const nome = document.getElementById('input-nome').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const telephone = document.getElementById('input-tel').value.replace(/\D/g, '');
        const currentPassword = document.getElementById('senha-atual').value;
        const newPassword = document.getElementById('nova-senha').value;

        btn.disabled = true;
        btn.innerHTML = `<i class="ti ti-loader-2"></i> Salvando...`;

        try {
            const updated = await update({
                name: nome,
                email: email,
                telephone: telephone,
                currentPassword: currentPassword,
                password: newPassword
            });

            if (updated?.code !== 200) {
                mostrarFeedback(updated?.message ?? 'Erro ao atualizar perfil.', 'error');
                return;
            }

            if (fotoSelecionada) {
                try {
                    const photoUrl = await enviarFoto(fotoSelecionada);
                    const novaSrc = photoUrl + '?t=' + Date.now();
                    me.photo = photoUrl;
                    imagemPerfil.src = novaSrc;
                    document.getElementById('user-photo')?.setAttribute('src', novaSrc);
                    document.getElementById('user-avatar')?.setAttribute('src', novaSrc);
                    fotoSelecionada = null;
                    inputFoto.value = '';
                } catch (erroFoto) {
                    mostrarFeedback(erroFoto.message || 'Os dados foram salvos, mas a foto não foi atualizada.', 'error');
                    return;
                }
            }

            mostrarFeedback(updated.message || 'Perfil atualizado com sucesso.', 'success');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            mostrarFeedback('Não foi possível atualizar o perfil.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i class="ti ti-device-floppy"></i> Salvar Alterações`;
        }
    });

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
    configurarToggleSenha('btn-visualizar-senha-delete', 'senha-delete');

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


    const buttonsToDelete = document.querySelector('.buttonsToDelete');
    const senhaToDelete = document.querySelector('.senhaToDelete');

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
    document.getElementById('btn-excluir-conta')
        ?.addEventListener('click', async (event) => {
            const botao = event.currentTarget;
            const senha = document.getElementById('senha-delete').value;

            if (!senha) {
                mostrarFeedback('Digite sua senha para excluir a conta.', 'error');
                return;
            }

            botao.disabled = true;

            try {

                const resultado = await deletarUsuario(me.id, senha);

                if (resultado?.code === 200) {
                    localStorage.removeItem('token');
                    window.location.href = '/Salon-Vision/';
                } else {
                    mostrarFeedback(resultado?.message || 'Erro ao excluir conta.', 'error');
                }
            } catch (erro) {
                console.error(erro);
                mostrarFeedback('Erro ao excluir conta.', 'error');
            } finally {
                botao.disabled = false;
            }
        });
}