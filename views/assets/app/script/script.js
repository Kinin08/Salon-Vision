const today = new Date();
document.getElementById("topbar-date").textContent =
    today.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

const titles = {
    historico: ['Histórico', 'de agendamentos'],
    servicos: ['Serviços', 'do salão'],
    depoimentos: ['Depoimentos', 'dos clientes'],
    agendamento: ['Agendar', 'serviço'],
    profissionais: ['Profissionais', 'da equipe']
};

function showTab(tab) {
    if (!titles[tab]) return;

    document.querySelectorAll('.tab-panel')
        .forEach(p => p.classList.remove('active'));

    document.querySelectorAll('.nav-item')
        .forEach(n => n.classList.remove('active'));

    const panel = document.getElementById('tab-' + tab);
    const nav = document.getElementById(tab);

    if (panel) panel.classList.add('active');
    if (nav) nav.classList.add('active');

    const [base, em] = titles[tab];

    document.getElementById('topbar').innerHTML =
        `${base} <em>${em}</em>`;
}

const historicoBtn = document.getElementById('historico')
    .addEventListener('click', e => {
        e.preventDefault();
        showTab('historico');
    });

const servicosBtn = document.getElementById('servicos')
    .addEventListener('click', e => {
        e.preventDefault();
        showTab('servicos');
    });

const depoimentosBtn = document.getElementById('depoimentos')
    .addEventListener('click', e => {
        e.preventDefault();
        showTab('depoimentos');
    });

const agendamentoBtn = document.getElementById('agendamento')
    .addEventListener('click', e => {
        e.preventDefault();
        showTab('agendamento');
    });

const profissionaisBtn = document.getElementById('profissionais')
    .addEventListener('click', e => {
        e.preventDefault();
        showTab('profissionais');
    });