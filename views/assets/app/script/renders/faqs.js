import Faqs from "../../../_common/classes/Faqs.js";

export async function renderFaqs(c) {

    c.innerHTML = `
        <div class="panel fade-in">

            <div class="panel-header">
                <h1 class="panel-title">Últimas <em>perguntas</em></h1>
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

                <button id="faq-create-btn"
                    style="
                        padding:10px 14px;
                        border-radius:10px;
                        border:1px solid var(--gold);
                        background:rgba(255,204,127,0.15);
                        color:var(--gold);
                        cursor:pointer;
                        white-space:nowrap;
                    ">
                    Criar pergunta
                </button>
            </div>

            <div id="faq-create"></div>

            <div
                id="faq-list"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:14px;
                "
            ></div>

        </div>
    `;

    const list = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');

    let allFaqs = [];

    // -------------------------
    // RENDER LISTA
    // -------------------------

    function renderList(data) {

        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = `
                <div style="
                    padding:30px;
                    text-align:center;
                    color:var(--text-muted);
                ">
                    <i
                        class="ti ti-search"
                        style="font-size:30px;color:var(--gold);"
                    ></i>

                    <p style="margin-top:10px;">
                        Nenhuma pergunta encontrada.
                    </p>
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
                ">

                    <div style="
                        display:flex;
                        gap:12px;
                        flex:1;
                    ">

                        <div style="
                            width:44px;
                            height:44px;
                            border-radius:12px;
                            background:rgba(255,204,127,0.12);
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            color:var(--gold);
                            font-size:18px;
                        ">
                            <i class="ti ti-user"></i>
                        </div>

                        <div style="flex:1;">

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:flex-start;
                            ">

                                <h3 style="
                                    margin:0;
                                    font-size:14px;
                                    font-weight:600;
                                ">
                                    ${faq.user_name || 'Anônimo'}
                                </h3>

                                <span style="
                                    font-size:11px;
                                    color:var(--gold);
                                    background:rgba(255,204,127,0.15);
                                    border:1px solid var(--gold);
                                    padding:4px 8px;
                                    border-radius:8px;
                                ">
                                    ${faq.category_name || 'Sem categoria'}
                                </span>

                            </div>

                            <p style="
                                margin-top:6px;
                                font-size:13px;
                                color:var(--text-muted);
                            ">
                                ${faq.question}
                            </p>

                        </div>

                    </div>

                    <span style="
                        font-size:11px;
                        color:var(--text-dim);
                        white-space:nowrap;
                    ">
                        ${faq.created_at}
                    </span>

                </div>
            `;

            list.appendChild(item);
        });
    }
    async function loadFaqs() {

        try {

            const faqs = new Faqs();

            const responseData = await faqs.listFaqAndCategories();

            allFaqs = responseData.data ?? [];

            renderList(allFaqs);

        } catch (error) {

            console.error('Erro ao carregar FAQs:', error);

            list.innerHTML = `
                <div style="
                    padding:30px;
                    text-align:center;
                ">
                    <p style="color:#f87171;">
                        Não foi possível carregar as perguntas.
                    </p>
                </div>
            `;
        }
    }

    searchInput.addEventListener('input', () => {

        const texto = searchInput.value
            .trim()
            .toLowerCase();

        if (!texto) {
            renderList(allFaqs);
            return;
        }

        const filtradas = allFaqs.filter(faq => {

            const categoria =
                faq.category_name?.toLowerCase() ?? '';

            const pergunta =
                faq.question?.toLowerCase() ?? '';

            return (
                categoria.includes(texto) ||
                pergunta.includes(texto)
            );
        });

        renderList(filtradas);
    });

    await loadFaqs();
}