const authModal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authFeedback = document.getElementById('authFeedback');
const authTabs = document.querySelectorAll('[data-auth-tab]');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupEmail = document.getElementById('signupEmail');

function getRoleByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.includes('@adm')) return 'Administrador';
    if (normalizedEmail.includes('@func')) return 'Funcionario';

    return 'Cliente';
}

function setAuthMode(mode) {
    const isLogin = mode === 'login';

    authTitle.textContent = isLogin ? 'Entrar' : 'Criar conta';
    loginForm.classList.toggle('hidden', !isLogin);
    signupForm.classList.toggle('hidden', isLogin);
    authFeedback.classList.add('hidden');
    authFeedback.textContent = '';

    authTabs.forEach(tab => {
        const active = tab.dataset.authTab === mode;
        tab.classList.toggle('bg-[#FFCC7F]', active);
        tab.classList.toggle('text-[#3B3B42]', active);
        tab.classList.toggle('text-white/60', !active);
    });
}

function openAuth(mode) {
    setAuthMode(mode);
    authModal.classList.add('open');
}

function closeAuth() {
    authModal.classList.remove('open');
}

document.querySelector('[data-action="login"]')?.addEventListener('click', () => openAuth('login'));
document.querySelector('[data-action="signup"]')?.addEventListener('click', () => openAuth('signup'));

authTabs.forEach(tab => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
});

document.querySelectorAll('[data-auth-close]').forEach(button => {
    button.addEventListener('click', closeAuth);
});

authModal?.addEventListener('click', event => {
    if (event.target === authModal) closeAuth();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && authModal.classList.contains('open')) closeAuth();
});

loginForm?.addEventListener('submit', event => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const role = getRoleByEmail(email);

    authFeedback.textContent = `Login ok como ${role}`;
    authFeedback.classList.remove('hidden');

    setTimeout(() => {
        if (role === 'Administrador') {
            window.location.href = 'views/assets/admin/index.html';
        }else if(role === 'Funcionario'){
            window.location.href = 'views/assets/employee/index.html';
        }
        else {
            window.location.href = 'views/assets/app/index.html';
        }
    }, 1000);
});

signupForm?.addEventListener('submit', event => {
    event.preventDefault();

    const email = signupEmail.value;
    const role = getRoleByEmail(email);

    authFeedback.textContent = `Cadastro criado como ${role}`;
    authFeedback.classList.remove('hidden');

    // opcional: redirecionar depois de cadastrar
    setTimeout(() => {
        if (role === 'Administrador') {
            window.location.href = 'views/assets/admin/index.html';
        }else if(role === 'Funcionario'){
            window.location.href = 'views/assets/employee/index.html';
        }
        else {
            window.location.href = 'views/assets/app/index.html';
        }
    }, 1000);
});


if (typeof renderDashBars === "function") {
    renderDashBars();
}