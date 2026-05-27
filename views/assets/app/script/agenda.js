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

window.bindCursorTargets = bindCursorTargets;

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
