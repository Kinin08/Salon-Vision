export async function renderServicos(c) {
    c.innerHTML = `
    <div class="panel fade-in">

        <div class="panel-header">
            <h1 class="panel-title">Nossos <em>Serviços</em></h1>
        </div>

        <div id="services-list"
            style="
                display:grid;
                grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
                gap:16px;
            ">
        </div>

    </div>
    `;

    const list = document.getElementById('services-list');

    let allServices = [];

    function renderList(data) {
        list.innerHTML = '';

        data.forEach(service => {
            const item = document.createElement('div');

            item.innerHTML = `
            <div class="service-card">

                <div class="service-card-icon">
                    <i class="ti ti-scissors"></i>
                </div>

                <p class="service-card-name">
                    ${service.name}
                </p>

                <p class="service-card-desc">
                    ${service.description || 'Sem descrição'}
                </p>

                <div class="service-card-meta">
                    <span class="service-meta-item">
                        <i class="ti ti-clock"></i>
                        ${service.durationMinutes} min
                    </span>
                </div>

                <p class="service-price">
                    R$ ${Number(service.price).toFixed(2)}
                </p>


            </div>
            `;

            list.appendChild(item);
        });

        document.querySelectorAll('[data-servico]').forEach(btn => {
            btn.onclick = () => {
                abrirModal(btn.dataset.servico);
            };
        });
    }

    async function loadServices() {
        try {
            const response = await fetch(
                'http://localhost/Salon-Vision/api/services/list'
            );

            const data = await response.json();

            console.log(data);

            allServices = data.data || [];

            renderList(allServices);

        } catch (error) {
            console.error(error);

            list.innerHTML = `
                <p>Erro ao carregar serviços.</p>
            `;
        }
    }

    await loadServices();
}