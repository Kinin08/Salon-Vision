export async function renderFaqs(c) {
    c.innerHTML = `
<div class="panel fade-in">

    <div class="panel-header">
        <h1 class="panel-title">Últimas <em>perguntas</em></h1>
    </div>

    <input 
        id="faq-search"
        placeholder="Pesquisar por categoria..."
        style="
            width:100%;
            padding:10px 12px;
            margin-bottom:12px;
            border-radius:10px;
            border:1px solid var(--border);
            background:rgba(255,255,255,0.02);
            color:var(--text);
        "
    />

    <div id="faq-list" style="display:flex;flex-direction:column;gap:14px;"></div>

</div>
`;

    const list = document.getElementById('faq-list');
    const searchInput = document.getElementById('faq-search');

    let allFaqs = [];

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
                    ${faq.user_name ?? 'Anônimo'}
                </h3>

                <span style="
                    position:relative;
                    right:10px;
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

            <p style="margin-top:6px;font-size:12px;color:var(--text-muted);">
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
        setTimeout(() => {
    document.getElementById('faq-create-btn')?.addEventListener('click', () => {
        openModal('modalFaq');
    });
}, 0);
    }

    try {
        const response = await fetch('http://localhost/Salon-Vision/api/faqs/listFaq');
        const faqs = await response.json();

        allFaqs = faqs.data || [];

        renderList(allFaqs);

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();

            const filtered = allFaqs.filter(faq => {
                return (
                    faq.category_name.toLowerCase().includes(value)
                );
            });

            renderList(filtered);
        });

    } catch (e) {
        console.error(e);
        list.innerHTML = '<h2>Erro ao carregar FAQs</h2>';
    }
}