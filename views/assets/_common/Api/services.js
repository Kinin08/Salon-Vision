import Services from "./../classes/Services.js";

export async function porcentageOfServices() {
    try {

        const service = new Services();

        const responseData = await service.porcentageOfServices();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar porcentagem de serviços:", error);

        return [];
    }
}
