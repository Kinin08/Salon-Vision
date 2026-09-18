import HttpClientBase from './HttpClientBase.js';

export default class Users extends HttpClientBase {

    #id;
    #name;
    #email;
    #password;
    #telephone;
    #photo;
    #userTypeId;
    #registrationDate;
    #active;

    constructor({
        id = null,
        name = "",
        email = "",
        password = "",
        telephone = "",
        photo = null,
        userTypeId = null,
        registrationDate = "",
        active = 1
    } = {}) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.telephone = telephone;
        this.photo = photo;
        this.userTypeId = userTypeId;
        this.#registrationDate = registrationDate;
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

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("O nome é obrigatório");
        }

        this.#name = value.trim();
    }

    get email() {
        return this.#email;
    }

    set email(value) {

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("O email é obrigatório");
        }

        const email = value.trim();

        if (!email.includes("@")) {
            throw new TypeError("O email deve ser válido");
        }

        this.#email = email;
    }

    get password() {
        return this.#password;
    }

    set password(value) {

        if (
            typeof value !== "string" ||
            value.trim() === ""
        ) {
            throw new TypeError("A senha é obrigatória");
        }

        this.#password = value;
    }

    get telephone() {
        return this.#telephone;
    }

    set telephone(value) {

        if (value === null || value === "") {
            this.#telephone = null;
            return;
        }

        if (typeof value !== "string") {
            throw new TypeError("O telefone deve ser um texto");
        }

        this.#telephone = value.trim();
    }

    get photo() {
        return this.#photo;
    }

    set photo(value) {

        if (value === null || value === "") {
            this.#photo = null;
            return;
        }

        if (typeof value !== "string") {
            throw new TypeError("A foto deve ser um texto");
        }

        this.#photo = value.trim();
    }

    get userTypeId() {
        return this.#userTypeId;
    }

    set userTypeId(value) {

        if (value === null) {
            this.#userTypeId = null;
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError(
                "O ID do tipo de usuário deve ser válido"
            );
        }

        this.#userTypeId = number;
    }

    get registrationDate() {
        return this.#registrationDate;
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
            email: this.email,
            password: this.password,
            telephone: this.telephone,
            photo: this.photo,
            userTypeId: this.userTypeId,
            registrationDate: this.registrationDate,
            active: this.active
        };
    }

    async me() {
        return this.get("/users/me");
    }

    async login(form) {
        return this.postForm("/users/login", form);
    }

    async loginEmployee(form) {
        return this.postForm("/users/login/employee", form);
    }

    async loginAdmin(form) {
        return this.postForm("/users/login/admin", form);
    }

    async register(data) {
        return this.postForm("/users/register", data);
    }

    async update(data) {
        return this.putForm("/users/update/cliente", data);
    }

    async updateEmployee(data) {
        return this.putForm("/users/update/employee", data);
    }

    async updateAdmin(data) {
        return this.putForm("/users/update/admin", data);
    }

    async listAll() {
        return this.get("/users/list");
    }

    async listById(userId) {
        return this.get(`/users/list/${userId}`);
    }

    async listEmployees() {
        return this.get("/users/list/employee");
    }

    async listAdmins() {
        return this.get("/users/list/admin");
    }

    async softDelete(userId) {
        return this.delete(`/users/delete/${userId}`);
    }
}