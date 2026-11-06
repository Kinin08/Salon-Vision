import { listEmployees } from '../../../_common/Api/user.js';
import { listServices } from '../../../_common/Api/services.js';
import {
    listServiceEmployees,
    createServiceEmployee,
    deleteServiceEmployee
} from '../../../_common/Api/serviceEmployee.js';

import { mostrarFeedback, mostrarRespostaAPI } from '../../../_common/script/Feedback.js';

export async function renderServicosEmp(c) {
    const [vinculos, funcionarios, servicos] = await Promise.all([
        listServiceEmployees(),
        listEmployees(),
        listServices()
    ]);

    // o listAll do PHP devolve só os ids, então os nomes vêm das outras listas
    const nomeServico = id => servicos.find(s => s.id == id)?.name ?? `Serviço #${id}`;
    const nomeFunc = id => funcionarios.find(f => f.id == id)?.name ?? `Funcionário #${id}`;
    c.innerHTML = `
    <div class="metrics-grid">
        <div class="metric-card fade-in">
            <div class="metric-top"><div class="metric-icon gold"><i class="ti ti-link"></i></div></div>
            <h1 class="metric-value">${vinculos.length}</h1>
            <h2 class="metric-label">Vínculos ativos</h2>
        </div>
    </div>

    <div class="panel fade-in delay-2">
        <div class="panel-header">
            <h1 class="panel-title">Vincular <em>funcionário a serviço</em></h1>
        </div>

        <div class="se-form">
            <div class="se-field">
                <label class="se-label" for="se-service">Serviço</label>
                <select id="se-service" class="se-select">
                    <option value="">Selecione o serviço</option>
                    ${servicos.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
            </div>

            <div class="se-field">
                <label class="se-label" for="se-employee">Funcionário</label>
                <select id="se-employee" class="se-select">
                    <option value="">Selecione o funcionário</option>
                    ${funcionarios.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                </select>
            </div>

            <button type="button" id="se-add" class="se-btn-add">
                <i class="ti ti-plus"></i> Vincular
            </button>
        </div>

    </div>

    <div class="panel fade-in delay-3">
        <div class="panel-header">
            <h1 class="panel-title">Serviços e <em>funcionários</em></h1>
        </div>

        <div class="se-table-wrap">
            <table class="se-table">
                <thead>
                    <tr><th>Serviço</th><th>Funcionário</th><th></th></tr>
                </thead>
                <tbody id="se-tbody"></tbody>
            </table>
        </div>
    </div>
`;

    const tbody = document.getElementById('se-tbody');

    const inicial = nome => (nome?.trim()?.[0] ?? '?').toUpperCase();

    tbody.innerHTML = vinculos.length
        ? vinculos.map(v => {
            const servico = nomeServico(v.service_id ?? v.serviceId);
            const func = nomeFunc(v.employee_id ?? v.employeeId);

            return `
        <tr>
            <td>
                <div class="se-cell">
                    <span class="se-avatar"><i class="ti ti-cut"></i></span>
                    ${servico}
                </div>
            </td>
            <td>
                <div class="se-cell">
                    <span class="se-avatar">${inicial(func)}</span>
                    ${func}
                </div>
            </td>
            <td style="text-align:right;">
                <button type="button" class="se-btn-remove" data-remove="${v.id}">
                    <i class="ti ti-trash"></i> Remover
                </button>
            </td>
        </tr>`;
        }).join('')
        : `<tr><td colspan="3" class="se-empty">Nenhum vínculo cadastrado.</td></tr>`;
// vincular
document.getElementById('se-add').addEventListener('click', async () => {
    const serviceId = document.getElementById('se-service').value;
    const employeeId = document.getElementById('se-employee').value;

    if (!serviceId || !employeeId) {
        mostrarFeedback('Selecione o serviço e o funcionário.', 'warning');
        return;
    }

    const res = await createServiceEmployee(serviceId, employeeId);

    mostrarRespostaAPI(res);

    if (res?.code >= 200 && res?.code < 300) {
        await renderServicosEmp(c);
    }
});

// remover
tbody.addEventListener('click', async event => {
    const btn = event.target.closest('[data-remove]');
    if (!btn) return;

    if (!confirm('Remover este vínculo?')) return;

    const res = await deleteServiceEmployee(btn.dataset.remove);

    mostrarRespostaAPI(res);

    if (res?.code >= 200 && res?.code < 300) {
        await renderServicosEmp(c);
    }
});
}