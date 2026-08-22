import HttpClientBase from './HttpClientBase.js';

export default class Users extends HttpClientBase {
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
        return this.putForm("/users/update", data);
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
    async listEmployee() {
        return this.get("/users/list/employee");
    }
    async listAdmin() {
        return this.get("/users/list/admin");
    }
    async softDelete(userId) {
        return this.delete(`/users/delete/${userId}`);
    }
}