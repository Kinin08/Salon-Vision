import HttpClientBase from './HttpClientBase.js';

export default class Appointmants extends HttpClientBase {

    #id;
    #clientId;
    #employeeId;
    #serviceId;
    #dateTime;
    #rating;
    #comment;
    #active;
    #status;
    #createIn;

    constructor({
        id = null,
        clientId = null,
        employeeId = null,
        serviceId = null,
        dateTime = "",
        rating = 0,
        comment = "",
        active = 1,
        status = "",
        createIn = ""
    } = {}) {

        this.id = id;
        this.clientId = clientId;
        this.employeeId = employeeId;
        this.serviceId = serviceId;
        this.dateTime = dateTime;
        this.rating = rating;
        this.comment = comment;
        this.active = active;
        this.status = status;
        this.#createIn = createIn;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        if (value === null) {
            this.#id = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError("O ID deve ser válido");
        }

        this.#id = number;
    }

    get clientId() {
        return this.#clientId;
    }

    set clientId(value) {
        if (value === null) {
            this.#clientId = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError("O ID do cliente deve ser válido");
        }

        this.#clientId = number;
    }

    get employeeId() {
        return this.#employeeId;
    }

    set employeeId(value) {
        if (value === null) {
            this.#employeeId = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError("O ID do funcionário deve ser válido");
        }

        this.#employeeId = number;
    }

    get serviceId() {
        return this.#serviceId;
    }

    set serviceId(value) {
        if (value === null) {
            this.#serviceId = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError("O ID do serviço deve ser válido");
        }

        this.#serviceId = number;
    }

    get dateTime() {
        return this.#dateTime;
    }

    set dateTime(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("A data e hora são obrigatórias");
        }

        this.#dateTime = value.trim();
    }

    get rating() {
        return this.#rating;
    }

    set rating(value) {
        const number = Number(value);

        if (!Number.isFinite(number) || number < 0 || number > 5) {
            throw new RangeError("A avaliação deve estar entre 0 e 5");
        }

        this.#rating = number;
    }

    get comment() {
        return this.#comment;
    }

    set comment(value) {
        if (typeof value !== "string") {
            throw new TypeError("O comentário deve ser um texto");
        }

        this.#comment = value.trim();
    }

    get active() {
        return this.#active;
    }

    set active(value) {
        const number = Number(value);

        if (number !== 0 && number !== 1) {
            throw new RangeError("Active deve ser 0 ou 1");
        }

        this.#active = number;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        const validStatuses = [
            "scheduled",
            "confirmed",
            "in_progress",
            "completed",
            "canceled"
        ];

        if (value !== "" && !validStatuses.includes(value)) {
            throw new RangeError("Status inválido");
        }

        this.#status = value;
    }

    get createIn() {
        return this.#createIn;
    }

    toJSON() {
        return {
            id: this.id,
            clientId: this.clientId,
            employeeId: this.employeeId,
            serviceId: this.serviceId,
            dateTime: this.dateTime,
            rating: this.rating,
            comment: this.comment,
            active: this.active,
            status: this.status,
            createIn: this.createIn
        };
    }

    async myAtend() {
        return this.get("/appointments/my-attend");
    }

    async next() {
        return this.get("/appointments/next");
    }

    async my() {
        return this.get("/appointments/history");
    }

    async listAll() {
        return this.get("/appointments/list");
    }

    async create(data) {
        return this.postForm("/appointments/create", data);
    }

    async update(appointmentId, data) {
        return this.putForm(
            `/appointments/update/${appointmentId}`,
            data
        );
    }

    async softDelete(appointmentId) {
        return this.delete(
            `/appointments/delete/${appointmentId}`
        );
    }
}
