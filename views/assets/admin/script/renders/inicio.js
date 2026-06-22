import { setNavActive, navegarPara } from '../helpers.js';
import { renderAgendamentos } from './agendamentos.js';
import { renderServicos } from './servicos.js';

const BASE_URL = 'http://localhost/Salon-Vision/api';

// aceita snake_case (user_type_id) ou camelCase (userTypeId), dependendo
// do que o Model::selectAll() devolver
function getTypeId(u) {
    return Number(u.user_type_id ?? u.userTypeId ?? 0);
}
function isActive(u) {
    return Number(u.active ?? 1) === 1;
}
function getRegDate(u) {
    return u.registration_date ?? u.registrationDate ?? null;
}

export async function renderInicio(c) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            c.innerHTML = `
                <div class="panel">
                    <p style="text-align:center;padding:20px;">
                        Você não está logado.
                    </p>
                </div>
            `;
            return;
        }

        const [profileResponse, usersResponse, employeesResponse] =
            await Promise.all([
                fetch(`${BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/users/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/users/employee`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

        const profileResult = await profileResponse.json();
        const usersResult = await usersResponse.json();
        const employeesResult = await employeesResponse.json();

        const user = profileResult?.data;

        if (!user) {
            c.innerHTML = `
                <div class="panel">
                    <p style="text-align:center;padding:20px;">
                        Sessão expirada. Faça login novamente.
                    </p>
                </div>
            `;
            return;
        }

        const allUsers = usersResult.data || [];
        const employees = employeesResult.data || [];

        const clientes = allUsers.filter(u => getTypeId(u) === 4);
        const clientesAtivos = clientes.filter(isActive);
        const funcionariosAtivos = employees.filter(isActive);

        const ultimosClientes = [...clientes]
            .sort((a, b) => new Date(getRegDate(b)) - new Date(getRegDate(a)))
            .slice(0, 5);

        c.innerHTML = `
            <div class="greeting-hero fade-in" style="margin-bottom:20px;">
                <p class="greeting-kicker">Painel administrativo</p>

                <h2 class="greeting-title">
                    Olá,
                    <strong>${user?.name?.split(' ')?.[0] || 'Admin'}!</strong>
                </h2>

                <p class="greeting-sub">
                    Aqui está um resumo do salão hoje.
                </p>
            </div>

            <div class="metrics-grid" style="margin-bottom:20px;">

                <div class="metric-card fade-in">
                    <div class="metric-icon gold">
                        <i class="ti ti-users"></i>
                    </div>
                    <h1 class="metric-value">${clientes.length}</h1>
                    <h2 class="metric-label">Total de clientes</h2>
                </div>

                <div class="metric-card fade-in delay-1">
                    <div class="metric-icon gold">
                        <i class="ti ti-user-check"></i>
                    </div>
                    <h1 class="metric-value">${clientesAtivos.length}</h1>
                    <h2 class="metric-label">Clientes ativos</h2>
                </div>

                <div class="metric-card fade-in delay-2">
                    <div class="metric-icon gold">
                        <i class="ti ti-user-star"></i>
                    </div>
                    <h1 class="metric-value">${employees.length}</h1>
                    <h2 class="metric-label">Profissionais cadastrados</h2>
                </div>

                <div class="metric-card fade-in delay-3">
                    <div class="metric-icon gold">
                        <i class="ti ti-users-group"></i>
                    </div>
                    <h1 class="metric-value">${allUsers.length}</h1>
                    <h2 class="metric-label">Usuários no sistema</h2>
                </div>

            </div>

            <div class="panel fade-in delay-2" style="margin-bottom:20px;">
                <div class="panel-header">
                    <h1 class="panel-title">
                        Últimos <em>clientes cadastrados</em>
                    </h1>
                </div>

                ${ultimosClientes.length
                ? `
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                ${ultimosClientes.map(cl => `
                                    <div class="next-apt-row" style="justify-content:space-between;">
                                        <span><i class="ti ti-user"></i> ${cl.name}</span>
                                        <span style="color:var(--text-dim);font-size:12px;">${cl.email}</span>
                                    </div>
                                `).join('')}
                            </div>
                        `
                : `
                            <p style="color:var(--text-dim);font-size:12px;">
                                Nenhum cliente cadastrado ainda.
                            </p>
                        `
            }
            </div>

            <div class="panel fade-in delay-3">
                <div class="panel-header">
                    <h1 class="panel-title">
                        Ações <em>rápidas</em>
                    </h1>
                </div>

                <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    <button class="btn btn-gold cursor-pointer" id="btnNovoApt">
                        <i class="ti ti-calendar-plus"></i>
                        Novo Agendamento
                    </button>

                    <button class="btn btn-ghost cursor-pointer" id="btnVerServicos">
                        <i class="ti ti-cut"></i>
                        Ver Serviços
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btnNovoApt')?.addEventListener('click', () => {
            setNavActive('nav-agendamentos');
            navegarPara(renderAgendamentos);
        });

        document.getElementById('btnVerServicos')?.addEventListener('click', () => {
            setNavActive('nav-servicos');
            navegarPara(renderServicos);
        });

    } catch (error) {
        console.error(error);

        c.innerHTML = `
            <div class="panel">
                <p style="text-align:center;padding:20px;">
                    Erro ao carregar dashboard.
                </p>
            </div>
        `;
    }
}