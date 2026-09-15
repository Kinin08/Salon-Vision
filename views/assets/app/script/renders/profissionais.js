
import { listEmployees } from '../../../_common/Api/user.js';
import { listServiceEmployeesById } from '../../../_common/Api/serviceEmployee.js';

export async function renderProfissionais(c) {

    const employees = await listEmployees();

    console.log("Employees:", employees);

    c.innerHTML = `
        <div style="margin-bottom:16px;" class="fade-in">

            <h1 style="font-size:22px;font-weight:500;">
                Nossa <em>Equipe</em>
            </h1>

            <p style="font-size:12px;color:var(--text-dim);margin-top:4px;">
                Conheça os profissionais prontos para cuidar de você.
            </p>

        </div>

        <div class="prof-grid" id="prof-grid"></div>

        <!-- Modal de perfil -->
        <div
            id="prof-modal-overlay"
            class="prof-modal-overlay"
            style="display:none;"
        >
            <div
                class="prof-modal"
                id="prof-modal-content"
            ></div>
        </div>
    `;

    const grid = document.getElementById('prof-grid');
    const modalOverlay = document.getElementById('prof-modal-overlay');
    const modalContent = document.getElementById('prof-modal-content');

    if (!document.getElementById('prof-modal-styles')) {

        const style = document.createElement('style');

        style.id = 'prof-modal-styles';

        style.textContent = `

            .prof-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.55);

                display: flex;
                align-items: center;
                justify-content: center;

                z-index: 1000;
                padding: 16px;

                animation: fadeIn 0.2s ease;
            }

            .prof-modal {
                background: var(--bg, #1c1c1c);

                border-radius: 16px;

                width: 100%;
                max-width: 360px;

                padding: 24px;

                text-align: center;

                position: relative;

                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

                animation: slideUp 0.25s ease;
            }

            .prof-modal-close {
                position: absolute;

                top: 12px;
                right: 12px;

                background: none;
                border: none;

                font-size: 20px;

                cursor: pointer;

                color: var(--text-dim, #999);

                line-height: 1;

                transition: color 0.2s ease;
            }

            .prof-modal-close:hover {
                color: #CA9440;
            }

            .prof-modal-avatar {
                width: 88px;
                height: 88px;

                border-radius: 50%;

                object-fit: cover;

                margin: 0 auto 12px;

                display: block;
            }

            .prof-modal-name {
                font-family: 'Cormorant Garamond', serif;

                font-size: 26px;
                font-weight: 500;

                color: var(--text);

                margin: 4px 0 0;

                line-height: 1.1;
            }

            .prof-modal-role {
                font-size: 11px;

                font-weight: 500;

                letter-spacing: 1.2px;

                text-transform: uppercase;

                color: #CA9440;

                margin-top: 6px;
                margin-bottom: 22px;
            }

            .prof-modal-work-title {
                font-size: 13px;

                font-weight: 500;

                color: var(--text);

                text-align: left;

                margin-top: 22px;
                margin-bottom: 10px;
            }

            .prof-modal-work {
                display: flex;

                flex-wrap: wrap;

                gap: 8px;

                text-align: left;
            }


            .prof-modal-work-item {
                display: inline-flex;

                align-items: center;

                gap: 6px;

                padding: 7px 11px;

                border: 1px solid rgba(202, 148, 64, 0.25);

                border-radius: 8px;

                background: rgba(202, 148, 64, 0.08);

                color: var(--text);

                font-size: 12px;
            }


            .prof-modal-work-item i {
                color: #CA9440;

                font-size: 14px;
            }


            .prof-modal-empty {
                font-size: 12px;

                color: var(--text-dim);

                text-align: left;

                padding: 10px 0;
            }

            .prof-modal-info {
                display: flex;

                flex-direction: column;

                gap: 10px;

                margin-top: 18px;

                text-align: left;
            }


            .prof-modal-info div {
                display: flex;

                align-items: center;

                gap: 10px;

                padding: 9px 11px;

                border-radius: 8px;

                background: rgba(255, 255, 255, 0.025);

                border: 1px solid rgba(255, 255, 255, 0.05);

                color: var(--text-dim);

                font-size: 12px;
            }


            .prof-modal-info i {
                width: 18px;

                text-align: center;

                color: #CA9440;

                font-size: 15px;

                flex-shrink: 0;
            }


            .prof-modal-info div:hover {
                border-color: rgba(202, 148, 64, 0.25);

                background: rgba(202, 148, 64, 0.05);
            }

            @keyframes fadeIn {

                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }

            }


            @keyframes slideUp {

                from {
                    opacity: 0;

                    transform: translateY(12px);
                }

                to {
                    opacity: 1;

                    transform: translateY(0);
                }

            }

        `;

        document.head.appendChild(style);
    }

    async function abrirModal(employee) {

        const serviceEmployees =
            await listServiceEmployeesById(employee.id);
            console.log("Service Employees:", serviceEmployees);

        modalContent.innerHTML = `

            <button
                class="prof-modal-close"
                id="prof-modal-close"
            >
                <i class="ti ti-x"></i>
            </button>

            <img
                src="${employee.photo}"
                class="prof-modal-avatar"
                alt="${employee.name}"
            />

            <p class="prof-modal-name">
                ${employee.name}
            </p>

            <p class="prof-modal-role">
                Funcionário
            </p>

            <div class="prof-modal-work-title">
                Áreas de trabalho
            </div>


            <div class="prof-modal-work">

                ${serviceEmployees.length > 0

                ? serviceEmployees.map(se => `

                            <div class="prof-modal-work-item">

                                <i class="ti ti-scissors"></i>

                                <span>
                                    ${se.service_name}
                                </span>

                            </div>

                        `).join('')

                : `

                            <div class="prof-modal-empty">
                                Nenhum serviço cadastrado.
                            </div>

                        `
            }

            </div>


            <!-- INFORMAÇÕES DO FUNCIONÁRIO -->

            <div class="prof-modal-info">

                ${employee.email

                ? `

                            <div>
                                <i class="ti ti-mail"></i>

                                <span>
                                    ${employee.email}
                                </span>
                            </div>

                        `

                : ''
            }


                ${employee.telephone

                ? `

                            <div>
                                <i class="ti ti-phone"></i>

                                <span>
                                    ${employee.phone}
                                </span>
                            </div>

                        `

                : ''
            }

            </div>

        `;


        modalOverlay.style.display = 'flex';


        document
            .getElementById('prof-modal-close')
            .addEventListener('click', fecharModal);
    }

    function fecharModal() {

        modalOverlay.style.display = 'none';

        modalContent.innerHTML = '';
    }

    modalOverlay.addEventListener('click', (e) => {

        if (e.target === modalOverlay) {

            fecharModal();

        }

    });

    employees.forEach((p, i) => {

        const div = document.createElement('div');

        div.className = 'prof-card fade-in';

        div.style.animationDelay = `${i * 0.06}s`;


        div.innerHTML = `

            <img
                src="${p.photo}"
                class="prof-avatar"
                alt="${p.name}"
            />


            <p class="prof-name">
                ${p.name}
            </p>


            <p class="prof-role">
                Funcionário
            </p>


            <button
                class="btn btn-ghost btn-ver-perfil"
                style="margin-top:10px;font-size:11px;"
                data-employee="${p.id}"
            >

                <i class="ti ti-user"></i>

                Ver Perfil

            </button>

        `;

        div
            .querySelector('.btn-ver-perfil')
            .addEventListener('click', () => abrirModal(p));


        grid.appendChild(div);

    });

}