import HttpClientBase from './HttpClientBase.js';

export default class Faqs extends HttpClientBase {

    #id;
    #faqCategoryId;
    #question;
    #active;
    #answer;
    #createIn;

    constructor({
        id = null,
        faqCategoryId = null,
        question = "",
        active = 1,
        answer = "",
        createIn = ""
    } = {}) {

        this.id = id;
        this.faqCategoryId = faqCategoryId;
        this.question = question;
        this.active = active;
        this.answer = answer;
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

    get faqCategoryId() {
        return this.#faqCategoryId;
    }

    set faqCategoryId(value) {

        if (value === null) {
            this.#faqCategoryId = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError(
                "O ID da categoria da FAQ deve ser válido"
            );
        }

        this.#faqCategoryId = number;
    }

    get question() {
        return this.#question;
    }

    set question(value) {

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("A pergunta é obrigatória");
        }

        this.#question = value.trim();
    }

    get answer() {
        return this.#answer;
    }

    set answer(value) {

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("A resposta é obrigatória");
        }

        this.#answer = value.trim();
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

    get createIn() {
        return this.#createIn;
    }

    toJSON() {

        return {
            id: this.id,
            faqCategoryId: this.faqCategoryId,
            question: this.question,
            active: this.active,
            answer: this.answer,
            createIn: this.createIn
        };
    }

    async listAll() {
        return this.get("/faqs/list");
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