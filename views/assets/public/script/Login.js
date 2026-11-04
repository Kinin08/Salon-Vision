import Users from "../../_common/classes/Users.js";
import { setAuthMode } from "./AbrirTela.js";
import { mostrarFeedback } from "../../_common/script/Feedback.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const form = { email, password };

    try {
        const user = new Users();
        const response = await user.login(form);

        if (response && (response.code === 200 || response.code === 201)) {

            // Busca os dados completos do usuário
            const userData = await user.listById(response.data.id);

            if (!userData || userData.code !== 200) {
                mostrarFeedback("Não foi possível verificar sua conta.", "error");
                return;
            }

            // Verifica se a conta está inativa
            if (Number(userData.data.active) === 0) {
                mostrarFeedback(
                    "Sua conta está desativada.",
                    "error"
                );
                return;
            }

            // Somente contas ativas recebem o token
            localStorage.setItem("token", response.data.token);

            document.getElementById("password").value = "";

            mostrarFeedback("Login realizado com sucesso!", "success");

            const userTypeId = Number(userData.data.userTypeId);

            if (userTypeId === 4) {
                window.location.href = "./views/assets/app/index.html";
            } else if (userTypeId === 5) {
                window.location.href = "./views/assets/employee/index.html";
            } else if (userTypeId === 3) {
                window.location.href = "./views/assets/admin/index.html";
            } else {
                localStorage.removeItem("token");
                mostrarFeedback("Tipo de usuário desconhecido.", "error");
            }

        } else {
            mostrarFeedback(
                response?.message || "E-mail ou senha inválidos.",
                "error"
            );
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        mostrarFeedback(error.message || "Não foi possível fazer login.", "error");
    }
});

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const form = { name, email, password };

    try {
        const user = new Users();
        const response = await user.register(form);

        if (response && response.code === 201) {
            setAuthMode("login");
            document.getElementById("email").value = email;
            document.getElementById("password").value = "";

            mostrarFeedback("Cadastro realizado com sucesso!", "success");
        } else {
            mostrarFeedback(
                response?.message || "Não foi possível concluir o cadastro.",
                "error"
            );
        }

    } catch (error) {
        console.error("Erro ao fazer cadastro:", error);
        mostrarFeedback(
            error?.message || "Cadastro não realizado. Tente novamente.",
            "error"
        );
    }
});
