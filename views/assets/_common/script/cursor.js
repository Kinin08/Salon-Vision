
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.opacity = '1';
});

function bindCursorTargets(scope = document) {
    scope.querySelectorAll('button, a, input, select, .card-item, .testi-card, .select').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
}

bindCursorTargets();

document.querySelectorAll('h1, h2, h3, p, input').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('text-cursor'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('text-cursor'));
});

(function tick() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
})();

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