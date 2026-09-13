import HttpClientBase from './HttpClientBase.js';

export default class Services extends HttpClientBase {
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