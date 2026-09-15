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
        console.log("RESPOSTA UPDATE:", responseData);

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