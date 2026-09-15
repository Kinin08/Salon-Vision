import ServiceEmployee from "../classes/ServiceEmployee.js";

export async function listServiceEmployeesById(id) {
    try {

        const serviceEmployee = new ServiceEmployee();

        const responseData = await serviceEmployee.listByEmployee(id);

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Funcionário:", error);

        return [];
    }
}