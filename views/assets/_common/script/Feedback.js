let feedbackTimeout = null;

const estilosPorTipo = {
    success: {
        base: "bg-emerald-950/90 border-emerald-500/30 text-emerald-300",
        icone: `
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5 13l4 4L19 7" />
            </svg>
        `
    },

    warning: {
        base: "bg-yellow-950/90 border-yellow-500/30 text-yellow-300",
        icone: `
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.9L2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
        `
    },

    error: {
        base: "bg-red-950/90 border-red-500/30 text-red-300",
        icone: `
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        `
    }
};

const ToastPrototype = {

    mostrar(mensagem, tipo = "success") {

        const toast = document.getElementById("toast");

        if (!toast) {
            console.error("Elemento #toast não encontrado.");
            return;
        }

        const estilo = estilosPorTipo[tipo];

        if (!estilo) {
            console.error(`Tipo de Toast inválido: ${tipo}`);
            return;
        }

        toast.innerHTML = `
            ${estilo.icone}
            <span>${mensagem}</span>
        `;

        toast.classList.remove(
            "bg-emerald-950/90",
            "border-emerald-500/30",
            "text-emerald-300",
            "bg-yellow-950/90",
            "border-yellow-500/30",
            "text-yellow-300",
            "bg-red-950/90",
            "border-red-500/30",
            "text-red-300"
        );

        toast.classList.add(...estilo.base.split(" "));
        toast.classList.add("show");

        clearTimeout(feedbackTimeout);

        feedbackTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    },

    mostrarResposta(response) {

        if (!response) {
            this.mostrar(
                "Resposta inválida do servidor.",
                "error"
            );
            return;
        }

        let tipo = "warning";

        if (response.code >= 200 && response.code < 300) {
            tipo = "success";
        } else if (response.code >= 400) {
            tipo = "error";
        }

        const mensagem =
            response.message ??
            response.error ??
            "Não foi possível concluir a operação.";

        this.mostrar(mensagem, tipo);
    }
};

export function criarToast() {
    return Object.create(ToastPrototype);
}

export function mostrarFeedback(mensagem, tipo = "success") {
    const toast = criarToast();
    toast.mostrar(mensagem, tipo);
}

export function mostrarRespostaAPI(response) {
    const toast = criarToast();
    toast.mostrarResposta(response);
}