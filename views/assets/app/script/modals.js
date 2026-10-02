
import { mostrarFeedback } from '../../_common/script/Feedback.js';
import Appointmants from '../../_common/classes/Appointmants.js';
import Users from '../../_common/classes/Users.js';
import Services from '../../_common/classes/Services.js';
import ServiceEmployee from '../../_common/classes/ServiceEmployee.js';

let appointmentIdEditando = null;

export async function abrirModal(servicoPresel = null, appointmentId = null) {
    const modal = document.getElementById('modalAgendar');

    modal.classList.add('open');

    appointmentIdEditando = appointmentId;

    // Limpa os campos antes de abrir
    document.getElementById('modalData').value = '';
    document.getElementById('modalHora').value = '';
    document.getElementById('modalComentario').value = '';

    const selectServico = document.getElementById('modalServico');
    const selectProf = document.getElementById('modalProf');

    if (selectServico) {
        selectServico.value = '';
    }

    if (selectProf) {
        selectProf.innerHTML = `
            <option value="">Selecione um profissional</option>
        `;
    }

    // Carrega os serviços
    await carregarServicos();

    // ==============================
    // MODO EDIÇÃO
    // ==============================
    if (appointmentId !== null) {

        const appointments = new Appointmants();

        try {
            const response = await appointments.listById(appointmentId);

            console.log('Agendamento para edição:', response);

            if (!response?.data) {
                mostrarFeedback(
                    'Não foi possível carregar o agendamento.',
                    'error'
                );
                return;
            }

            const agendamento = response.data;

            // Serviço
            const serviceId = agendamento.serviceId;

            if (selectServico && serviceId) {
                selectServico.value = serviceId;

                // Carrega os profissionais do serviço
                await carregarProfissionaisPorServico(serviceId);

                // Seleciona o profissional atual
                if (selectProf && agendamento.employeeId) {
                    selectProf.value = agendamento.employeeId;
                }
            }

            // Data e horário
            if (agendamento.dateTime) {

                const dataHora = agendamento.dateTime
                    .replace('T', ' ')
                    .split(' ');

                const data = dataHora[0];
                const hora = dataHora[1]?.substring(0, 5);

                document.getElementById('modalData').value = data;
                document.getElementById('modalHora').value = hora;
            }

            // Comentário
            document.getElementById('modalComentario').value =
                agendamento.comment ?? '';

        } catch (error) {

            console.error(
                'Erro ao carregar agendamento:',
                error
            );

            mostrarFeedback(
                error.message ?? 'Erro ao carregar agendamento.',
                'error'
            );
        }

        return;
    }

    // ==============================
    // MODO NOVO AGENDAMENTO
    // ==============================
    if (servicoPresel) {

        const select = document.getElementById('modalServico');

        if (select) {
            select.value = servicoPresel;

            await carregarProfissionaisPorServico(servicoPresel);
        }
    }
}

export function fecharModal() {
    document
        .getElementById('modalAgendar')
        .classList.remove('open');

    appointmentIdEditando = null;
}

export function abrirModalFaq() {
    document
        .getElementById('modalFaq')
        .classList.add('open');
}

export function fecharModalFaq() {
    document
        .getElementById('modalFaq')
        .classList.remove('open');
}


async function carregarProfissionaisPorServico(serviceId) {

    const employeeSelect =
        document.getElementById('modalProf');

    if (!employeeSelect) return;

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

    const response =
        await serviceEmployee.listByService(serviceId);

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
}


async function carregarServicos() {

    const services = new Services();

    const response = await services.listAll();

    const select =
        document.getElementById('modalServico');

    if (!select) return;

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
    document
        .getElementById('modalCancelar')
        ?.addEventListener('click', fecharModal);


    document
        .getElementById('modalAgendar')
        ?.addEventListener('click', e => {

            if (
                e.target ===
                document.getElementById('modalAgendar')
            ) {
                fecharModal();
            }

        });


    // Seleção do serviço
    document
        .getElementById('modalServico')
        ?.addEventListener('change', async () => {

            const serviceId =
                document.getElementById('modalServico').value;

            await carregarProfissionaisPorServico(serviceId);

        });


    // Confirmar agendamento
    document
        .getElementById('modalConfirmar')
        ?.addEventListener('click', async () => {

            const servico =
                document.getElementById('modalServico').value;

            const prof =
                document.getElementById('modalProf').value;

            const data =
                document.getElementById('modalData').value;

            const hora =
                document.getElementById('modalHora').value;

            const comentario =
                document.getElementById('modalComentario').value;


            if (!servico) {

                mostrarFeedback(
                    'Selecione um serviço!',
                    'warning'
                );

                return;
            }


            if (!prof) {

                mostrarFeedback(
                    'Selecione um profissional!',
                    'warning'
                );

                return;
            }


            if (!data) {

                mostrarFeedback(
                    'Selecione uma data!',
                    'warning'
                );

                return;
            }


            if (!hora) {

                mostrarFeedback(
                    'Selecione um horário!',
                    'warning'
                );

                return;
            }


            try {

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


                console.log(
                    'Resposta da API:',
                    response
                );


                if (
                    response &&
                    response.code >= 200 &&
                    response.code < 300
                ) {

                    const estavaEditando =
                        appointmentIdEditando !== null;

                    fecharModal();

                    mostrarFeedback(
                        estavaEditando
                            ? 'Agendamento atualizado com sucesso!'
                            : 'Agendamento confirmado!',
                        'success'
                    );

                    return;
                }


                mostrarFeedback(
                    response?.message ??
                    'Erro ao salvar agendamento.',
                    'error'
                );

            } catch (error) {

                console.error(
                    'Erro ao salvar agendamento:',
                    error
                );

                mostrarFeedback(
                    error.message ??
                    'Erro ao salvar agendamento.',
                    'error'
                );
            }

        });


    // Modal FAQ
    document
        .getElementById('faqCancelar')
        ?.addEventListener('click', fecharModalFaq);


    document
        .getElementById('modalFaq')
        ?.addEventListener('click', e => {

            if (
                e.target ===
                document.getElementById('modalFaq')
            ) {
                fecharModalFaq();
            }

        });
}