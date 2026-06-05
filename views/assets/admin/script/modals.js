import { closeModal, toast, openModal, updateBadge, nav, setActive } from './helpers.js';
import { agendamentos, catalogo, profissionais } from './data.js';
import { renderAgendamentos } from './renders/agendamento.js';
import { renderServicos } from './renders/servicos.js';
import { renderProfissionais } from './renders/profissionais.js';

export function initModals() {
    // Modal Agendamento
    document.getElementById('m-cancelar')?.addEventListener('click', () => closeModal('modalAgendar'));
    document.getElementById('modalAgendar')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalAgendar')) closeModal('modalAgendar');
    });
    document.getElementById('m-confirmar')?.addEventListener('click', () => {
        const cliente = document.getElementById('m-cliente').value.trim();
        const data = document.getElementById('m-data').value;
        if (!cliente) { toast('Informe o nome do cliente!', 'ti-alert-circle'); return; }
        if (!data) { toast('Selecione uma data!', 'ti-alert-circle'); return; }
        const [y, m, d] = data.split('-');
        agendamentos.push({
            id: Date.now(),
            cliente,
            servico: document.getElementById('m-servico').value,
            prof: document.getElementById('m-prof').value,
            data: `${d}/${m}/${y}`,
            hora: document.getElementById('m-hora').value,
            status: 'pending'
        });
        updateBadge();
        closeModal('modalAgendar');
        toast('Agendamento criado!');
        nav(renderAgendamentos, 'Gestão de <em>Agendamentos</em>');
        setActive('nav-agendamentos');
        
    });

    // Modal Serviço
    document.getElementById('ms-cancelar')?.addEventListener('click', () => closeModal('modalServico'));
    document.getElementById('modalServico')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalServico')) closeModal('modalServico');
    });
    document.getElementById('ms-confirmar')?.addEventListener('click', () => {
        const nome = document.getElementById('ms-nome').value.trim();
        if (!nome) { toast('Informe o nome do serviço!', 'ti-alert-circle'); return; }
        catalogo.push({
            id: Date.now(),
            icon: 'ti-sparkles',
            nome,
            desc: document.getElementById('ms-desc').value,
            duracao: document.getElementById('ms-dur').value || '—',
            valor: document.getElementById('ms-valor').value || 'R$ —'
        });
        closeModal('modalServico');
        toast('Serviço criado!');
        nav(renderServicos, 'Catálogo de <em>Serviços</em>');
        setActive('nav-servicos');
    });

    // Modal Profissional
    document.getElementById('mp-cancelar')?.addEventListener('click', () => closeModal('modalProf'));
    document.getElementById('modalProf')?.addEventListener('click', e => {
        if (e.target === document.getElementById('modalProf')) closeModal('modalProf');
    });
    document.getElementById('mp-confirmar')?.addEventListener('click', () => {
        const nome = document.getElementById('mp-nome').value.trim();
        if (!nome) { toast('Informe o nome!', 'ti-alert-circle'); return; }
        profissionais.push({
            id: Date.now(),
            nome,
            role: document.getElementById('mp-role').value || 'Especialista',
            foto: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`,
            nota: 5.0,
            ativo: true
        });
        closeModal('modalProf');
        toast('Profissional cadastrado!');
        nav(renderProfissionais, 'Nossa <em>Equipe</em>');
        setActive('nav-profissionais');
    });
        // 🔥 ABRIR MODAL FAQ
    document.getElementById('faq-create-btn')?.addEventListener('click', () => {
        openModal('modalFaq');
    });

    // 🔥 CANCELAR BOTÃO
    document.getElementById('faq-cancelar')?.addEventListener('click', () => {
        closeModal('modalFaq');
    });

    // 🔥 FECHAR CLICANDO FORA
    document.getElementById('modalFaq')?.addEventListener('click', (e) => {
        if (e.target.id === 'modalFaq') {
            closeModal('modalFaq');
        }
    });

    // 🔥 BOTÃO CRIAR (sem lógica ainda)
    document.getElementById('faq-confirmar')?.addEventListener('click', () => {
        toast('Ação de criar ainda não implementada', 'ti-info-circle');
        closeModal('modalFaq');
    });
}