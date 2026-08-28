let feedbackTimeout = null;

const estilosPorTipo = {
    success: {
        base: "bg-emerald-950/90 border-emerald-500/30 text-emerald-300",
        icone: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>`
    },
    error: {
        base: "bg-red-950/90 border-red-500/30 text-red-300",
        icone: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>`
    }
};

export function mostrarFeedback(mensagem, tipo = "success") {
    const feedback = document.getElementById("authFeedback");
    if (!feedback) {
        console.error("Elemento #authFeedback não encontrado.");
        return;
    }

    if (feedbackTimeout) clearTimeout(feedbackTimeout);

    const estilo = estilosPorTipo[tipo] ?? estilosPorTipo.success;

    // Classes base: posição, formato, backdrop-blur e sombra
    feedback.className = `
        absolute top-4 right-4 z-[90] max-w-xs
        flex items-center gap-2.5
        px-4 py-3 rounded-xl border backdrop-blur-md
        text-xs font-medium shadow-lg shadow-black/40
        transition-all duration-300 ease-out
        ${estilo.base}
    `.trim().replace(/\s+/g, " ");

    feedback.innerHTML = `${estilo.icone}<span>${mensagem}</span>`;

    // Estado inicial da animação (entra deslizando + fade)
    feedback.classList.add("opacity-0", "-translate-y-2");
    feedback.classList.remove("hidden");

    requestAnimationFrame(() => {
        feedback.classList.remove("opacity-0", "-translate-y-2");
    });

    feedbackTimeout = setTimeout(() => {
        feedback.classList.add("opacity-0", "-translate-y-2");

        setTimeout(() => {
            feedback.classList.add("hidden");
        }, 300);
    }, 3500);
}