import { toast } from './helpers.js';
import Appointmants from '../../_common/classes/Appointmants.js';
import Users from '../../_common/classes/Users.js';
import Services from '../../_common/classes/Services.js';
import ServiceEmployee from '../../_common/classes/ServiceEmployee.js';

let appointmentIdEditando = null;

export async function abrirModal(servicoPresel = null, appointmentId = null) {

    const modal = document.getElementById('modalAgendar');

    modal.classList.add('open');

    appointmentIdEditando = appointmentId;

    await carregarServicos();

    if (servicoPresel) {

        const select = document.getElementById('modalServico');

        if (select) {
            select.value = servicoPresel;

            await carregarProfissionaisPorServico(servicoPresel);
        }
    }
}

export function fecharModal() {
    document.getElementById('modalAgendar').classList.remove('open');
}

export function abrirModalFaq() {
    document.getElementById('modalFaq').classList.add('open');
}

export function fecharModalFaq() {
    document.getElementById('modalFaq').classList.remove('open');
}
const serviceSelect = document.getElementById('modalServico');
const employeeSelect = document.getElementById('modalProf');

serviceSelect.addEventListener('change', async () => {

    const serviceId = serviceSelect.value;

    employeeSelect.innerHTML = `
        <option value="">Carregando profissionais...</option>
    `;

    if (!serviceId) {
        employeeSelect.innerHTML = `
            <option value="">Selecione um profissional</option>
        `;
        return;
    }

    const serviceEmployee = new ServiceEmployee();

    const response = await serviceEmployee.listByService(serviceId);

    employeeSelect.innerHTML = `
        <option value="">Selecione um profissional</option>
    `;

    (response.data ?? []).forEach(employee => {
        employeeSelect.innerHTML += `
            <option value="${employee.employee_id}">
                ${employee.employee_name}
            </option>
        `;
    });
});
async function carregarServicos() {
    const services = new Services();
    const response = await services.listAll();

    const select = document.getElementById('modalServico');

    select.innerHTML = `
        <option value="">Selecione um serviço</option>
    `;

    (response.data ?? []).forEach(service => {
        select.innerHTML += `
            <option value="${service.id}">
                ${service.name}
            </option>
        `;
    });
}
// Inicializar todos os modais
export function initModals() {
    // Modal Agendamento
    document.getElementById('modalCancelar')?.addEventListener('click', fecharModal);
    document.getElementById('modalAgendar')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalAgendar')) fecharModal();
    });

    document.getElementById('modalConfirmar')?.addEventListener('click', async () => {
        const servico = document.getElementById('modalServico').value;
        const prof = document.getElementById('modalProf').value;
        const data = document.getElementById('modalData').value;
        const hora = document.getElementById('modalHora').value;
        const comentario = document.getElementById('modalComentario').value;

        if (!data) {
            toast('Selecione uma data!', 'ti-alert-circle');
            return;
        }

        if (!hora) {
            toast('Selecione um horário!', 'ti-alert-circle');
            return;
        }

        const users = new Users();

        const usuario = await users.me();

        const dados = {
            clientId: usuario.data.id,
            employeeId: prof,
            serviceId: servico,
            dateTime: `${data} ${hora}:00`,
            comment: comentario
        };

        const appointments = new Appointmants();

        let response;

        if (appointmentIdEditando !== null) {

            response = await appointments.update(
                appointmentIdEditando,
                dados
            );

        } else {

            response = await appointments.create(dados);
        }

        if (response.code === 201) {
            fecharModal();

            toast(
                'Agendamento confirmado!',
                'ti-calendar-check'
            );

            return;
        }

        toast(
            response.message ?? 'Erro ao criar agendamento.',
            'ti-alert-circle'
        );
    });

    // Modal FAQ
    document.getElementById('faqCancelar')?.addEventListener('click', fecharModalFaq);
    document.getElementById('modalFaq')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalFaq')) fecharModalFaq();
    });
}