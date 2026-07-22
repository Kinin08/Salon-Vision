const BASE_URL = "http://localhost:8080/api";

// ── Elementos ──────────────────────────────────────────────
const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const authFeedback = document.getElementById("authFeedback");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// ── Redirecionamento por tipo ──────────────────────────────
function redirectByRole(userType) {
    const routes = {
        "admin": "/Salon-Vision/views/assets/admin/index.html",
        "funcionario": "/Salon-Vision/views/assets/employee/index.html",
        "cliente": "/Salon-Vision/views/assets/app/index.html",
    };
    const path = routes[userType] ?? routes["Cliente"];
    setTimeout(() => window.location.href = path, 1000);
}

// ── Helpers ────────────────────────────────────────────────
function showFeedback(message, isError = false) {
    authFeedback.textContent = message;
    authFeedback.classList.remove("hidden");
    authFeedback.classList.remove(
        "border-red-400/20", "bg-red-400/10", "text-red-300",
        "border-green-400/20", "bg-green-400/10", "text-green-300"
    );
    if (isError) {
        authFeedback.classList.add("border-red-400/20", "bg-red-400/10", "text-red-300");
    } else {
        authFeedback.classList.add("border-green-400/20", "bg-green-400/10", "text-green-300");
    }
}

function clearFeedback() {
    authFeedback.classList.add("hidden");
    authFeedback.textContent = "";
}

function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading
        ? (btn.closest("form")?.id === "loginForm" ? "Entrando..." : "Criando conta...")
        : (btn.closest("form")?.id === "loginForm" ? "Entrar" : "Criar conta");
}

async function postJSON(endpoint, body) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return { status: res.status, data };
}

// ── Modal ──────────────────────────────────────────────────
function openModal(tab = "login") {
    authModal.classList.add("open");
    clearFeedback();
    switchTab(tab);
}

function closeModal() {
    authModal.classList.remove("open");
    clearFeedback();
    loginForm.reset();
    signupForm.reset();
}

document.querySelectorAll("[data-action='login']").forEach(btn =>
    btn.addEventListener("click", () => openModal("login"))
);
document.querySelectorAll("[data-action='signup']").forEach(btn =>
    btn.addEventListener("click", () => openModal("signup"))
);

document.querySelector("[data-auth-close]")?.addEventListener("click", closeModal);
authModal.addEventListener("click", e => { if (e.target === authModal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ── Tabs ───────────────────────────────────────────────────
function switchTab(tab) {
    const isLogin = tab === "login";
    authTitle.textContent = isLogin ? "Entrar" : "Criar conta";
    loginForm.classList.toggle("hidden", !isLogin);
    signupForm.classList.toggle("hidden", isLogin);
    document.querySelectorAll("[data-auth-tab]").forEach(btn => {
        const active = btn.dataset.authTab === tab;
        btn.classList.toggle("bg-[#FFCC7F]", active);
        btn.classList.toggle("text-[#3B3B42]", active);
        btn.classList.toggle("text-white/60", !active);
    });
    clearFeedback();
}

document.querySelectorAll("[data-auth-tab]").forEach(btn =>
    btn.addEventListener("click", () => switchTab(btn.dataset.authTab))
);

// ── LOGIN ──────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFeedback();

    const submitBtn = loginForm.querySelector("[type='submit']");
    setLoading(submitBtn, true);

    const body = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
    };

    try {
        
        const { status, data } = await postJSON("/users/login/cliente", body);

        if (status === 200) {
            const userData = data.data;

            localStorage.setItem("token", userData?.token ?? "");
            localStorage.setItem("userName", userData?.name ?? "");
            localStorage.setItem("userType", userData?.userType ?? "");

            showFeedback(`Bem-vindo, ${userData?.name}! Redirecionando...`);
            redirectByRole(userData?.userType);
            console.log("Tipo:", userData.userType);
        } else {
            showFeedback(data.message ?? "Erro ao fazer login.", true);
            setLoading(submitBtn, false);
        }
    } catch (err) {
        showFeedback("Erro de conexão. Tente novamente.", true);
        setLoading(submitBtn, false);
    }
});

// ── CADASTRO ───────────────────────────────────────────────
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFeedback();

    const submitBtn = signupForm.querySelector("[type='submit']");
    setLoading(submitBtn, true);

    const body = {
        name: document.getElementById("signupName").value.trim(),
        email: document.getElementById("signupEmail").value.trim(),
        password: document.getElementById("signupPassword").value,
    };

    try {
        const { status, data } = await postJSON("/users/register/cliente", body);
        if (status === 201) {
            showFeedback("Conta criada! Entrando...");

            try {
                const { status: loginStatus, data: loginData } = await postJSON("/users/login", {
                    email: body.email,
                    password: body.password,
                });

                if (loginStatus === 200) {
                    const userData = loginData.data;
                    localStorage.setItem("token", userData?.token ?? "");
                    localStorage.setItem("userName", userData?.name ?? "");
                    localStorage.setItem("userType", userData?.userType ?? "");
                    redirectByRole(userData?.userType);
                } else {
                    setTimeout(() => window.location.href = "/Salon-Vision/views/assets/app/index.html", 1000);
                }
            } catch (_) {
                setTimeout(() => window.location.href = "/Salon-Vision/views/assets/app/index.html", 1000);
            }
        } else {
            console.log("ERRO:", data.message);
            showFeedback(data.message ?? "Erro ao criar conta.", true);
            setLoading(submitBtn, false);
        }
    } catch (err) {
        showFeedback("Erro de conexão. Tente novamente.", true);
        setLoading(submitBtn, false);
    }
});

// ── Scroll suave ───────────────────────────────────────────
document.querySelectorAll("[data-scroll-target]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(btn.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    });
});

// ── Mobile menu ────────────────────────────────────────────
const mobileMenuBtn = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn?.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
document.querySelectorAll(".mobile-menu-link").forEach(link =>
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"))
);