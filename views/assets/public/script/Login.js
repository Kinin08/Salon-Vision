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
            document.getElementById("password").value = "";

            mostrarFeedback("Login realizado com sucesso!", "success");

            const locationByRole = await user.listById(response.data.id);

            const userTypeId = locationByRole.data.userTypeId;

            if (userTypeId === 3) {
                window.location.href = "./views/assets/admin/index.html";
            } else if (userTypeId === 4) {
                window.location.href = "./views/assets/app/index.html";
            } else if (userTypeId === 5) {
                window.location.href = "./views/assets/employee/index.html";
            } else {
                mostrarFeedback("Tipo de usuário desconhecido.", "error");
            }
            console.log(locationByRole);
        } else {
            mostrarFeedback("E-mail ou senha inválidos.", "error");
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        mostrarFeedback("Não foi possível fazer login. Tente novamente.", "error");
    }
});

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const form = { name, email, password };

    console.log("Enviando cadastro:", form);

    try {
        const user = new Users();
        const response = await user.register(form);

        if (response && response.code === 201) {
            setAuthMode("login");
            document.getElementById("email").value = email;
            document.getElementById("password").value = "";
            mostrarFeedback("Cadastro realizado com sucesso!", "success");
        } else {
            mostrarFeedback("Não foi possível concluir o cadastro.", "error");
        }

    } catch (error) {
        console.error("Erro ao fazer cadastro:", error);
        mostrarFeedback("Cadastro não realizado. Tente novamente.", "error");
    }
});