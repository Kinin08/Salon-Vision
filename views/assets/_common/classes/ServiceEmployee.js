import HttpClientBase from './HttpClientBase.js';

export default class ServiceEmployee extends HttpClientBase {
    async listAll() {
        return this.get("/services_employees/list");
    }
    async listById(serviceId) {
        return this.get(`/services_employees/list/${serviceId}`);
    }
    async listByService(serviceId) {
        return this.get(`/services_employees/listEmployees/services/${serviceId}`);
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