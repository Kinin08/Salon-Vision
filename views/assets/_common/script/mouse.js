const cursor = document.getElementById('cursor');

console.log(cursor);
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.opacity = '1';
});

function bindCursorTargets(scope = document) {
    document.addEventListener('mouseover', (e) => {
        if (
            e.target.closest(
                'button, a, input, select, .card-item, .testi-card, .select'
            )
        ) {
            cursor.classList.add('big');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (
            e.target.closest(
                'button, a, input, select, .card-item, .testi-card, .select'
            )
        ) {
            cursor.classList.remove('big');
        }
    });
}

bindCursorTargets();

document.addEventListener('mouseover', (e) => {
    if (e.target.matches('h1, h2, h3, p, span, th')) {
        cursor.classList.add('text-cursor');
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.matches('h1, h2, h3, p, span, th')) {
        cursor.classList.remove('text-cursor');
    }
});
(function tick() {
    cx += (mx - cx) * 0.20;
    cy += (my - cy) * 0.20;
    cursor.style.transform =
        `translate(${cx - 8}px, ${cy - 8}px)`;
    requestAnimationFrame(tick);
})();
