export async function renderFaqs(c) {
    c.innerHTML = `
<div class="panel fade-in">

    <div class="panel-header">
        <h1 class="panel-title">Últimas <em>perguntas</em></h1>
    </div>

    <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">

        <input 
            id="faq-search"
            placeholder="Pesquisar por categoria..."
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
    <div id="faq-list" style="display:flex;flex-direction:column;gap:14px;"></div>

</div>
`;

    const list = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');
    const faqCreate = document.getElementById('faq-create');

    let allFaqs = [];

    // -------------------------
    // RENDER LISTA
    // -------------------------
    function renderList(data) {
        list.innerHTML = '';

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

    <div style="display:flex;gap:12px;flex:1;">

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

            <div style="display:flex;justify-content:space-between;align-items:flex-start;">

                <h3 style="margin:0;font-size:14px;font-weight:600;">
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
                    ${faq.category_name}
                </span>

            </div>

            <p style="margin-top:6px;font-size:13px;color:var(--text-muted);">
                ${faq.question}
            </p>

        </div>
    </div>

    <span style="font-size:11px;color:var(--text-dim);white-space:nowrap;">
        ${faq.created_at}
    </span>

</div>
`;

            list.appendChild(item);
        });
    }

    // -------------------------
    // CARREGAR FAQS
    // -------------------------
    async function loadFaqs() {
        const response = await fetch('http://localhost/Salon-Vision/api/faqs/listFaq');
        const data = await response.json();

        allFaqs = data.data || [];
        renderList(allFaqs);
    }

    // -------------------------
    // CRIAR FORM
    // -------------------------
    const btn = document.getElementById('faq-create-btn');
    function openCreateForm() {
        faqCreate.innerHTML = `
        <div style="
            padding:18px;
            border:1px solid var(--border);
            border-radius:16px;
            background:rgba(255,255,255,0.02);
            display:flex;
            flex-direction:column;
            gap:12px;
        ">

            <input id="question" placeholder="Pergunta..." 
                style="padding:10px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--text);" />

            <input id="faqCategory" type="number" placeholder="ID categoria"
                style="padding:10px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--text);" />

            <input id="answer" placeholder="Resposta..."
                style="padding:10px;border-radius:10px;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--text);" />

            <div style="display:flex;gap:10px;justify-content:center;">

                <button id="faq-create-submit"
                    style="padding:10px 14px;border-radius:10px;color:var(--gold);cursor:pointer;">
                    Confirmar
                </button>

                <button id="faq-cancel"
                    style="padding:10px 14px;border-radius:10px;color:var(--gold);cursor:pointer;">
                    Cancelar
                </button>

            </div>
        </div>
        
        `;

        // cancelar
        document.getElementById('faq-cancel').onclick = () => {
            faqCreate.innerHTML = '';
        };

        // criar
        document.getElementById('faq-create-submit').onclick = async (e) => {
            e.preventDefault();
            const question = document.getElementById('question').value.trim();
            const category = document.getElementById('faqCategory').value;
            const answer = document.getElementById('answer').value.trim();

            if (!question || !category || !answer) {
                alert("Preencha tudo!");
                return;
            }

            const res = await fetch('http://localhost/Salon-Vision/api/faqs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    faqCategoryId: Number(category),
                    question,
                    answer
                })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message)
                return;
            }
            alert(data.message)
            faqCreate.innerHTML = '';

            await loadFaqs();
        };
    }

    // -------------------------
    // EVENTOS (SEM DUPLICAR)
    // -------------------------
    document.getElementById('faq-create-btn').onclick = openCreateForm;

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = allFaqs.filter(faq =>
            faq.category_name?.toLowerCase().includes(value)
        );

        renderList(filtered);
    });

    // -------------------------
    // INIT
    // -------------------------
    await loadFaqs();
}