
// Dados do cliente logado
export const CLIENTE = {
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    telefone: '(51) 99234-5678',
    foto: 'https://i.pravatar.cc/80?img=47',
    totalAgendamentos: 34,
    avaliacoesFeitas: 28,
    favoritos: ['Coloração', 'Escova & Tratamento', 'Sobrancelha'],
};

export let perguntasPendentes = [
    { cliente: 'Ana Costa', pergunta: 'Quais produtos são usados na coloração?', data: '05/06/2025' },
    { cliente: 'Julia Moraes', pergunta: 'Vocês oferecem pacotes promocionais?', data: '04/06/2025' },
    { cliente: 'Clara Vieira', pergunta: 'Qual a política de cancelamento?', data: '03/06/2025' },
];

export const STATUS_LABEL = {
    confirmed: 'Confirmado',
    pending: 'Pendente',
    done: 'Concluído',
    cancelled: 'Cancelado',
};

// Agendamentos do cliente
export let meusAgendamentos = [
    { id: 1, servico: 'Coloração', profissional: 'Camila R.', data: '20/06/2025', hora: '10:00', status: 'confirmed' },
    { id: 2, servico: 'Sobrancelha', profissional: 'Renata M.', data: '22/06/2025', hora: '14:30', status: 'pending' },
    { id: 3, servico: 'Escova & Tratamento', profissional: 'Priya A.', data: '25/06/2025', hora: '09:30', status: 'confirmed' },
    { id: 4, servico: 'Manicure', profissional: 'Aline F.', data: '28/06/2025', hora: '16:00', status: 'pending' },
];

// Histórico
export const historico = [
    { servico: 'Coloração', profissional: 'Camila R.', data: '05/06/2025', valor: 'R$ 280', avaliacao: 5 },
    { servico: 'Escova & Tratamento', profissional: 'Priya A.', data: '28/05/2025', valor: 'R$ 120', avaliacao: 5 },
    { servico: 'Manicure', profissional: 'Aline F.', data: '20/05/2025', valor: 'R$ 60', avaliacao: 4 },
    { servico: 'Sobrancelha', profissional: 'Renata M.', data: '12/05/2025', valor: 'R$ 45', avaliacao: 5 },
    { servico: 'Hidratação Profunda', profissional: 'Priya A.', data: '02/05/2025', valor: 'R$ 95', avaliacao: 4 },
    { servico: 'Corte Feminino', profissional: 'Camila R.', data: '15/04/2025', valor: 'R$ 90', avaliacao: 5 },
];

// Catálogo de serviços
export const catalogo = [
    { icon: 'ti-palette', nome: 'Coloração', desc: 'Coloração completa com produtos profissionais e proteção para os fios.', duracao: '2h30', valor: 'R$ 280' },
    { icon: 'ti-cut', nome: 'Corte Feminino', desc: 'Corte personalizado para valorizar seu estilo e formato de rosto.', duracao: '1h', valor: 'R$ 90' },
    { icon: 'ti-wind', nome: 'Escova & Tratamento', desc: 'Escova modeladora com tratamento hidratante profundo.', duracao: '1h30', valor: 'R$ 120' },
    { icon: 'ti-sparkles', nome: 'Manicure', desc: 'Cuidado completo para unhas das mãos com esmaltação e acabamento.', duracao: '50min', valor: 'R$ 60' },
    { icon: 'ti-droplet', nome: 'Hidratação Profunda', desc: 'Máscara nutritiva para recuperar o brilho e a saúde dos cabelos.', duracao: '1h', valor: 'R$ 95' },
    { icon: 'ti-eye', nome: 'Sobrancelha', desc: 'Design de sobrancelha com henna e brow lamination.', duracao: '45min', valor: 'R$ 45' },
];

// Profissionais
export const profissionais = [
    { nome: 'Camila R.', role: 'Colorista & Cabeleireira', foto: 'https://randomuser.me/api/portraits/women/21.jpg', nota: 4.9 },
    { nome: 'Priya A.', role: 'Cabeleireira', foto: 'https://randomuser.me/api/portraits/women/33.jpg', nota: 4.8 },
    { nome: 'Lucas T.', role: 'Barbeiro', foto: 'https://randomuser.me/api/portraits/men/45.jpg', nota: 4.7 },
    { nome: 'Aline F.', role: 'Manicure & Pedicure', foto: 'https://randomuser.me/api/portraits/women/57.jpg', nota: 4.9 },
    { nome: 'Renata M.', role: 'Design & Estética', foto: 'https://randomuser.me/api/portraits/women/10.jpg', nota: 4.8 },
    { nome: 'Diego P.', role: 'Cabeleireiro', foto: 'https://randomuser.me/api/portraits/men/22.jpg', nota: 4.6 },
];