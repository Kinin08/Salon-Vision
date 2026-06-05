import { meusAgendamentos } from './data.js';
import { toast, navegarPara } from './helpers.js';
import { renderAgendamentos } from './renders/agendamentos.js';

// Funções para o modal de agendamento
export function abrirModal(servicoPresel = null) {
    const modal = document.getElementById('modalAgendar');
    modal.classList.add('open');
    if (servicoPresel) {
        const sel = document.getElementById('modalServico');
        if (sel) {
            for (let opt of sel.options) {
                if (opt.value === servicoPresel) {
                    sel.value = servicoPresel;
                    break;
                }
            }
        }
    }
}

export function fecharModal() {
    document.getElementById('modalAgendar').classList.remove('open');
}

// Funções para o modal de FAQ
export function abrirModalFaq() {
    document.getElementById('modalFaq').classList.add('open');
}

export function fecharModalFaq() {
    document.getElementById('modalFaq').classList.remove('open');
}

// Inicializar todos os modais
export function initModals() {
    // Modal Agendamento
    document.getElementById('modalCancelar')?.addEventListener('click', fecharModal);
    document.getElementById('modalAgendar')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalAgendar')) fecharModal();
    });

    document.getElementById('modalConfirmar')?.addEventListener('click', () => {
        const servico = document.getElementById('modalServico').value;
        const prof = document.getElementById('modalProf').value;
        const data = document.getElementById('modalData').value;
        const hora = document.getElementById('modalHora').value;

        if (!data) {
            toast('Selecione uma data!', 'ti-alert-circle');
            return;
        }

        const [y, m, d] = data.split('-');
        const dataFmt = `${d}/${m}/${y}`;

        meusAgendamentos.push({
            id: Date.now(),
            servico,
            profissional: prof,
            data: dataFmt,
            hora,
            status: 'pending'
        });

        fecharModal();
        toast(`Agendamento de ${servico} confirmado!`);
    });

    // Modal FAQ
    document.getElementById('faqCancelar')?.addEventListener('click', fecharModalFaq);
    document.getElementById('modalFaq')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalFaq')) fecharModalFaq();
    });
}