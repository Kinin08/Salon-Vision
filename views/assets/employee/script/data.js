export const CLIENTE = {
    nome: "Marcos Silva",
    email: "marcos@email.com",
    telefone: "(51) 99999-9999",
    foto: "https://i.pravatar.cc/150?img=12",
    totalAgendamentos: 34,
    avaliacoesFeitas: 12,
    favoritos: [
        "Coloração",
        "Hidratação",
        "Escova"
    ]
};

export const meusAgendamentos = [
    {
        id: 1,
        status: "confirmed"
    },
    {
        id: 2,
        status: "pending"
    }
];
/* ---- DATA ---- */
export let agendamentos = [
    { id: 1, cliente: 'Ana Costa', servico: 'Coloração', prof: 'Camila R.', data: '20/06/2025', hora: '10:00', status: 'confirmed' },
    { id: 2, cliente: 'Julia Moraes', servico: 'Sobrancelha', prof: 'Renata M.', data: '22/06/2025', hora: '14:30', status: 'pending' },
    { id: 3, cliente: 'Fernanda Lima', servico: 'Escova', prof: 'Priya A.', data: '25/06/2025', hora: '09:30', status: 'confirmed' },
    { id: 4, cliente: 'Clara Vieira', servico: 'Manicure', prof: 'Aline F.', data: '28/06/2025', hora: '16:00', status: 'pending' },
    { id: 5, cliente: 'Beatriz Nunes', servico: 'Hidratação', prof: 'Priya A.', data: '30/06/2025', hora: '11:00', status: 'confirmed' },
    { id: 6, cliente: 'Sofia Andrade', servico: 'Corte Feminino', prof: 'Camila R.', data: '01/07/2025', hora: '14:00', status: 'done' },
    { id: 7, cliente: 'Paula Ribeiro', servico: 'Coloração', prof: 'Camila R.', data: '02/07/2025', hora: '10:30', status: 'cancelled' },
];

export let clientes = [
    { id: 1, nome: 'Ana Costa', email: 'ana@email.com', tel: '(51) 99234-5678', agendamentos: 34, foto: 'https://i.pravatar.cc/80?img=47' },
    { id: 2, nome: 'Julia Moraes', email: 'julia@email.com', tel: '(51) 98765-4321', agendamentos: 12, foto: 'https://i.pravatar.cc/80?img=44' },
    { id: 3, nome: 'Fernanda Lima', email: 'fernanda@email.com', tel: '(51) 91234-5678', agendamentos: 8, foto: 'https://i.pravatar.cc/80?img=39' },
    { id: 4, nome: 'Clara Vieira', email: 'clara@email.com', tel: '(51) 92345-6789', agendamentos: 21, foto: 'https://i.pravatar.cc/80?img=31' },
    { id: 5, nome: 'Beatriz Nunes', email: 'bea@email.com', tel: '(51) 94567-8901', agendamentos: 5, foto: 'https://i.pravatar.cc/80?img=26' },
    { id: 6, nome: 'Sofia Andrade', email: 'sofia@email.com', tel: '(51) 93456-7890', agendamentos: 17, foto: 'https://i.pravatar.cc/80?img=22' },
];

export let profissionais = [
    { id: 1, nome: 'Camila R.', role: 'Colorista & Cabeleireira', foto: 'https://randomuser.me/api/portraits/women/21.jpg', nota: 4.9, ativo: true },
    { id: 2, nome: 'Priya A.', role: 'Cabeleireira', foto: 'https://randomuser.me/api/portraits/women/33.jpg', nota: 4.8, ativo: true },
    { id: 3, nome: 'Lucas T.', role: 'Barbeiro', foto: 'https://randomuser.me/api/portraits/men/45.jpg', nota: 4.7, ativo: true },
    { id: 4, nome: 'Aline F.', role: 'Manicure & Pedicure', foto: 'https://randomuser.me/api/portraits/women/57.jpg', nota: 4.9, ativo: true },
    { id: 5, nome: 'Renata M.', role: 'Design & Estética', foto: 'https://randomuser.me/api/portraits/women/10.jpg', nota: 4.8, ativo: false },
    { id: 6, nome: 'Diego P.', role: 'Cabeleireiro', foto: 'https://randomuser.me/api/portraits/men/22.jpg', nota: 4.6, ativo: true },
];
export const perguntasPendentes = [
    { cliente: 'Ana Costa', pergunta: 'Quais produtos são usados na coloração?', data: '05/06/2025' },
    { cliente: 'Julia Moraes', pergunta: 'Vocês oferecem pacotes promocionais?', data: '04/06/2025' },
    { cliente: 'Clara Vieira', pergunta: 'Qual a política de cancelamento?', data: '03/06/2025' },
];
export const catalogo = [
    { id: 1, icon: 'ti-palette', nome: 'Coloração', desc: 'Coloração completa com produtos profissionais.', duracao: '2h30', valor: 'R$ 280' },
    { id: 2, icon: 'ti-cut', nome: 'Corte Feminino', desc: 'Corte personalizado para valorizar seu estilo.', duracao: '1h', valor: 'R$ 90' },
    { id: 3, icon: 'ti-wind', nome: 'Escova & Tratamento', desc: 'Escova modeladora com tratamento hidratante.', duracao: '1h30', valor: 'R$ 120' },
    { id: 4, icon: 'ti-sparkles', nome: 'Manicure', desc: 'Cuidado completo para unhas das mãos.', duracao: '50min', valor: 'R$ 60' },
    { id: 5, icon: 'ti-droplet', nome: 'Hidratação Profunda', desc: 'Máscara nutritiva para recuperar o brilho dos cabelos.', duracao: '1h', valor: 'R$ 95' },
    { id: 6, icon: 'ti-eye', nome: 'Sobrancelha', desc: 'Design de sobrancelha com henna e brow lamination.', duracao: '45min', valor: 'R$ 45' },
];

export const avaliacoesPendentes = [
    { cliente: 'Ana Costa', servico: 'Coloração', prof: 'Camila R.', nota: 5, comentario: 'Adorei o resultado! Ficou perfeito.', data: '05/06/2025' },
    { cliente: 'Julia Moraes', servico: 'Sobrancelha', prof: 'Renata M.', nota: 4, comentario: 'Muito bom, mas demorou um pouco.', data: '04/06/2025' },
    { cliente: 'Clara Vieira', servico: 'Manicure', prof: 'Aline F.', nota: 5, comentario: 'Excelente profissional!', data: '03/06/2025' },
];

export const LABEL = { confirmed: 'Confirmado', pending: 'Pendente', done: 'Concluído', cancelled: 'Cancelado' };
