import Appointmants from "../classes/Appointmants.js";

export async function meusAgendamentos() {
    try {

        const appointments = new Appointmants();

        const responseData = await appointments.my();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Agendamentos:", error);

        return [];
    }
}

export async function nextAgendamentos() {
    try {

        const appointments = new Appointmants();

        const responseData = await appointments.next();

        return responseData.data ?? [];

    } catch (error) {

        console.error("Erro ao carregar Agendamentos:", error);

        return [];
    }
}

export async function meusAtendimentos() {
    try {
        const appointments = new Appointmants();

        const responseData = await appointments.myAtend();

        return responseData.data ?? [];

    } catch (error) {
        console.error("Erro ao carregar Atendimentos:", error);

        return [];
    }
}

export async function listAll() {
    try {
        const appointments = new Appointmants();

        const responseData = await appointments.listAll();

        return responseData.data ?? [];

    } catch (error) {
        console.error("Erro ao carregar Atendimentos:", error);

        return [];
    }
}

export async function receitaMensal() {
    try {
        const appointments = new Appointmants();

        const responseData = await appointments.receitaMensal();

        return responseData.data ?? [];

    } catch (error) {
        console.error("Erro ao carregar receita mensal:", error);

        return [];
    }
}
export async function appointmentsByPeriod(period) {
    try {
        const appointments = new Appointmants();

        const responseData = await appointments.appointmentsByPeriod(period);

        return responseData.data ?? [];

    } catch (error) {
        console.error("Erro ao carregar receita mensal:", error);

        return [];
    }
}
