import { clientes } from '../data.js';
import { toast } from '../helpers.js';
import { initModals } from '../modals.js';
export function renderClientes(c) {
    let busca = '';
    c.innerHTML = `
    <div class="panel fade-in">
        <div class="panel-header">
            <h1 class="panel-title">Gestão de <em>Clientes</em></h1>
            <span class="panel-action">${clientes.length} clientes</span>
        </div>
        <div class="search-wrap">
            <i class="ti ti-search"></i>
            <input type="text" class="form-input" id="busca-cliente" placeholder="Buscar cliente..." />
        </div>
        <table>
            <thead><tr>
                <th>Cliente</th><th>E-mail</th><th>Telefone</th><th>Agendamentos</th><th>Ações</th>
            </tr></thead>
            <tbody id="tbody-clientes"></tbody>
        </table>
    </div>`;

    function renderRows() {
        const tbody = document.getElementById('tbody-clientes');
        tbody.innerHTML = '';
        const filtrados = clientes.filter(cl => cl.nome.toLowerCase().includes(busca.toLowerCase()) || cl.email.toLowerCase().includes(busca.toLowerCase()));
        filtrados.forEach(cl => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                <div style="display:flex;align-items:center;gap:9px;">
                    <img src="${cl.foto}" class="avatar" />
                    <span style="font-size:12.5px;font-weight:500;">${cl.nome}</span>
                </div>
            </td>
            <td style="font-size:12px;color:var(--text-muted);">${cl.email}</td>
            <td style="font-size:12px;color:var(--text-muted);">${cl.tel}</td>
            <td style="font-size:13px;font-weight:600;color:var(--gold);">${cl.agendamentos}</td>
            <td>
                <div style="display:flex;gap:5px;">
                    <button class="btn btn-ghost btn-sm" onclick="toast('Perfil de ${cl.nome} em breve!')"><i class="ti ti-eye"></i></button>
                    <button class="btn btn-danger btn-sm" data-del="${cl.id}"><i class="ti ti-trash"></i></button>
                </div>
            </td>`;
            tbody.appendChild(tr);
        });
        tbody.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.del);
                const cl = clientes.find(x => x.id === id);
                if (confirm(`Remover ${cl.nome}?`)) {
                    clientes = clientes.filter(x => x.id !== id);
                    toast(`${cl.nome} removido.`, 'ti-trash');
                    renderRows();
                }
            });
        });
    }

    renderRows();
    document.getElementById('busca-cliente').addEventListener('input', e => {
        busca = e.target.value; renderRows();
    });
}
