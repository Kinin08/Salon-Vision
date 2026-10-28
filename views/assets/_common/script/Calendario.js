// Salve como: _common/script/Calendario.js
// Calendário real: mês atual, setas para navegar, hoje destacado
// e marcação dos dias que têm agendamento.

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// "2026-10-28 14:00:00" -> Date (o 'T' evita erro no Safari)
function lerData(valor) {
    return new Date(String(valor).replace(' ', 'T'));
}

function chaveDoDia(data) {
    return `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
}

// Estilo próprio da marcação (não depende do seu CSS)
function injetarEstilos() {
    if (document.getElementById('calendario-styles')) return;

    const style = document.createElement('style');
    style.id = 'calendario-styles';
    style.textContent = `
        .cal-day.has-apt {
            position: relative;
            font-weight: 600;
            cursor: pointer;
        }
        .cal-day.has-apt:not(.today) {
            color: var(--gold, #FFCC7F);
            background: rgba(255, 204, 127, 0.12);
        }
        .cal-day.has-apt::after {
            content: '';
            position: absolute;
            bottom: 3px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--gold, #FFCC7F);
        }
        .cal-day.today.has-apt::after {
            background: #000;
        }
    `;
    document.head.appendChild(style);
}

export function montarCalendario({ grid, titulo, anterior, proximo, agendamentos = [] }) {
    if (!grid) return;

    injetarEstilos();

    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth();

    // Quantidade de agendamentos por dia
    const agendamentosPorDia = new Map();
    agendamentos.forEach((a) => {
        if (!a?.date_time) return;

        const data = lerData(a.date_time);
        if (isNaN(data)) return;

        const chave = chaveDoDia(data);
        agendamentosPorDia.set(chave, (agendamentosPorDia.get(chave) || 0) + 1);
    });

    function desenhar() {
        const primeiroDia = new Date(ano, mes, 1);
        const totalDias = new Date(ano, mes + 1, 0).getDate();

        if (titulo) {
            const nomeMes = primeiroDia.toLocaleDateString('pt-BR', { month: 'long' });
            const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
            titulo.innerHTML = `${nomeMesCapitalizado} <em>${ano}</em>`;
        }

        let html = DIAS_SEMANA
            .map(dia => `<div class="cal-day-label">${dia}</div>`)
            .join('');

        // Espaços vazios antes do dia 1
        for (let i = 0; i < primeiroDia.getDay(); i++) {
            html += `<div class="cal-day other"></div>`;
        }

        for (let dia = 1; dia <= totalDias; dia++) {
            const data = new Date(ano, mes, dia);
            const chave = chaveDoDia(data);

            const total = agendamentosPorDia.get(chave) || 0;

            // Hoje e agendamento são independentes: o dia pode ter os dois
            let classe = 'cal-day';
            if (chave === chaveDoDia(hoje)) classe += ' today';
            if (total > 0) classe += ' has-apt';

            const titulo = total > 0
                ? ` title="${total} agendamento${total > 1 ? 's' : ''}"`
                : '';

            html += `<div class="${classe}"${titulo}>${dia}</div>`;
        }

        grid.innerHTML = html;
    }

    anterior?.addEventListener('click', () => {
        mes--;
        if (mes < 0) { mes = 11; ano--; }
        desenhar();
    });

    proximo?.addEventListener('click', () => {
        mes++;
        if (mes > 11) { mes = 0; ano++; }
        desenhar();
    });

    desenhar();
}