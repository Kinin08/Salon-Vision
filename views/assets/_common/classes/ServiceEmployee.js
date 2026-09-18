import HttpClientBase from './HttpClientBase.js';

export default class ServiceEmployee extends HttpClientBase {

    #id;
    #serviceId;
    #employeeId;
    #active;

    constructor({
        id = null,
        serviceId = null,
        employeeId = null,
        active = 1,
    } = {}) {

        this.id = id;
        this.serviceId = serviceId;
        this.employeeId = employeeId;
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
            throw new RangeError(
                "O Id do Serviço deve ser válido"
            );
        }

        this.#serviceId = number;
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
            throw new RangeError("O id do funcionario deve ser válido");
        }

        this.#employeeId = number;
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
            serviceId: this.serviceId,
            employeeId: this.employeeId,
            active: this.active,
        };
    }
    async listAll() {
        return this.get("/services_employees/list");
    }
    async listById(serviceId) {
        return this.get(`/services_employees/list/${serviceId}`);
    }
    async listByService(serviceId) {
        return this.get(`/services_employees/listEmployees/services/${serviceId}`);
    }
    async listByEmployee(employeeId) {
        return this.get(`/services_employees/listEmployees/employee/${employeeId}`);
    }
    async create(data) {
        return this.postForm("/services_employees/create", data);
    }
    async update(serviceId, data) {
        return this.putForm(`/services_employees/update/${serviceId}`, data);
    }
    async softDelete(serviceId) {
        return this.delete(`/services_employees/delete/${serviceId}`);
    }
}