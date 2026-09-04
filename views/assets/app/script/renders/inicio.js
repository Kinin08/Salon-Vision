import { abrirModal } from '../modals.js';
import { navegarPara } from '../helpers.js';

import { meusAgendamentos } from './agendamentos.js';
import { myData } from '../perfil.js';
import { renderServicos } from './servicos.js';
import { renderProfissionais } from './profissionais.js';
import { renderPerfil } from './perfil.js';

export async function renderInicio(container) {

    const responseAgenda = await meusAgendamentos();

    const responseUser = await myData();
    console.log(responseUser)
    console.log(responseAgenda)

    const nome = responseUser?.data?.name ?? 'Usuário';


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
                                Hoje
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
                                3
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
                                Atendimentos
                            </p>

                            <h2 style="
                                margin-top: 6px;
                                font-size: 20px;
                            ">
                                8
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
                            Corte + Escova
                        </p>

                        <p style="
                            color: var(--text-muted);
                            font-size: 12px;
                            margin-top: 6px;
                        ">
                            Com Ana Silva
                        </p>
                    </div>

                    <div style="text-align: right;">

                        <p style="
                            color: var(--gold);
                            font-size: 16px;
                            font-weight: 600;
                        ">
                            Hoje às 14:30
                        </p>

                        <p style="
                            color: var(--text-muted);
                            font-size: 12px;
                            margin-top: 5px;
                        ">
                            Duração: 1h
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

    // Novo agendamento
    document
        .getElementById('btnNovoAgendamentoInicio')
        ?.addEventListener('click', () => {
            abrirModal();
        });
}