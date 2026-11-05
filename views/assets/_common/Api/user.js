import Users from "./../classes/Users.js";

export async function userMe() {
    try {

        const users = new Users();

        const responseData = await users.me();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Usuário:", error);

        return [];
    }
}

export async function update(userData) {
    try {

        const users = new Users();

        const responseData = await users.update(userData);

        return responseData;

    } catch (error) {

        console.error("Erro ao atualizar Usuário:", error);

        return [];
    }
}
export async function updateAdmin(userData) {
    try {

        const users = new Users();

        const responseData = await users.updateAdmin(userData);

        return responseData;

    } catch (error) {

        console.error("Erro ao atualizar Usuário:", error);

        return [];
    }
}
export async function listEmployees() {
    try {

        const users = new Users();

        const responseData = await users.listEmployees();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Usuário:", error);

        return [];
    }
}

export async function listClients() {
    try {

        const users = new Users();

        const responseData = await users.listClients();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Usuário:", error);

        return [];
    }
}

export async function listAdmins() {
    try {

        const users = new Users();

        const responseData = await users.listAdmins();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Usuário:", error);

        return [];
    }
}
export async function updateRole(userId, role) {
    try {

        const users = new Users();

        const responseData = await users.updateRole(userId, role);

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao atualizar cargo do usuário:", error);

        return [];
    }
}
export async function deletarUsuario(userId) {
    try {
        const user = new Users();

        const response = await user.softDelete(userId);

        return response;

    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return null;
    }
}
export async function verificarSenha(password) {
    try {
        const users = new Users();
        return await users.verifyPassword(password);
    } catch (error) {
        console.error("Erro ao verificar senha:", error);
        return null;
    }
}
