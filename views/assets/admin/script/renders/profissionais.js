import { listEmployees, listClients, updateRole } from '../../../_common/Api/user.js';
import { FOTO_PADRAO } from '../../../_common/script/Default.js';
import { mostrarFeedback } from '../../../_common/script/Feedback.js';

export async function renderProfissionais(c) {
    let list = await listEmployees();

    c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;" class="fade-in">
        <div>
            <h1 style="font-size:22px;font-weight:500;">Nossa <em>Equipe</em></h1>
            <p style="font-size:12px;color:var(--text-dim);margin-top:3px;" id="prof-count"></p>
        </div>
        <button class="btn btn-gold" id="btn-novo-prof"><i class="ti ti-user-plus"></i> Novo Profissional</button>
    </div>
    <div class="prof-grid fade-in" id="prof-grid"></div>`;

    function renderGrid() {
        document.getElementById('prof-count').textContent = `${list.length} profissionais cadastrados`;
        const grid = document.getElementById('prof-grid');
        grid.innerHTML = '';

        list.forEach(p => {
            const div = document.createElement('div');
            div.className = 'prof-card';
            div.innerHTML = `
            <img src="${p.photo || FOTO_PADRAO}" class="prof-avatar" />
            <p class="prof-name">${p.name}</p>
            <p class="prof-role">${p.role ?? 'Profissional'}</p>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button class="btn btn-ghost btn-sm" style="flex:1;" data-to-client="${p.id}"><i class="ti ti-arrow-narrow-down"></i> cliente</button>
                <button class="btn btn-ghost btn-sm" data-to-admin="${p.id}"><i class="ti ti-arrow-narrow-up"></i> admin</button>
            </div>`;
            grid.appendChild(div);
        });

        grid.querySelectorAll('[data-to-client]').forEach(btn => {
            btn.addEventListener('click', () => changeRole(parseInt(btn.dataset.toClient), 'cliente'));
        });
        grid.querySelectorAll('[data-to-admin]').forEach(btn => {
            btn.addEventListener('click', () => changeRole(parseInt(btn.dataset.toAdmin), 'admin'));
        });
    }

    async function changeRole(id, role) {
        const pr = list.find(x => x.id === id);
        if (!pr || !confirm(`Alterar ${pr.name} para ${role}?`)) return;
        try {
            await updateRole(id, role);
            list = list.filter(x => x.id !== id);
            mostrarFeedback(`${pr.name} agora é ${role}.`, 'success');
            renderGrid();
        } catch (e) {
            console.error(e);
            mostrarFeedback('Erro ao alterar o cargo.', 'error');
        }
    }

    // ---------- Modal: clientes -> profissionais ----------
    async function openClientsModal() {
        let clients = [];
        try {
            clients = await listClients();
        } catch (e) {
            console.error(e);
            mostrarFeedback('Erro ao carregar clientes.', 'error');
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;
            display:flex;align-items:center;justify-content:center;padding:16px;`;

        overlay.innerHTML = `
        <div style="background:var(--bg-card,#1a1a1a);color:var(--text,#fff);border-radius:12px;
                    width:100%;max-width:520px;max-height:80vh;display:flex;flex-direction:column;
                    box-shadow:0 10px 40px rgba(0,0,0,.5);">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.08);">
                <h2 style="font-size:17px;font-weight:500;margin:0;">Clientes</h2>
                <button class="btn btn-ghost btn-sm" id="close-clients-modal"><i class="ti ti-x"></i></button>
            </div>
            <div style="padding:12px 20px;">
                <input type="text" id="search-clients" placeholder="Buscar cliente..."
                    style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:transparent;color:inherit;" />
            </div>
            <div id="clients-list" style="overflow-y:auto;padding:0 20px 16px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>`;

        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#close-clients-modal').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

        const listEl = overlay.querySelector('#clients-list');

        function renderClients(filter = '') {
            const term = filter.toLowerCase();
            const filtered = clients.filter(cl =>
                (cl.name || '').toLowerCase().includes(term) ||
                (cl.email || '').toLowerCase().includes(term)
            );

            if (!filtered.length) {
                listEl.innerHTML = `<p style="text-align:center;font-size:13px;color:var(--text-dim);padding:20px 0;">Nenhum cliente encontrado.</p>`;
                return;
            }

            listEl.innerHTML = '';
            filtered.forEach(cl => {
                const row = document.createElement('div');
                row.style.cssText = `display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.04);`;
                row.innerHTML = `
                    <img src="${cl.photo || FOTO_PADRAO}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
                    <div style="flex:1;min-width:0;">
                        <p style="margin:0;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cl.name}</p>
                        <p style="margin:0;font-size:12px;color:var(--text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cl.email ?? ''}</p>
                    </div>
                    <button class="btn btn-gold btn-sm" data-make-prof="${cl.id}">
                        <i class="ti ti-user-check"></i> Tornar profissional
                    </button>`;
                listEl.appendChild(row);
            });

            listEl.querySelectorAll('[data-make-prof]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = parseInt(btn.dataset.makeProf);
                    const cl = clients.find(x => x.id === id);
                    btn.disabled = true;
                    try {
                        await updateRole(id, 'employee');
                        clients = clients.filter(x => x.id !== id);
                        list.push({ ...cl, role: 'Profissional' });
                        renderGrid();
                        renderClients(overlay.querySelector('#search-clients').value);
                        mostrarFeedback(`${cl.name} agora é profissional.`, 'success');
                    } catch (e) {
                        console.error(e);
                        btn.disabled = false;
                        mostrarFeedback('Erro ao promover cliente.', 'error');
                    }
                });
            });
        }

        overlay.querySelector('#search-clients').addEventListener('input', e => renderClients(e.target.value));
        renderClients();
    }

    renderGrid();
    document.getElementById('btn-novo-prof').addEventListener('click', openClientsModal);
}