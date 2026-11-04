import { mostrarFeedback, mostrarRespostaAPI } from "../../../_common/script/Feedback.js";
import Services from '../../../_common/classes/Services.js';

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
}

function respostaOk(resposta) {
    return resposta?.code === 200 || resposta?.code === 201;
}

function formatPrice(value) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '';
}

export async function renderServicos(c) {
    const servicos = new Services();
    let listOfServices = [];
    let editingService = null;

    c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;" class="fade-in">
        <div>
            <h1 style="font-size:22px;font-weight:500;">Catálogo de <em>Serviços</em></h1>
            <p id="serv-count" style="font-size:12px;color:var(--text-dim);margin-top:3px;"></p>
        </div>
        <button class="btn btn-gold" id="btn-novo-serv"><i class="ti ti-plus"></i> Novo Serviço</button>
    </div>
    <div class="service-grid fade-in" id="service-grid"></div>

    <style>
        .serv-overlay {
            position: fixed; inset: 0; z-index: 999999;
            display: none; align-items: center; justify-content: center;
            background: rgba(0, 0, 0, 0.8);
        }
        .serv-overlay.is-open { display: flex; }
        .serv-modal {
            width: min(92vw, 480px); max-height: 90vh; overflow: auto;
            padding: 24px; background: #1a1a1a;
            border: 1px solid #444; border-radius: 12px;
        }
        .serv-modal-title { margin: 0 0 16px; font-size: 16px; font-weight: 600; color: var(--text); }
        .serv-modal-text { font-size: 13px; color: var(--text-dim); line-height: 1.5; margin-bottom: 18px; }
        .serv-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .serv-field label { font-size: 12px; color: var(--text-dim); }
        .serv-field input, .serv-field textarea {
            padding: 10px 12px; border-radius: 10px;
            border: 1px solid var(--border);
            background: rgba(255,255,255,0.04);
            color: var(--text); font-family: inherit; font-size: 13px;
        }
        .serv-field textarea { min-height: 90px; resize: vertical; }
        .serv-row { display: flex; gap: 10px; }
        .serv-row .serv-field { flex: 1; }
        .serv-error { display: none; margin-bottom: 12px; font-size: 12px; color: #f87171; }
        .serv-actions { display: flex; gap: 10px; }
        .serv-actions button {
            flex: 1; padding: 10px; border-radius: 10px; cursor: pointer;
            font-weight: 600; border: 1px solid var(--border);
            background: transparent; color: var(--text); transition: all 0.2s ease;
        }
        .serv-actions .serv-btn-cancel:hover { border-color: var(--gold); color: var(--gold); }
        .serv-actions .serv-btn-save { background: var(--gold); color: #171717; border-color: var(--gold); }
        .serv-actions .serv-btn-danger { background: #e5484d; color: #fff; border-color: #e5484d; }
        .serv-actions button:disabled { opacity: 0.6; cursor: not-allowed; }
    </style>

    <!-- Modal: criar / editar -->
    <div class="serv-overlay" id="serv-form-overlay">
        <form class="serv-modal" id="serv-form" novalidate>
            <h2 class="serv-modal-title" id="serv-form-title">Novo serviço</h2>

            <div class="serv-field">
                <label for="serv-name">Nome</label>
                <input type="text" id="serv-name" maxlength="100" />
            </div>

            <div class="serv-field">
                <label for="serv-description">Descrição</label>
                <textarea id="serv-description"></textarea>
            </div>

            <div class="serv-row">
                <div class="serv-field">
                    <label for="serv-price">Preço (R$)</label>
                    <input type="number" id="serv-price" min="0" step="0.01" />
                </div>
                <div class="serv-field">
                    <label for="serv-duration">Duração (minutos)</label>
                    <input type="number" id="serv-duration" min="1" step="1" />
                </div>
            </div>

            <div class="serv-error" id="serv-form-error"></div>

            <div class="serv-actions">
                <button type="button" class="serv-btn-cancel" id="serv-form-cancel">Cancelar</button>
                <button type="submit" class="serv-btn-save" id="serv-form-save">Salvar</button>
            </div>
        </form>
    </div>

    <!-- Modal: confirmar exclusão -->
    <div class="serv-overlay" id="serv-delete-overlay">
        <div class="serv-modal">
            <h2 class="serv-modal-title">Excluir serviço</h2>
            <p class="serv-modal-text" id="serv-delete-text"></p>
            <div class="serv-error" id="serv-delete-error"></div>
            <div class="serv-actions">
                <button type="button" class="serv-btn-cancel" id="serv-delete-cancel">Cancelar</button>
                <button type="button" class="serv-btn-danger" id="serv-delete-confirm">Sim, excluir</button>
            </div>
        </div>
    </div>`;

    const grid = c.querySelector('#service-grid');
    const count = c.querySelector('#serv-count');

    const formOverlay = c.querySelector('#serv-form-overlay');
    const form = c.querySelector('#serv-form');
    const formTitle = c.querySelector('#serv-form-title');
    const formError = c.querySelector('#serv-form-error');
    const formSave = c.querySelector('#serv-form-save');
    const nameInput = c.querySelector('#serv-name');
    const descInput = c.querySelector('#serv-description');
    const priceInput = c.querySelector('#serv-price');
    const durationInput = c.querySelector('#serv-duration');

    const deleteOverlay = c.querySelector('#serv-delete-overlay');
    const deleteText = c.querySelector('#serv-delete-text');
    const deleteError = c.querySelector('#serv-delete-error');
    const deleteConfirm = c.querySelector('#serv-delete-confirm');
    let deletingService = null;

    function showError(el, message) {
        el.textContent = message;
        el.style.display = 'block';
    }

    function hideError(el) {
        el.textContent = '';
        el.style.display = 'none';
    }

    // -------------------------
    // CARREGAR / RENDERIZAR
    // -------------------------
    async function loadServices() {
        try {
            const res = await servicos.listAll();
            listOfServices = res?.data ?? [];
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            listOfServices = [];
            mostrarFeedback('Não foi possível carregar os serviços.', 'error');
        }
        renderGrid();
    }

    function renderGrid() {
        count.textContent = `${listOfServices.length} serviços ativos`;
        grid.innerHTML = '';

        if (listOfServices.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-dim);">Nenhum serviço cadastrado.</p>';
            return;
        }

        listOfServices.forEach(s => {
            const div = document.createElement('div');
            div.className = 'service-card';
            div.innerHTML = `
            <p class="service-name">${escapeHTML(s.name)}</p>
            <p class="service-desc">${escapeHTML(s.description)}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                <span style="font-size:13px;color:var(--text-dim);"><i class="ti ti-clock"></i> ${escapeHTML(s.duration_minutes)} min</span>
                <span class="service-price">${escapeHTML(formatPrice(s.price))}</span>
            </div>
            <div style="display:flex;gap:6px;margin-top:10px;">
                <button class="btn btn-ghost btn-sm" style="flex:1;" data-edit-serv="${escapeHTML(s.id)}"><i class="ti ti-edit"></i> Editar</button>
                <button class="btn btn-danger btn-sm" data-del-serv="${escapeHTML(s.id)}"><i class="ti ti-trash"></i></button>
            </div>`;
            grid.appendChild(div);
        });
    }

    // -------------------------
    // MODAL CRIAR / EDITAR
    // -------------------------
    function openFormModal(service = null) {
        editingService = service;
        hideError(formError);

        formTitle.textContent = service ? 'Editar serviço' : 'Novo serviço';
        nameInput.value = service?.name ?? '';
        descInput.value = service?.description ?? '';
        priceInput.value = service?.price ?? '';
        durationInput.value = service?.duration_minutes ?? '';

        formOverlay.classList.add('is-open');
        nameInput.focus();
    }

    function closeFormModal() {
        formOverlay.classList.remove('is-open');
        editingService = null;
        formSave.disabled = false;
        formSave.textContent = 'Salvar';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError(formError);

        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const price = Number(priceInput.value);
        const duration = Number(durationInput.value);

        if (!name) {
            showError(formError, 'O nome é obrigatório.');
            nameInput.focus();
            return;
        }
        if (!description) {
            showError(formError, 'A descrição é obrigatória.');
            descInput.focus();
            return;
        }
        if (priceInput.value === '' || !Number.isFinite(price) || price < 0) {
            showError(formError, 'Informe um preço válido.');
            priceInput.focus();
            return;
        }
        if (!Number.isInteger(duration) || duration <= 0) {
            showError(formError, 'Informe a duração em minutos (número inteiro maior que zero).');
            durationInput.focus();
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('durationMinutes', duration);
        formData.append('active', 1);

        formSave.disabled = true;
        formSave.textContent = 'Salvando...';

        // guarda antes de fechar o modal (closeFormModal zera editingService)
        const isEditing = Boolean(editingService);
        const serviceId = editingService?.id;

        try {
            const resposta = isEditing
                ? await servicos.update(serviceId, formData)
                : await servicos.create(formData);

            console.log('Resposta salvar serviço:', resposta);

            if (!respostaOk(resposta)) {
                showError(formError, resposta?.message || 'Não foi possível salvar o serviço.');
                formSave.disabled = false;
                formSave.textContent = 'Salvar';
                return;
            }

            closeFormModal();
            mostrarFeedback(isEditing ? 'Serviço atualizado com sucesso.' : 'Serviço criado com sucesso.', 'success');
            await loadServices();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            showError(formError, 'Não foi possível salvar o serviço.');
            formSave.disabled = false;
            formSave.textContent = 'Salvar';
        }
    });

    c.querySelector('#serv-form-cancel').addEventListener('click', closeFormModal);

    // -------------------------
    // MODAL EXCLUIR
    // -------------------------
    function openDeleteModal(service) {
        deletingService = service;
        hideError(deleteError);
        deleteText.textContent = `Tem certeza que deseja excluir o serviço "${service.name}"?`;
        deleteOverlay.classList.add('is-open');
    }

    function closeDeleteModal() {
        deleteOverlay.classList.remove('is-open');
        deletingService = null;
        deleteConfirm.disabled = false;
        deleteConfirm.textContent = 'Sim, excluir';
    }

    deleteConfirm.addEventListener('click', async () => {
        if (!deletingService) return;

        hideError(deleteError);
        deleteConfirm.disabled = true;
        deleteConfirm.textContent = 'Excluindo...';

        try {
            const resposta = await servicos.softDelete(deletingService.id);
            console.log('Resposta softDelete serviço:', resposta);

            if (respostaOk(resposta)) {
                closeDeleteModal();
                mostrarFeedback('Serviço excluído com sucesso.', 'success');
                await loadServices();
                return;
            }

            if (resposta?.code === 404) {
                // não existe mais no backend: já estava excluído
                closeDeleteModal();
                mostrarFeedback('Esse serviço já foi excluído.', 'warning');
                await loadServices();
                return;
            }

            mostrarRespostaAPI(resposta);
            deleteConfirm.disabled = false;
            deleteConfirm.textContent = 'Sim, excluir';
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            showError(deleteError, 'Não foi possível excluir o serviço.');
            deleteConfirm.disabled = false;
            deleteConfirm.textContent = 'Sim, excluir';
        }
    });

    c.querySelector('#serv-delete-cancel').addEventListener('click', closeDeleteModal);

    // Fechar clicando fora
    formOverlay.addEventListener('click', (e) => { if (e.target === formOverlay) closeFormModal(); });
    deleteOverlay.addEventListener('click', (e) => { if (e.target === deleteOverlay) closeDeleteModal(); });

    // -------------------------
    // EVENTOS
    // -------------------------
    grid.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit-serv]');
        const delBtn = e.target.closest('[data-del-serv]');

        if (editBtn) {
            const sv = listOfServices.find(x => Number(x.id) === Number(editBtn.dataset.editServ));
            if (sv) openFormModal(sv);
        }

        if (delBtn) {
            const sv = listOfServices.find(x => Number(x.id) === Number(delBtn.dataset.delServ));
            if (sv) openDeleteModal(sv);
        }
    });

    c.querySelector('#btn-novo-serv').addEventListener('click', () => openFormModal());

    await loadServices();
}