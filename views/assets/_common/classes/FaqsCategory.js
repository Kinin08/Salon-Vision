import HttpClientBase from './HttpClientBase.js';

export default class FaqsCategory extends HttpClientBase {

    #id;
    #name;
    #active;

    constructor({
        id = null,
        name = null,
        active = 1,
    } = {}) {

        super();

        this.id = id;
        this.name = name;
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

        if (value === null) {
            this.#name = null;
            return;
        }

        if (typeof value !== "string") {
            throw new TypeError("O nome deve ser um texto");
        }

        this.#name = value.trim();
    }

    get active() {
        return this.#active;
    }

    set active(value) {

        const number = Number(value);

        if (number !== 0 && number !== 1) {
            throw new RangeError(
                "Active deve ser 0 ou 1"
            );
        }

        this.#active = number;
    }

    toJSON() {

        return {
            id: this.id,
            name: this.name,
            active: this.active
        };
    }

    async listAll() {
        return this.get("/faqs/categories/list");
    }
    async listFaqAndCategories() {
        return this.get("/faqs/listFaqAndCategories");
    }
    async listById(faqId) {
        return this.get(`/faqs/list/${faqId}`);
    }
    async create(data) {
        return this.postForm("/faqs/create", data);
    }
    async update(faqId, data) {
        return this.putForm(`/faqs/update/${faqId}`, data);
    }
    async softDelete(faqId) {
        return this.delete(`/faqs/delete/${faqId}`);
    }
}