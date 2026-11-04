import { mostrarFeedback, mostrarRespostaAPI } from "../../../_common/script/Feedback.js";
import Faqs from "../../../_common/classes/Faqs.js";
import FaqCategories from "../../../_common/classes/FaqsCategory.js";

export async function renderFaqs(c) {

    c.innerHTML = `
            <div class="panel fade-in">

                <div class="panel-header" style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:12px;
                    flex-wrap:wrap;
                ">
                    <h1 class="panel-title">
                        Últimas <em>perguntas</em>
                    </h1>

                    <button id="faq-add" style="
                        padding:10px 16px;
                        border-radius:10px;
                        border:none;
                        background:var(--gold);
                        color:#171717;
                        font-weight:600;
                        cursor:pointer;
                        display:flex;
                        align-items:center;
                        gap:7px;
                    ">
                        <i class="ti ti-plus"></i>
                        Adicionar FAQ
                    </button>
                    <button id="faq-manage-categories" type="button" style="
        padding:10px 16px;border-radius:10px;
        border:1px solid var(--border);background:transparent;color:var(--text);
        font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px;
                ">
                    <i class="ti ti-settings"></i>
                    Gerenciar Categorias
                </button>
                </div>

                <div style="
                    display:flex;
                    gap:8px;
                    align-items:center;
                    margin-bottom:12px;
                ">
                    <input
                        id="faq-search"
                        placeholder="Pesquisar por categoria ou pergunta..."
                        style="
                            flex:1;
                            padding:10px 12px;
                            border-radius:10px;
                            border:1px solid var(--border);
                            background:rgba(255,255,255,0.02);
                            color:var(--text);
                        "
                    />
                </div>

                <div
                    id="faq-list"
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:14px;
                    "
                ></div>

            </div>
            <style>
            .faq-inline { display: flex; gap: 8px; }
    .faq-inline select,
    .faq-inline input { flex: 1; min-width: 0; }
    .faq-btn-icon {
        padding: 0 14px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: rgba(255, 204, 127, 0.10);
        color: var(--gold);
        cursor: pointer;
        font-weight: 600;
        white-space: nowrap;
    }
    .faq-btn-icon:disabled { opacity: 0.6; cursor: not-allowed; }
    .faq-cat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 10px;
        margin-bottom: 8px;
        font-size: 13px;
        color: var(--text);
    }
    .faq-cat-count { font-size: 11px; color: var(--text-dim); }
        .faq-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
        }
        .faq-overlay.is-open { display: flex; }

        .faq-modal {
            width: min(92vw, 480px);
            max-height: 90vh;
            overflow: auto;
            padding: 24px;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 12px;
        }
        .faq-modal-title {
            margin: 0 0 16px;
            font-size: 16px;
            font-weight: 600;
            color: var(--text);
        }
        .faq-modal-text {
            font-size: 13px;
            color: var(--text-dim);
            line-height: 1.5;
            margin-bottom: 18px;
        }
        .faq-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 14px;
        }
        .faq-field label {
            font-size: 12px;
            color: var(--text-dim);
        }
        .faq-field select,
        .faq-field input,
        .faq-field textarea {
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.04);
            color: var(--text);
            font-family: inherit;
            font-size: 13px;
        }
        .faq-field select option { background: #1a1a1a; color: #fff; }
        .faq-field textarea { min-height: 110px; resize: vertical; }

        .faq-error {
            display: none;
            margin-bottom: 12px;
            font-size: 12px;
            color: #f87171;
        }
        .faq-actions { display: flex; gap: 10px; }
        .faq-actions button {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text);
            transition: all 0.2s ease;
        }
        .faq-actions .faq-btn-cancel:hover { border-color: var(--gold); color: var(--gold); }
        .faq-actions .faq-btn-save { background: var(--gold); color: #171717; border-color: var(--gold); }
        .faq-actions .faq-btn-danger { background: #e5484d; color: #fff; border-color: #e5484d; }
        .faq-actions button:disabled { opacity: 0.6; cursor: not-allowed; }
    </style>

    <!-- Modal: adicionar / editar -->
    <div class="faq-overlay" id="faq-form-overlay">
        <form class="faq-modal" id="faq-form" novalidate>
            <h2 class="faq-modal-title" id="faq-form-title">Adicionar FAQ</h2>

    <div class="faq-field">
        <label for="faq-category-select">Categoria</label>
        <div class="faq-inline">
            <select id="faq-category-select"></select>
            <button type="button" class="faq-btn-icon" id="faq-new-category-toggle" title="Nova categoria">
                <i class="ti ti-plus"></i>
            </button>
        </div>
    </div>

    <div class="faq-field" id="faq-new-category-wrap" style="display:none;">
        <label for="faq-new-category-name">Nova categoria</label>
        <div class="faq-inline">
            <input type="text" id="faq-new-category-name" maxlength="100" placeholder="Nome da categoria" />
            <button type="button" class="faq-btn-icon" id="faq-new-category-save">Criar</button>
        </div>
    </div>

            <div class="faq-field">
                <label for="faq-question">Pergunta</label>
                <input type="text" id="faq-question" maxlength="255" />
            </div>

            <div class="faq-field">
                <label for="faq-answer">Resposta</label>
                <textarea id="faq-answer"></textarea>
            </div>

            <div class="faq-error" id="faq-form-error"></div>

            <div class="faq-actions">
                <button type="button" class="faq-btn-cancel" id="faq-form-cancel">Cancelar</button>
                <button type="submit" class="faq-btn-save" id="faq-form-save">Salvar</button>
            </div>
        </form>
    </div>
    <!-- Modal: gerenciar categorias -->
    <div class="faq-overlay" id="faq-cat-overlay">
        <div class="faq-modal">
            <h2 class="faq-modal-title">Gerenciar categorias</h2>

            <div class="faq-inline" style="margin-bottom:14px;">
                <input type="text" id="faq-cat-name" maxlength="100" placeholder="Nova categoria..."
                    style="padding:10px 12px;border-radius:10px;border:1px solid var(--border);
                        background:rgba(255,255,255,0.04);color:var(--text);" />
                <button type="button" class="faq-btn-icon" id="faq-cat-add">Adicionar</button>
            </div>

            <div class="faq-error" id="faq-cat-error"></div>
            <div id="faq-cat-list"></div>

            <div class="faq-actions" style="margin-top:16px;">
                <button type="button" class="faq-btn-cancel" id="faq-cat-close">Fechar</button>
            </div>
        </div>
    </div>
    <!-- Modal: confirmar exclusão -->
    <div class="faq-overlay" id="faq-delete-overlay">
        <div class="faq-modal">
            <h2 class="faq-modal-title">Excluir pergunta</h2>
            <p class="faq-modal-text" id="faq-delete-text"></p>

            <div class="faq-error" id="faq-delete-error"></div>

            <div class="faq-actions">
                <button type="button" class="faq-btn-cancel" id="faq-delete-cancel">Cancelar</button>
                <button type="button" class="faq-btn-danger" id="faq-delete-confirm">Sim, excluir</button>
            </div>
        </div>
    </div>
        `;

    const list = c.querySelector('#faq-list');
    const searchInput = c.querySelector('#faq-search');
    const addButton = c.querySelector('#faq-add');

    let allFaqs = [];

    // -------------------------
    // PROTEGER HTML
    // -------------------------

    function escapeHTML(value) {

        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[char]);

    }
    function respostaOk(resposta) {
        return resposta?.code === 200 || resposta?.code === 201;
    }
    // -------------------------
    // REFERÊNCIAS DOS MODAIS
    // -------------------------
    const categoriesApi = new FaqCategories();
    let allCategories = []; // [{ id, name }]

    const newCatToggle = c.querySelector('#faq-new-category-toggle');
    const newCatWrap = c.querySelector('#faq-new-category-wrap');
    const newCatName = c.querySelector('#faq-new-category-name');
    const newCatSave = c.querySelector('#faq-new-category-save');

    const catOverlay = c.querySelector('#faq-cat-overlay');
    const catList = c.querySelector('#faq-cat-list');
    const catError = c.querySelector('#faq-cat-error');
    const catName = c.querySelector('#faq-cat-name');
    const catAdd = c.querySelector('#faq-cat-add');

    const formOverlay = c.querySelector('#faq-form-overlay');
    const form = c.querySelector('#faq-form');
    const formTitle = c.querySelector('#faq-form-title');
    const formError = c.querySelector('#faq-form-error');
    const formSave = c.querySelector('#faq-form-save');
    const categorySelect = c.querySelector('#faq-category-select');
    const questionInput = c.querySelector('#faq-question');
    const answerInput = c.querySelector('#faq-answer');

    const deleteOverlay = c.querySelector('#faq-delete-overlay');
    const deleteText = c.querySelector('#faq-delete-text');
    const deleteError = c.querySelector('#faq-delete-error');
    const deleteConfirm = c.querySelector('#faq-delete-confirm');

    let editingFaq = null;
    let deletingFaq = null;

    function showError(el, message) {
        el.textContent = message;
        el.style.display = 'block';
    }

    function hideError(el) {
        el.textContent = '';
        el.style.display = 'none';
    }

    // Categorias vêm das próprias FAQs carregadas
    async function loadCategories() {
        try {
            const res = await categoriesApi.listAll();
            allCategories = (res?.data ?? []).map(cat => ({
                id: cat.id,
                name: cat.name ?? cat.category_name ?? cat.title ?? `Categoria ${cat.id}`
            }));
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            allCategories = [];
        }
    }

    function fillCategorySelect(selectedId = '') {
        if (allCategories.length === 0) {
            categorySelect.innerHTML = '<option value="">Nenhuma categoria — crie uma</option>';
            return;
        }

        categorySelect.innerHTML = allCategories
            .map(cat => `<option value="${escapeHTML(cat.id)}">${escapeHTML(cat.name)}</option>`)
            .join('');

        if (selectedId !== '' && selectedId != null) {
            categorySelect.value = String(selectedId);
        }
    }

    async function createCategory(name) {
        const resposta = await categoriesApi.create({ name });
        if (!respostaOk(resposta)) {
            throw new Error(resposta?.message || 'Não foi possível criar a categoria.');
        }
        await loadCategories();

        // tenta achar a categoria recém-criada (pelo id retornado ou pelo nome)
        const newId = resposta?.data?.id;
        const created = allCategories.find(cat => String(cat.id) === String(newId))
            ?? allCategories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
        mostrarFeedback('Categoria criada com sucesso.', 'success');
        return created;
    }

    function categoryExists(name) {
        return allCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
    }
    // -------------------------
    // MODAL ADICIONAR / EDITAR
    // -------------------------

    function openFormModal(faq = null) {
        editingFaq = faq;
        hideError(formError);
        newCatWrap.style.display = 'none';
        newCatName.value = '';

        formTitle.textContent = faq ? 'Editar FAQ' : 'Adicionar FAQ';

        fillCategorySelect(faq ? (faq.faq_category_id ?? faq.faqCategoryId ?? '') : '');

        questionInput.value = faq?.question ?? '';
        answerInput.value = faq?.answer ?? '';

        formOverlay.classList.add('is-open');
        questionInput.focus();
    }

    function closeFormModal() {
        formOverlay.classList.remove('is-open');
        editingFaq = null;
        formSave.disabled = false;
        formSave.textContent = 'Salvar';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError(formError);

        const categoryId = Number(categorySelect.value);
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            showError(formError, 'Selecione uma categoria válida.');
            return;
        }

        if (!question) {
            showError(formError, 'A pergunta é obrigatória.');
            questionInput.focus();
            return;
        }

        if (!answer) {
            showError(formError, 'A resposta é obrigatória.');
            answerInput.focus();
            return;
        }

        const data = {
            faqsCategoryId: categoryId,
            question,
            answer
        };

        formSave.disabled = true;
        formSave.textContent = 'Salvando...';

        try {
            const faqs = new Faqs();
            const formData = new FormData();
            formData.append('faqsCategoryId', categoryId);
            formData.append('question', question);
            formData.append('answer', answer);
            formData.append('active', 1);

            const resposta = editingFaq
                ? await faqs.update(editingFaq.id, formData)
                : await faqs.create(formData);

            console.log('Resposta salvar FAQ:', resposta);
            console.log('Enviando:', data);

            if (!respostaOk(resposta)) {
                showError(formError, resposta?.message || 'Não foi possível salvar a pergunta.');
                formSave.disabled = false;
                formSave.textContent = 'Salvar';
                return;
            }

            const mensagem = editingFaq
                ? 'Pergunta atualizada com sucesso.'
                : 'Pergunta criada com sucesso.';

            closeFormModal();
            mostrarFeedback(mensagem, 'success');
            await loadFaqs();
        } catch (error) {
            console.error('Erro ao salvar FAQ:', error);
            showError(formError, 'Não foi possível salvar a pergunta.');
            formSave.disabled = false;
            formSave.textContent = 'Salvar';
        }
    });

    c.querySelector('#faq-form-cancel').addEventListener('click', closeFormModal);

    // -------------------------
    // MODAL EXCLUIR
    // -------------------------

    function openDeleteModal(faq) {
        deletingFaq = faq;
        hideError(deleteError);

        deleteText.textContent =
            `Tem certeza que deseja excluir a pergunta "${faq.question}"?`;

        deleteOverlay.classList.add('is-open');
    }

    function closeDeleteModal() {
        deleteOverlay.classList.remove('is-open');
        deletingFaq = null;
        deleteConfirm.disabled = false;
        deleteConfirm.textContent = 'Sim, excluir';
    }

    deleteConfirm.addEventListener('click', async () => {
        if (!deletingFaq) return;

        hideError(deleteError);
        deleteConfirm.disabled = true;
        deleteConfirm.textContent = 'Excluindo...';

        try {
            const faqs = new Faqs();
            const resposta = await faqs.softDelete(deletingFaq.id);
            console.log('Resposta softDelete FAQ:', resposta);

            if (!respostaOk(resposta)) {
                showError(deleteError, resposta?.message || 'Não foi possível excluir a pergunta.');
                deleteConfirm.disabled = false;
                deleteConfirm.textContent = 'Sim, excluir';
                return;
            }

            closeDeleteModal();
            await loadFaqs();
        } catch (error) {
            console.error('Erro ao excluir FAQ:', error);
            showError(deleteError, 'Não foi possível excluir a pergunta.');
            deleteConfirm.disabled = false;
            deleteConfirm.textContent = 'Sim, excluir';
        }
    });

    c.querySelector('#faq-delete-cancel').addEventListener('click', closeDeleteModal);

    // Fechar clicando fora do modal
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) closeFormModal();
    });

    deleteOverlay.addEventListener('click', (e) => {
        if (e.target === deleteOverlay) closeDeleteModal();
    });

    // Fechar com Esc
    function onEscape(e) {
        if (e.key !== 'Escape') return;
        if (formOverlay.classList.contains('is-open')) closeFormModal();
        if (deleteOverlay.classList.contains('is-open')) closeDeleteModal();
        if (catOverlay.classList.contains('is-open')) closeCategoriesModal();
    }

    document.addEventListener('keydown', onEscape);
    // -------------------------
    // RENDERIZAR LISTA
    // -------------------------

    function renderList(data) {

        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = `
                    <div style="padding:30px;text-align:center;color:var(--text-muted);">
                        <i class="ti ti-search" style="font-size:30px;color:var(--gold);"></i>
                        <p style="margin-top:10px;">Nenhuma pergunta encontrada.</p>
                    </div>
                `;
            return;
        }

        data.forEach(faq => {

            const item = document.createElement('div');

            item.innerHTML = `
                    <div style="
                        padding:18px;
                        border:1px solid var(--border);
                        border-radius:16px;
                        background:rgba(255,255,255,0.02);
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                        flex-wrap:wrap;
                    ">
                        <div style="display:flex;gap:12px;flex:1;min-width:200px;">

                            <div style="
                                width:44px;height:44px;flex-shrink:0;
                                border-radius:12px;
                                background:rgba(255,204,127,0.12);
                                display:flex;align-items:center;justify-content:center;
                                color:var(--gold);font-size:18px;
                            ">
                                <i class="ti ti-help-circle"></i>
                            </div>

                            <div style="flex:1;">
                                <div style="
                                    display:flex;justify-content:space-between;
                                    align-items:flex-start;gap:10px;flex-wrap:wrap;
                                ">
                                    <h3 style="margin:0;font-size:14px;font-weight:600;">
                                        ${escapeHTML(faq.question)}
                                    </h3>

                                    <span style="
                                        font-size:11px;color:var(--gold);
                                        background:rgba(255,204,127,0.15);
                                        border:1px solid var(--gold);
                                        padding:4px 8px;border-radius:8px;
                                    ">
                                        ${escapeHTML(faq.category_name || 'Sem categoria')}
                                    </span>
                                </div>

                                <p style="
                                    margin-top:6px;font-size:13px;
                                    color:var(--text-muted);line-height:1.6;
                                ">
                                    ${escapeHTML(faq.answer || 'Nenhuma resposta cadastrada.')}
                                </p>
                            </div>
                        </div>

                        <div style="display:flex;gap:8px;align-items:center;">
                            <button
                                data-action="edit"
                                data-id="${escapeHTML(faq.id)}"
                                title="Editar FAQ"
                                style="
                                    width:36px;height:36px;border-radius:9px;
                                    border:1px solid var(--border);
                                    background:rgba(255,204,127,0.10);
                                    color:var(--gold);cursor:pointer;font-size:16px;
                                "
                            >
                                <i class="ti ti-edit"></i>
                            </button>

                            <button
                                data-action="delete"
                                data-id="${escapeHTML(faq.id)}"
                                title="Excluir FAQ"
                                style="
                                    width:36px;height:36px;border-radius:9px;
                                    border:1px solid rgba(248,113,113,0.3);
                                    background:rgba(248,113,113,0.10);
                                    color:#f87171;cursor:pointer;font-size:16px;
                                "
                            >
                                <i class="ti ti-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

            list.appendChild(item);
        });
    }

    // -------------------------
    // CARREGAR FAQS
    // -------------------------

    async function loadFaqs() {

        try {
            const faqs = new Faqs();
            const responseData = await faqs.listFaqAndCategories();

            allFaqs = responseData.data ?? [];

            filterFaqs();
        } catch (error) {
            console.error('Erro ao carregar FAQs:', error);

            list.innerHTML = `
                    <div style="padding:30px;text-align:center;">
                        <p style="color:#f87171;">Não foi possível carregar as perguntas.</p>
                    </div>
                `;
        }
    }

    // -------------------------
    // PESQUISAR
    // -------------------------

    function filterFaqs() {

        const texto = searchInput.value.trim().toLowerCase();

        if (!texto) {
            renderList(allFaqs);
            return;
        }

        const filtradas = allFaqs.filter(faq => {
            const categoria = faq.category_name?.toLowerCase() ?? '';
            const pergunta = faq.question?.toLowerCase() ?? '';

            return categoria.includes(texto) || pergunta.includes(texto);
        });

        renderList(filtradas);
    }

    // -------------------------
    // EVENTOS
    // -------------------------
    newCatToggle.addEventListener('click', () => {
        const isHidden = newCatWrap.style.display === 'none';
        newCatWrap.style.display = isHidden ? '' : 'none';
        if (isHidden) newCatName.focus();
    });

    async function saveNewCategoryInline() {
        hideError(formError);
        const name = newCatName.value.trim();

        if (!name) {
            showError(formError, 'Informe o nome da categoria.');
            newCatName.focus();
            return;
        }
        if (categoryExists(name)) {
            showError(formError, 'Já existe uma categoria com esse nome.');
            return;
        }

        newCatSave.disabled = true;
        newCatSave.textContent = 'Criando...';

        try {
            const created = await createCategory(name);
            fillCategorySelect(created?.id);
            newCatName.value = '';
            newCatWrap.style.display = 'none';
        } catch (error) {
            showError(formError, error.message || 'Não foi possível criar a categoria.');
        } finally {
            newCatSave.disabled = false;
            newCatSave.textContent = 'Criar';
        }
    }

    newCatSave.addEventListener('click', saveNewCategoryInline);
    newCatName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // evita enviar o form da FAQ
            saveNewCategoryInline();
        }
    });
    function renderCategoryList() {
        if (allCategories.length === 0) {
            catList.innerHTML = `<p class="faq-modal-text">Nenhuma categoria cadastrada.</p>`;
            return;
        }

        catList.innerHTML = allCategories.map(cat => {
            const total = allFaqs.filter(
                f => String(f.faq_category_id ?? f.faqCategoryId) === String(cat.id)
            ).length;

            return `
                <div class="faq-cat-row">
                    <div>
                        <div>${escapeHTML(cat.name)}</div>
                        <div class="faq-cat-count">${total} pergunta(s)</div>
                    </div>
                    <button type="button" data-cat-delete="${escapeHTML(cat.id)}" title="Excluir categoria"
                        style="width:34px;height:34px;border-radius:9px;cursor:pointer;
                            border:1px solid rgba(248,113,113,0.3);
                            background:rgba(248,113,113,0.10);color:#f87171;">
                        <i class="ti ti-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    function openCategoriesModal() {
        hideError(catError);
        catName.value = '';
        renderCategoryList();
        catOverlay.classList.add('is-open');
        catName.focus();
    }

    async function closeCategoriesModal() {
        catOverlay.classList.remove('is-open');
        await loadFaqs()
    }

    async function addCategoryFromManager() {
        hideError(catError);
        const name = catName.value.trim();

        if (!name) return showError(catError, 'Informe o nome da categoria.');
        if (categoryExists(name)) return showError(catError, 'Já existe uma categoria com esse nome.');

        catAdd.disabled = true;
        try {
            await createCategory(name);
            catName.value = '';
            renderCategoryList();
        } catch (error) {
            showError(catError, error.message || 'Não foi possível criar a categoria.');
        } finally {
            catAdd.disabled = false;
        }
    }

    async function deleteCategory(id) {
        hideError(catError);

        const emUso = allFaqs.some(
            f => String(f.faq_category_id ?? f.faqCategoryId) === String(id)
        );
        if (emUso) {
            mostrarFeedback('Essa categoria possui perguntas. Mova ou exclua as perguntas antes.', 'warning');
            return;
        }

        try {
            const resposta = await categoriesApi.softDelete(id);

            if (respostaOk(resposta)) {
                mostrarFeedback('Categoria excluída com sucesso.', 'success');
            } else if (resposta?.code === 404) {
                // não encontrada no backend: já estava excluída
                mostrarFeedback('Essa categoria já foi excluída.', 'error');
            } else {
                mostrarRespostaAPI(resposta);
                return;
            }

            await loadCategories();
            renderCategoryList();
        } catch (error) {
            // caso a HttpClientBase lance exceção em 404
            if (error?.status === 404 || error?.code === 404) {
                mostrarFeedback('Essa categoria já foi excluída.', 'warning');
                await loadCategories();
                renderCategoryList();
                return;
            }
            console.error('Erro ao excluir categoria:', error);
            mostrarFeedback('Não foi possível excluir a categoria.', 'error');
        }
    }

    c.querySelector('#faq-manage-categories').addEventListener('click', openCategoriesModal);
    c.querySelector('#faq-cat-close').addEventListener('click', closeCategoriesModal);
    catAdd.addEventListener('click', addCategoryFromManager);
    catName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addCategoryFromManager();
    });

    catList.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat-delete]');
        if (btn) deleteCategory(btn.dataset.catDelete);
    });

    catOverlay.addEventListener('click', (e) => {
        if (e.target === catOverlay) closeCategoriesModal();
    });
    addButton.addEventListener('click', () => openFormModal());

    searchInput.addEventListener('input', filterFaqs);

    list.addEventListener('click', event => {

        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const faqId = Number(button.dataset.id);
        const faq = allFaqs.find(item => Number(item.id) === faqId);
        if (!faq) return;

        if (button.dataset.action === 'edit') {
            openFormModal(faq);
        } else if (button.dataset.action === 'delete') {
            openDeleteModal(faq);
        }
    });
    await loadCategories();
    await loadFaqs();
}