import ServiceEmployees from "../classes/ServiceEmployee.js";

export async function listServiceEmployees() {
    try {
        const res = await new ServiceEmployees().listAll();
        return Array.isArray(res?.data) ? res.data : [];
    } catch (error) {
        console.error("Erro ao carregar vínculos:", error);
        return [];
    }
}

export async function createServiceEmployee(serviceId, employeeId) {
    try {
        return await new ServiceEmployees().create({ serviceId, employeeId });
    } catch (error) {
        console.error("Erro ao vincular funcionário:", error);
        return { message: "Erro ao vincular funcionário." };
    }
}

export async function deleteServiceEmployee(serviceEmployeeId) {
    try {
        return await new ServiceEmployees().softDelete(serviceEmployeeId);
    } catch (error) {
        console.error("Erro ao remover vínculo:", error);
        return { message: "Erro ao remover vínculo." };
    }
}
export async function listServiceEmployeesById(employeeId) {
    try {
        const res = await new ServiceEmployees().listByEmployeeId(employeeId);
        return Array.isArray(res?.data) ? res.data : [];
    } catch (error) {
        console.error("Erro ao carregar serviços do funcionário:", error);
        return [];
    }
}