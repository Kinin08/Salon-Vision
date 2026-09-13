import HttpClientBase from './HttpClientBase.js';

export default class FaqsCategory extends HttpClientBase {
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