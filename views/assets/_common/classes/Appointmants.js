import HttpClientBase from './HttpClientBase.js';

export default class Appointmants extends HttpClientBase {
    async my() {
        return this.get("/appointments/my");
    }
    async listAll() {
        return this.get("/appointments/list");
    }
    async create(data) {
        return this.postForm("/appointments/create", data);
    }
    async update(appointmentId, data) {
        return this.putForm(`/appointments/update/${appointmentId}`, data);
    }
    async softDelete(appointmentId) {
        return this.delete(`/appointments/delete/${appointmentId}`);
    }
}