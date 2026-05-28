function renderDashBars(values = [55, 72, 48, 90, 65, 80, 95]) {
    const dashBars = document.getElementById('dashBars');
    if (!dashBars) return;

    dashBars.innerHTML = '';
    values.forEach((v, i) => {
        const b = document.createElement('div');
        b.style.cssText = `flex:1; height:${v}%; background:${i === values.length - 1 ? '#FFCC7F' : 'rgba(255,204,127,0.2)'}; border-radius:4px 4px 0 0; transition:background .2s`;
        b.addEventListener('mouseenter', () => b.style.background = 'rgba(255,204,127,0.5)');
        b.addEventListener('mouseleave', () => b.style.background = i === values.length - 1 ? '#FFCC7F' : 'rgba(255,204,127,0.2)');
        dashBars.appendChild(b);
    });
}

const dashboardViews = {
    dashboard: `
                <div class="grid grid-cols-4 gap-2 mb-4">
                    <div class="bg-white/4 rounded-xl p-3 border border-white/5">
                        <p class="text-white/35 text-[9px] mb-1">Agendamentos</p>
                        <p class="text-white text-xl font-bold">32</p>
                        <p class="text-green-400 text-[9px] mt-1">+12% hoje</p>
                    </div>
                    <div class="bg-white/4 rounded-xl p-3 border border-white/5">
                        <p class="text-white/35 text-[9px] mb-1">Faturamento</p>
                        <p class="text-white text-sm font-bold">R$4.680</p>
                        <p class="text-green-400 text-[9px] mt-1">+8% hoje</p>
                    </div>
                    <div class="bg-white/4 rounded-xl p-3 border border-white/5">
                        <p class="text-white/35 text-[9px] mb-1">Novos clientes</p>
                        <p class="text-white text-xl font-bold">7</p>
                        <p class="text-green-400 text-[9px] mt-1">+3 hoje</p>
                    </div>
                    <div class="bg-white/4 rounded-xl p-3 border border-white/5">
                        <p class="text-white/35 text-[9px] mb-1">Ocupação</p>
                        <p class="text-white text-xl font-bold">85%</p>
                        <p class="text-[#FFCC7F] text-[9px] mt-1">Alta</p>
                    </div>
                </div>
                <div class="bg-white/3 rounded-xl p-3 border border-white/5">
                    <p class="text-white/40 text-[10px] mb-3">Agendamentos — últimos 7 dias</p>
                    <div class="flex items-end gap-2 h-20" id="dashBars"></div>
                </div>
            `,
    agenda: `
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-white text-sm font-semibold">Agenda de hoje</p>
                        <p class="text-white/35 text-[10px]">Próximos horários confirmados</p>
                    </div>
                    <button class="rounded-lg bg-[#FFCC7F] text-[#3B3B42] px-3 py-2 text-[10px] font-bold cursor-none">Novo horário</button>
                </div>
                <div class="space-y-2">
                    ${[
            ['09:00', 'Corte feminino', 'Juliana M.', 'Confirmado'],
            ['11:30', 'Coloração', 'Marina S.', 'Em preparo'],
            ['14:00', 'Manicure', 'Bianca T.', 'Confirmado'],
            ['16:30', 'Escova', 'Paula R.', 'Pendente']
        ].map(item => `
                        <div class="grid grid-cols-[52px_1fr_76px] gap-3 items-center bg-white/4 border border-white/5 rounded-xl p-3">
                            <p class="text-[#FFCC7F] text-xs font-bold">${item[0]}</p>
                            <div>
                                <p class="text-white text-xs font-semibold">${item[1]}</p>
                                <p class="text-white/35 text-[10px]">${item[2]}</p>
                            </div>
                            <span class="text-[9px] text-white/55 text-right">${item[3]}</span>
                        </div>
                    `).join('')}
                </div>
            `,
    clientes: `
                <div class="flex items-center justify-between mb-4">
                    <p class="text-white text-sm font-semibold">Clientes recentes</p>
                    <button class="rounded-lg border border-white/10 text-white/70 px-3 py-2 text-[10px] cursor-none">Adicionar</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${[
            ['Ana Souza', '12 visitas', 'R$ 1.240'],
            ['Carla Lima', '8 visitas', 'R$ 860'],
            ['Nina Alves', '5 visitas', 'R$ 540'],
            ['Joana Reis', '3 visitas', 'R$ 310']
        ].map(item => `
                        <div class="bg-white/4 border border-white/5 rounded-xl p-3">
                            <p class="text-white text-xs font-semibold">${item[0]}</p>
                            <p class="text-white/35 text-[10px] mt-1">${item[1]}</p>
                            <p class="text-[#FFCC7F] text-[10px] mt-2">${item[2]}</p>
                        </div>
                    `).join('')}
                </div>
            `,
    servicos: `
                <div class="flex items-center justify-between mb-4">
                    <p class="text-white text-sm font-semibold">Serviços cadastrados</p>
                    <button class="rounded-lg bg-[#FFCC7F] text-[#3B3B42] px-3 py-2 text-[10px] font-bold cursor-none">Novo serviço</button>
                </div>
                <div class="space-y-2">
                    ${[
            ['Corte feminino', '60 min', 'R$ 120'],
            ['Coloração', '120 min', 'R$ 260'],
            ['Manicure completa', '45 min', 'R$ 55'],
            ['Escova modelada', '50 min', 'R$ 90']
        ].map(item => `
                        <div class="flex items-center justify-between bg-white/4 border border-white/5 rounded-xl p-3">
                            <div>
                                <p class="text-white text-xs font-semibold">${item[0]}</p>
                                <p class="text-white/35 text-[10px]">${item[1]}</p>
                            </div>
                            <p class="text-[#FFCC7F] text-xs font-bold">${item[2]}</p>
                        </div>
                    `).join('')}
                </div>
            `,
    profissionais: `
                <div class="flex items-center justify-between mb-4">
                    <p class="text-white text-sm font-semibold">Equipe disponível</p>
                    <button class="rounded-lg border border-white/10 text-white/70 px-3 py-2 text-[10px] cursor-none">Gerenciar</button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${[
            ['Ana', 'Cabelo', '92%'],
            ['Lia', 'Unhas', '86%'],
            ['Rafa', 'Make', '78%']
        ].map(item => `
                        <div class="bg-white/4 border border-white/5 rounded-xl p-3 text-center">
                            <div class="w-9 h-9 rounded-full bg-[#FFCC7F]/20 text-[#FFCC7F] mx-auto mb-2 flex items-center justify-center font-bold">${item[0][0]}</div>
                            <p class="text-white text-xs font-semibold">${item[0]}</p>
                            <p class="text-white/35 text-[10px]">${item[1]}</p>
                            <p class="text-green-400 text-[10px] mt-2">${item[2]} ocupado</p>
                        </div>
                    `).join('')}
                </div>
            `,
    financeiro: `
                <div class="grid grid-cols-3 gap-2 mb-4">
                    <div class="bg-white/4 border border-white/5 rounded-xl p-3">
                        <p class="text-white/35 text-[9px]">Receita</p>
                        <p class="text-white text-lg font-bold">R$ 18,4k</p>
                    </div>
                    <div class="bg-white/4 border border-white/5 rounded-xl p-3">
                        <p class="text-white/35 text-[9px]">A receber</p>
                        <p class="text-white text-lg font-bold">R$ 2,1k</p>
                    </div>
                    <div class="bg-white/4 border border-white/5 rounded-xl p-3">
                        <p class="text-white/35 text-[9px]">Ticket médio</p>
                        <p class="text-white text-lg font-bold">R$ 146</p>
                    </div>
                </div>
                <div class="bg-white/3 rounded-xl p-3 border border-white/5">
                    <p class="text-white/40 text-[10px] mb-3">Receita semanal</p>
                    <div class="flex items-end gap-2 h-20" id="dashBars"></div>
                </div>
            `,
    relatorios: `
                <div class="mb-4">
                    <p class="text-white text-sm font-semibold">Relatórios inteligentes</p>
                    <p class="text-white/35 text-[10px]">Indicadores para acompanhar o crescimento do salão</p>
                </div>
                <div class="space-y-2">
                    ${[
            ['Serviços mais vendidos', 'Coloração lidera com 28%'],
            ['Horários de pico', 'Terça e sábado à tarde'],
            ['Retenção de clientes', '64% retornaram este mês']
        ].map(item => `
                        <div class="bg-white/4 border border-white/5 rounded-xl p-3">
                            <p class="text-white text-xs font-semibold">${item[0]}</p>
                            <p class="text-white/35 text-[10px] mt-1">${item[1]}</p>
                        </div>
                    `).join('')}
                </div>
            `,
    config: `
                <div class="mb-4">
                    <p class="text-white text-sm font-semibold">Configurações</p>
                    <p class="text-white/35 text-[10px]">Preferências do salão e notificações</p>
                </div>
                <div class="space-y-2">
                    ${[
            ['Lembretes automáticos', 'Ativado'],
            ['Confirmação por WhatsApp', 'Ativado'],
            ['Horário de funcionamento', '09:00 às 19:00']
        ].map(item => `
                        <div class="flex items-center justify-between bg-white/4 border border-white/5 rounded-xl p-3">
                            <p class="text-white text-xs font-semibold">${item[0]}</p>
                            <p class="text-[#FFCC7F] text-[10px]">${item[1]}</p>
                        </div>
                    `).join('')}
                </div>
            `
};

function openDashboardTab(tabName) {
    const content = document.getElementById('dashboardContent');
    if (!content || !dashboardViews[tabName]) return;

    document.querySelectorAll('[data-dashboard-tab]').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.dashboardTab === tabName);
    });

    content.innerHTML = dashboardViews[tabName];
    bindCursorTargets(content);

    if (tabName === 'dashboard') renderDashBars();
    if (tabName === 'financeiro') renderDashBars([36, 58, 44, 76, 62, 88, 70]);
}

document.querySelectorAll('[data-dashboard-tab]').forEach(tab => {
    tab.addEventListener('click', () => openDashboardTab(tab.dataset.dashboardTab));
});

document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector(button.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
    });
});