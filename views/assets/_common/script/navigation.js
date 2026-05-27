const trigger = document.getElementById('trigger');
const backdrop = document.getElementById('backdrop');
const hint = document.getElementById('hint');
const items = Array.from(document.querySelectorAll('.nav-item'));
const total = items.length;

const radius = 110;

function calcTranslate(index) {
    const startAngle = 200;
    const endAngle = 340;
    const angle = startAngle + (endAngle - startAngle) * (index / (total - 1));
    const rad = angle * Math.PI / 180;
    const dx = radius * Math.cos(rad);
    const dy = radius * Math.sin(rad);
    return { dx, dy };
}

let isOpen = false;

function open() {
    isOpen = true;
    trigger.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('visible');
    hint.classList.add('hidden');

    items.forEach((item, i) => {
        const { dx, dy } = calcTranslate(i);
        item.style.transitionDelay = `${i * 35}ms`;
        item.style.transform = `scale(1) translate(${dx}px, ${dy}px)`;
        item.classList.add('open');
    });
}

function close() {
    isOpen = false;
    trigger.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('visible');
    hint.classList.remove('hidden');

    items.forEach((item, i) => {
        item.style.transitionDelay = `${(total - 1 - i) * 25}ms`;
        item.style.transform = `scale(.5) translate(0, 0)`;
        item.classList.remove('open');
    });
}

trigger.addEventListener('click', () => isOpen ? close() : open());
backdrop.addEventListener('click', close);

document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

const quickPanel = document.getElementById('quickPanel');
const quickTitle = document.getElementById('quickTitle');
const quickContent = document.getElementById('quickContent');

const quickViews = {
    profile: {
        title: 'Perfil',
        content: `
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-full bg-[#FFCC7F]/20 text-[#FFCC7F] flex items-center justify-center text-2xl font-bold">A</div>
                        <div>
                            <p class="text-white font-semibold">Ana Souza</p>
                            <p class="text-white/45 text-xs">Cliente Salon Vision</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p class="text-white/35 text-[10px] uppercase tracking-[2px]">Agendamentos</p>
                            <p class="text-[#FFCC7F] text-xl font-bold mt-1">12</p>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p class="text-white/35 text-[10px] uppercase tracking-[2px]">Favoritos</p>
                            <p class="text-[#FFCC7F] text-xl font-bold mt-1">5</p>
                        </div>
                    </div>
                    <button data-scroll-target="#agendar" class="mt-5 w-full rounded-xl bg-[#FFCC7F] text-[#3B3B42] font-bold py-3 cursor-none">Novo agendamento</button>
                `
    },
    settings: {
        title: 'Configurações',
        content: `
                    <div class="space-y-3">
                        ${[
                ['Lembretes por WhatsApp', 'Ativado'],
                ['Confirmação por e-mail', 'Ativado'],
                ['Tema do painel', 'Escuro'],
                ['Privacidade do perfil', 'Padrão']
            ].map(item => `
                            <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                                <p class="text-white text-sm font-semibold">${item[0]}</p>
                                <span class="text-[#FFCC7F] text-xs">${item[1]}</span>
                            </div>
                        `).join('')}
                    </div>
                `
    },
    messages: {
        title: 'Mensagens',
        content: `
                    <div class="space-y-3">
                        ${[
                ['Recepção', 'Seu horário de amanhã está confirmado.'],
                ['Profissional Ana', 'Pode vir com o cabelo lavado se preferir.'],
                ['Salon Vision', 'Você ganhou 10% no próximo serviço.']
            ].map(item => `
                            <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                                <p class="text-white text-sm font-semibold">${item[0]}</p>
                                <p class="text-white/45 text-xs mt-1">${item[1]}</p>
                            </div>
                        `).join('')}
                    </div>
                `
    },
    camera: {
        title: 'Câmera',
        content: `
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                        <div class="h-44 rounded-xl bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80')] bg-cover bg-center mb-4"></div>
                        <p class="text-white font-semibold">Inspirações do seu salão</p>
                        <p class="text-white/45 text-xs mt-1">Área visual para fotos de antes/depois e referências.</p>
                    </div>
                `
    },
    likes: {
        title: 'Curtidas',
        content: `
                    <div class="grid grid-cols-2 gap-3">
                        ${['Corte em camadas', 'Coloração mel', 'Unhas nude', 'Escova modelada'].map(item => `
                            <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                                <i class="ph ph-heart text-[#FFCC7F] text-xl"></i>
                                <p class="text-white text-sm font-semibold mt-3">${item}</p>
                            </div>
                        `).join('')}
                    </div>
                `
    },
    history: {
        title: 'Histórico',
        content: `
                    <div class="space-y-3">
                        ${[
                ['20 Maio', 'Corte feminino', 'R$ 120'],
                ['03 Maio', 'Manicure completa', 'R$ 55'],
                ['15 Abril', 'Hidratação', 'R$ 90']
            ].map(item => `
                            <div class="grid grid-cols-[64px_1fr_64px] gap-3 items-center rounded-xl border border-white/10 bg-white/5 p-4">
                                <p class="text-[#FFCC7F] text-xs font-semibold">${item[0]}</p>
                                <p class="text-white text-sm">${item[1]}</p>
                                <p class="text-white/45 text-xs text-right">${item[2]}</p>
                            </div>
                        `).join('')}
                    </div>
                `
    },
    favorites: {
        title: 'Favoritos',
        content: `
                    <div class="grid grid-cols-2 gap-3">
                        ${[
                ['Ana', 'Cabelo'],
                ['Lia', 'Unhas'],
                ['Rafa', 'Make'],
                ['Carla', 'Sobrancelhas']
            ].map(item => `
                            <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                                <div class="w-11 h-11 rounded-full bg-[#FFCC7F]/20 text-[#FFCC7F] mx-auto mb-3 flex items-center justify-center font-bold">${item[0][0]}</div>
                                <p class="text-white text-sm font-semibold">${item[0]}</p>
                                <p class="text-white/35 text-xs">${item[1]}</p>
                            </div>
                        `).join('')}
                    </div>
                `
    }
};

function openQuickPanel(viewName) {
    const view = quickViews[viewName];
    if (!view) return;

    quickTitle.textContent = view.title;
    quickContent.innerHTML = view.content;
    quickPanel.classList.add('open');
    document.body.classList.add('overflow-hidden');
    close();
    window.bindCursorTargets?.(quickContent);
}

function closeQuickPanel() {
    quickPanel.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
}

document.querySelectorAll('[data-menu-view]').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        openQuickPanel(item.dataset.menuView);
    });
});

document.querySelector('.nav-item[href="#home"]')?.addEventListener('click', () => {
    close();
    document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('[data-quick-close]').forEach(button => {
    button.addEventListener('click', closeQuickPanel);
});

quickPanel.addEventListener('click', event => {
    if (event.target === quickPanel) closeQuickPanel();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && quickPanel.classList.contains('open')) closeQuickPanel();
});
