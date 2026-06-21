import { toast } from '../helpers.js';

export async function carregarDadosAgendamento(agendamento = null) {
    try {
        const token = localStorage.getItem('token');

        const [servicesRes, employeesRes] = await Promise.all([
            fetch('http://localhost/Salon-Vision/api/services/list', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('http://localhost/Salon-Vision/api/users/employee', {
                headers: { Authorization: `Bearer ${token}` }
            })
        ]);

        const services = await servicesRes.json();
        const employees = await employeesRes.json();

        const serviceSelect = document.getElementById('modalServico');
        const employeeSelect = document.getElementById('modalProf');

        serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
        employeeSelect.innerHTML = '<option value="">Selecione um profissional</option>';

        (services.data || []).forEach(service => {
            serviceSelect.innerHTML += `<option value="${service.id}">${service.name}</option>`;
        });

        (employees.data || []).forEach(employee => {
            employeeSelect.innerHTML += `<option value="${employee.id}">${employee.name}</option>`;
        });

        if (agendamento) {
            const data = new Date(agendamento.dateTime ?? agendamento.date_time);

            serviceSelect.value = agendamento.serviceId ?? '';
            employeeSelect.value = agendamento.employeeId ?? '';
            document.getElementById('modalData').value = data.toISOString().split('T')[0];
            document.getElementById('modalHora').value = data.toTimeString().slice(0, 5);
        }

    } catch (error) {
        console.error(error);
        toast('Erro ao carregar serviços e profissionais', 'ti-alert-circle');
    }
}

export async function salvarAgendamento(payload, id = null) {
    try {
        const token = localStorage.getItem('token');

        const url = id
            ? `http://localhost/Salon-Vision/api/appointments/update/${id}`
            : `http://localhost/Salon-Vision/api/appointments/create`;

        const response = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            toast(result.message || 'Erro ao salvar agendamento.', 'ti-alert-circle');
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        toast('Erro ao salvar agendamento.', 'ti-alert-circle');
        return false;
    }
}