import { toast, getUserIdFromToken } from './helpers.js';
import { carregarDadosAgendamento, salvarAgendamento } from './renders/agendamentosService.js';

let agendamentoEditandoId = null;

export function initModals() {
    document.getElementById('modalCancelar')?.addEventListener('click', fecharModal);

    document.getElementById('modalConfirmar')?.addEventListener('click', async () => {
        const servico = document.getElementById('modalServico').value;
        const profissional = document.getElementById('modalProf').value;
        const data = document.getElementById('modalData').value;
        const hora = document.getElementById('modalHora').value;

        if (!servico || !profissional || !data || !hora) {
            toast('Preencha todos os campos.', 'ti-alert-circle');
            return;
        }

        const clientId = getUserIdFromToken();

        if (!clientId) {
            toast('Sessão inválida. Faça login novamente.', 'ti-alert-circle');
            return;
        }

        const payload = {
            clientId: clientId,
            employeeId: profissional,
            serviceId: servico,
            dateTime: `${data} ${hora}:00`
        };

        const sucesso = await salvarAgendamento(payload, agendamentoEditandoId);

        if (sucesso) {
            const editando = !!agendamentoEditandoId;
            fecharModal();
            toast(editando ? 'Agendamento reagendado!' : 'Agendamento criado!', 'ti-check');

            const { renderAgendamentos } = await import('./renders/agendamentos.js');
            renderAgendamentos(document.getElementById('page-content'));
        }
    });
}

export function abrirModal(agendamento = null) {
    agendamentoEditandoId = agendamento ? agendamento.id : null;

    const modal = document.getElementById('modalAgendar');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    carregarDadosAgendamento(agendamento);
}

export function fecharModal() {
    const modal = document.getElementById('modalAgendar');
    modal.classList.add('hidden');
    modal.classList.remove('flex');

    agendamentoEditandoId = null;

    document.getElementById('modalServico').value = '';
    document.getElementById('modalProf').value = '';
    document.getElementById('modalData').value = '';
    document.getElementById('modalHora').value = '';
}