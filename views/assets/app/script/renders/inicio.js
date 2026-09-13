import { abrirModal } from '../modals.js';
import { navegarPara } from '../helpers.js';

import { meusAgendamentos, meusAtendimentos, nextAgendamentos, renderAgendamentos } from './agendamentos.js';
import Users from "../../../_common/classes/Users.js";
import { renderServicos } from './servicos.js';
import { renderProfissionais } from './profissionais.js';
import { renderPerfil } from './perfil.js';

export async function renderInicio(container) {
    const user = new Users();

    const responseData = await user.me();

    const nome = responseData?.data?.name ?? 'Usuário';


    const agendamentos = await meusAgendamentos();
    const atendimentos = await meusAtendimentos();
    const proximo = await nextAgendamentos();

    container.innerHTML = `
        <div class="panel fade-in">

            <div class="panel-header">
                <div>
                    <h1 class="panel-title">
                        Olá, <em>${nome}!</em>
                    </h1>

                    <p style="
                        color: var(--text-muted);
                        font-size: 13px;
                        margin-top: 6px;
                    ">
                        Seja bem-vinda de volta ao Salon Vision.
                    </p>
                </div>

                <button class="btn btn-gold" id="btnNovoAgendamentoInicio">
                    <i class="ti ti-calendar-plus"></i>
                    Novo Agendamento
                </button>
            </div>

            <!-- RESUMO -->
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 14px;
                margin-bottom: 24px;
            ">

                <div class="panel" style="margin: 0;">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <div>
                            <p style="
                                color: var(--text-muted);
                                font-size: 12px;
                            ">
                                Próximo agendamento
                            </p>

                            <h2 style="
                                margin-top: 6px;
                                font-size: 20px;
                            ">
                                ${proximo && !Array.isArray(proximo)
            ? new Date(proximo.date_time).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            })
            : 'Nenhum'}
                            </h2>
                        </div>

                        <i class="ti ti-calendar"
                           style="font-size: 28px; color: var(--gold);">
                        </i>
                    </div>
                </div>

                <div class="panel" style="margin: 0;">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <div>
                            <p style="
                                color: var(--text-muted);
                                font-size: 12px;
                            ">
                                Agendamentos
                            </p>

                            <h2 style="
                                margin-top: 6px;
                                font-size: 20px;
                            ">
                                ${agendamentos.length}
                            </h2>
                        </div>

                        <i class="ti ti-calendar-event"
                           style="font-size: 28px; color: var(--gold);">
                        </i>
                    </div>
                </div>

                <div class="panel" style="margin: 0;">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <div>
                            <p style="
                                color: var(--text-muted);
                                font-size: 12px;
                            ">
                                Atendimentos concluídos
                            </p>

                            <h2 style="
                                margin-top: 6px;
                                font-size: 20px;
                            ">
                                ${atendimentos.length}
                            </h2>
                        </div>

                        <i class="ti ti-scissors"
                           style="font-size: 28px; color: var(--gold);">
                        </i>
                    </div>
                </div>

            </div>

            <!-- PRÓXIMO AGENDAMENTO -->
            <div class="panel" style="margin-bottom: 20px;">

                <div class="panel-header">
                    <h2 class="panel-title">
                        Próximo <em>Agendamento</em>
                    </h2>
                </div>

                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 10px 0;
                    flex-wrap: wrap;
                ">

                    <div>
                        <p style="
                            font-size: 16px;
                            font-weight: 600;
                        ">
                            ${proximo && !Array.isArray(proximo)
            ? proximo.service_name
            : 'Nenhum agendamento futuro'
        }
                        </p>

                        <p style="
                            color: var(--text-muted);
                            font-size: 13px;
                            margin-top: 8px;
                        ">
                            ${proximo && !Array.isArray(proximo)
            ? `Com ${proximo.employee_name}`
            : ''
        }
                        </p>
                    </div>

                    <div style="text-align: right;">
                        <p style="
                            color: var(--text-muted);
                            font-size: 13px;
                            font-weight: 500;
                        ">
                        data e hora:
                        </p>
                        <p style="
                            color: var(--gold);
                            font-size: 16px;
                            font-weight: 600;
                        ">
                        ${proximo && !Array.isArray(proximo)
            ? new Date(proximo.date_time).toLocaleString('pt-BR', {
                dateStyle: 'short', timeStyle: 'short'
            })
            : 'Nenhum agendamento futuro'
        }
                        </p>

                        <p style="
                            color: var(--text-muted);
                            font-size: 12px;
                            margin-top: 5px;
                        ">
                            Duração: ${proximo && !Array.isArray(proximo)
            ? `${proximo.service_duration} minutos`
            : 'N/A'
        }
                        </p>

                    </div>

                </div>

            </div>

            <!-- ACESSOS RÁPIDOS -->
            <div class="panel">

                <div class="panel-header">
                    <h2 class="panel-title">
                        Acessos <em>Rápidos</em>
                    </h2>
                </div>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 12px;
                ">

                    <button
                        class="btn btn-ghost"
                        id="btnAgendamentosInicio"
                        style="padding: 16px; text-align: left;"
                    >
                        <i class="ti ti-calendar-event"></i>
                        Meus Agendamentos
                    </button>

                    <button
                        class="btn btn-ghost"
                        id="btnServicosInicio"
                        style="padding: 16px; text-align: left;"
                    >
                        <i class="ti ti-scissors"></i>
                        Ver Serviços
                    </button>

                    <button
                        class="btn btn-ghost"
                        id="btnProfissionaisInicio"
                        style="padding: 16px; text-align: left;"
                    >
                        <i class="ti ti-users"></i>
                        Profissionais
                    </button>

                    <button
                        class="btn btn-ghost"
                        id="btnPerfilInicio"
                        style="padding: 16px; text-align: left;"
                    >
                        <i class="ti ti-user"></i>
                        Meu Perfil
                    </button>

                </div>

            </div>

        </div>
    `;

    document
        .getElementById('btnNovoAgendamentoInicio')
        ?.addEventListener('click', () => {
            abrirModal();
        });

    document
        .getElementById('btnAgendamentosInicio')
        ?.addEventListener('click', () => {
            navegarPara(renderAgendamentos);
        });

    document
        .getElementById('btnServicosInicio')
        ?.addEventListener('click', () => {
            renderServicos(container);
        });

    document
        .getElementById('btnProfissionaisInicio')
        ?.addEventListener('click', () => {
            renderProfissionais(container);
        });

    document
        .getElementById('btnPerfilInicio')
        ?.addEventListener('click', () => {
            renderPerfil(container);
        });
}