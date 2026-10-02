import HttpClientBase from './HttpClientBase.js';

export default class Services extends HttpClientBase {

    #id;
    #name;
    #description;
    #price;
    #durationMinutes;
    #active;

    constructor({
        id = null,
        name = null,
        description = null,
        price = 0,
        duration = 0,
        active = 1
    } = {}) {
        super();

        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.active = active;
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
    get name() {
        return this.#name;
    }

    set name(value) {
        if (value === null || value === "") {
            this.#name = value;
            return;
        }

        if (typeof value !== "string" || value.trim() === "") {
            throw new Error("O nome é obrigatório");
        }

        this.#name = value;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
    if (value === null || value === "") {
        this.#description = value;
        return;
    }

    if (typeof value !== "string" || value.trim() === "") {
        throw new Error("A Descrição é obrigatória");
    }

    this.#description = value;
}

    get price() {
        return this.#price;
    }

    set price(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("O preço deve ser um número não negativo");
        }
        this.#price = number;
    }

    get durationMinutes() {
        return this.#durationMinutes;
    }

    set durationMinutes(value) {

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("O Tempo de duração é obrigatório");
        }

        this.#durationMinutes = value.trim();
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

    toJSON() {

        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            durationMinutes: this.durationMinutes,
            creatactiveeIn: this.active
        };
    }

    async listAll() {
        return this.get("/services/list");
    }
    async listById(serviceId) {
        return this.get(`/services/list/${serviceId}`);
    }
    async create(data) {
        return this.postForm("/services/create", data);
    }
    async update(serviceId, data) {
        return this.putForm(`/services/update/${serviceId}`, data);
    }
    async softDelete(serviceId) {
        return this.delete(`/services/delete/${serviceId}`);
    }
}