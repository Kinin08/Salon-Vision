const faqList = document.querySelector("#faqList");

import Users from "../../_common/classes/Users.js";

async function carregarFaqs() {

    if (!faqList) {
        console.error("Elemento #faqList não encontrado.");
        return;
    }

    try {

        const response = await Users.listAll();

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const responseData = await response.json();

        renderizarFaqs(responseData.data);

    } catch (error) {

        console.error("Erro ao carregar FAQs:", error);

        faqList.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-400 text-sm">
                    Não foi possível carregar as perguntas.
                </p>
            </div>
        `;
    }
}

function renderizarFaqs(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) {
        faqList.innerHTML = `
            <div class="text-center py-8">
                <p class="text-white/40 text-sm">
                    Nenhuma pergunta encontrada.
                </p>
            </div>
        `;
        return;
    }

    faqList.innerHTML = faqs.map(faq => `

        <div
            class="faq-item bg-white/5 border border-white/10
            rounded-2xl overflow-hidden
            transition-all duration-300
            hover:border-[#C18057]/40">

            <button
                type="button"
                class="faq-button w-full px-5 py-5
                flex items-center justify-between
                text-left cursor-pointer">

                <span class="text-white text-sm font-medium">
                    ${faq.question}
                </span>

                <i
                    class="ph ph-plus text-[#FFCC7F]
                    text-lg transition-transform duration-300">
                </i>
            </button>
            <div class="faq-answer hidden px-5 pb-5">
                <p class="text-white/50 text-sm leading-relaxed">
                    ${faq.answer}
                </p>
            </div>
        </div>

    `).join("");

    configurarFaqs();
}

function configurarFaqs() {

    const buttons = document.querySelectorAll(".faq-button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const item = button.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");
            const icon = button.querySelector("i");

            const aberto = !answer.classList.contains("hidden");

            document.querySelectorAll(".faq-answer").forEach(element => {
                element.classList.add("hidden");
            });

            document.querySelectorAll(".faq-button i").forEach(element => {
                element.classList.remove("rotate-45");
            });

            if (!aberto) {
                answer.classList.remove("hidden");
                icon.classList.add("rotate-45");
            }
        });
    });
}
carregarFaqs();