import { listClients, deletarUsuario } from '../../../_common/Api/user.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';
import Users from '../../../_common/classes/Users.js';

// IDs de user_type_id usados no backend
const ROLES = { admin: 3, cliente: 4, employee: 5 };
const users = new Users();

function toast(message, icon = 'ti-check') {
    const el = document.createElement('div');
    el.style.cssText = `
        position:fixed;bottom:24px;right:24px;z-index:10000;
        display:flex;align-items:center;gap:8px;
        padding:10px 16px;border-radius:8px;font-size:13px;
        background:var(--bg-card,#1a1a1a);color:var(--text,#fff);
        border:1px solid rgba(255,255,255,.15);
        box-shadow:0 6px 24px rgba(0,0,0,.4);`;
    el.innerHTML = `<i class="ti ${icon}"></i><span></span>`;
    el.querySelector('span').textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function esc(value) {
    const d = document.createElement('div');
    d.textContent = value ?? '';
    return d.innerHTML;
}

/**
 * @param {HTMLElement} c         container da página
 * @param {(page: string) => void} [navigate]  função do seu app que troca de seção
 */
export async function renderClientes(c, navigate) {
    let clientes = await listClients();
    let busca = '';

    c.innerHTML = `
    <div class="panel fade-in">
        <div class="panel-header">
            <h1 class="panel-title">Gestão de <em>Clientes</em></h1>
            <span class="panel-action" id="clientes-count"></span>
        </div>
        <div class="search-wrap">
            <i class="ti ti-search"></i>
            <input type="text" class="form-input" id="busca-cliente" placeholder="Buscar cliente..." />
        </div>
        <table>
            <thead><tr>
                <th>Cliente</th><th>E-mail</th><th>Telefone</th><th>Ações</th>
            </tr></thead>
            <tbody id="tbody-clientes"></tbody>
        </table>
    </div>`;

    function goToProfissionais() {
        if (typeof navigate === 'function') {
            navigate('profissionais');
            return;
        }
        // Fallback: clica no item do menu lateral, se existir
        document
            .querySelector('[data-page="profissionais"], [data-section="profissionais"], [data-nav="profissionais"]')
            ?.click();
    }

    async function promote(id, btn) {
        const cl = clientes.find(x => x.id === id);
        if (!cl) return;
        if (!confirm(`Promover ${cl.name ?? cl.nome} a profissional?`)) return;

        btn.disabled = true;
        try {
            await users.updateRole(id, ROLES.employee);
            toast(`${cl.name ?? cl.nome} agora é profissional.`, 'ti-check');
            goToProfissionais();
        } catch (e) {
            console.error(e);
            btn.disabled = false;
            toast('Erro ao promover cliente.', 'ti-alert-circle');
        }
    }

    async function remove(id, btn) {
        const cl = clientes.find(x => x.id === id);
        if (!cl || !confirm(`Remover ${cl.name ?? cl.nome}?`)) return;

        btn.disabled = true;
        try {
            const res = await deletarUsuario(id);
            // deletarUsuario devolve null quando o servidor recusa (ex.: 500)
            if (!res || res.type === 'error') {
                throw new Error(res?.message ?? 'Falha ao remover usuário');
            }
            clientes = clientes.filter(x => x.id !== id);
            toast(`${cl.name ?? cl.nome} removido.`, 'ti-trash');
            renderRows();
        } catch (e) {
            console.error(e);
            btn.disabled = false;
            toast('Erro ao remover cliente.', 'ti-alert-circle');
        }
    }

    function renderRows() {
        document.getElementById('clientes-count').textContent = `${clientes.length} clientes`;

        const tbody = document.getElementById('tbody-clientes');
        tbody.innerHTML = '';

        const term = busca.toLowerCase();
        const filtrados = clientes.filter(cl =>
            (cl.name ?? cl.nome ?? '').toLowerCase().includes(term) ||
            (cl.email ?? '').toLowerCase().includes(term)
        );

        filtrados.forEach(cl => {
            const nome = cl.name ?? cl.nome;
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                <div style="display:flex;align-items:center;gap:9px;">
                    <img src="${esc(cl.photo || cl.foto || FOTO_PADRAO)}" class="avatar" />
                    <span style="font-size:12.5px;font-weight:500;">${esc(nome)}</span>
                </div>
            </td>
            <td style="font-size:12px;color:var(--text-muted);">${esc(cl.email)}</td>
            <td style="font-size:12px;color:var(--text-muted);">${esc(cl.telephone ?? cl.tel)}</td>
            <td>
                <div style="display:flex;gap:5px;">
                    <button class="btn btn-gold btn-sm" data-promote="${cl.id}">
                        <i class="ti ti-arrow-narrow-up"></i> Promover a profissional
                    </button>
                    <button class="btn btn-danger btn-sm" data-del="${cl.id}"><i class="ti ti-trash"></i></button>
                </div>
            </td>`;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('[data-promote]').forEach(btn => {
            btn.addEventListener('click', () => promote(parseInt(btn.dataset.promote), btn));
        });
        tbody.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', () => remove(parseInt(btn.dataset.del), btn));
        });
    }

    renderRows();
    document.getElementById('busca-cliente').addEventListener('input', e => {
        busca = e.target.value;
        renderRows();
    });
}