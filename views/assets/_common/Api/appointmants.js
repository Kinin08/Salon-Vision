import Appointmants from "../classes/Appointmants.js";

export async function meusAgendamentos() {
    try {

        const appointments = new Appointmants();

        const responseData = await appointments.my();
        console.log(responseData);

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
        console.log(responseData);

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
        console.log(responseData);

        return responseData.data ?? [];

    } catch (error) {
        console.error("Erro ao carregar Atendimentos:", error);

        return [];
    }
}
