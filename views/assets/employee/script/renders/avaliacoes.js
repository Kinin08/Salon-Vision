export function renderAvaliacoes() {

    const content = document.querySelector('.content');

    if (!content) return;

    content.innerHTML = `
        <div class="panel">
            <div class="panel-header">
                <h1 class="panel-title">
                    Central de <em>Avaliações</em>
                </h1>
            </div>

            <p>
                Aqui ficarão as avaliações dos clientes.
            </p>
        </div>
    `;

}