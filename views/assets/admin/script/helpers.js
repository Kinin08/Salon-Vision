
export function setActive(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
}

export function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded.id ?? decoded.sub ?? null;
    } catch (e) {
        console.error('Erro ao decodificar token', e);
        return null;
    }
}
export function nav(renderFn, title) {
    const c = document.getElementById('page-content');
    c.style.transition = 'opacity .22s';
    c.style.opacity = '0';
    setTimeout(() => {
        c.innerHTML = '';
        renderFn(c);
        c.style.opacity = '1';
        document.getElementById('topbar-title').innerHTML = title;
    }, 220);
}
export function toast(msg, icon = 'ti-check') {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    t.querySelector('i').className = `ti ${icon}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
export function stars(n) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += `<i class="ti ti-star${i <= n ? '-filled star-filled' : ''}"></i>`;
    return s;
}
export function openModal(id) { document.getElementById(id).classList.add('open'); }
export function closeModal(id) { document.getElementById(id).classList.remove('open'); }

export function updateBadge() {
    const p = agendamentos.filter(a => a.status === 'pending').length;

    const badge = document.getElementById('badge-apt');
    if (badge) {
        badge.textContent = p;
    }
}