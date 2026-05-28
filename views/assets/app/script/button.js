const trigger = document.getElementById('trigger');
const backdrop = document.getElementById('backdrop');
const hint = document.getElementById('hint');
const items = Array.from(document.querySelectorAll('.nav-item'));
const total = items.length;

const radius = 110;

function calcTranslate(index) {
    const startAngle = 160;
    const endAngle = 280;
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
        item.style.transitionDelay = `${(total - 1 - i) * 35}ms`;
        item.style.transform = `scale(.5) translate(0, 0)`;
        item.classList.remove('open');
    });
}

trigger.addEventListener('click', () => isOpen ? close() : open());
backdrop.addEventListener('click', close);

document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
