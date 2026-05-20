/**
 * Salon Vision - HTTP Client Base
 * Base class for API communication
 */

class HttpClientBase {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Get authentication token from storage
   */
  getToken() {
    return localStorage.getItem('sv_token') || sessionStorage.getItem('sv_token');
  }

  /**
   * Set authentication token
   */
  setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem('sv_token', token);
    } else {
      sessionStorage.setItem('sv_token', token);
    }
  }

  /**
   * Remove authentication token
   */
  removeToken() {
    localStorage.removeItem('sv_token');
    sessionStorage.removeItem('sv_token');
  }

  /**
   * Build request headers
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Handle response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Make HTTP request
   */
  async request(method, endpoint, data = null, customHeaders = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(customHeaders);
    
    const config = {
      method,
      headers
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError') {
        const networkError = new Error('Network error. Please check your connection.');
        networkError.status = 0;
        throw networkError;
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, headers = {}) {
    return this.request('GET', endpoint, null, headers);
  }

  /**
   * POST request
   */
  post(endpoint, data, headers = {}) {
    return this.request('POST', endpoint, data, headers);
  }

  /**
   * PUT request
   */
  put(endpoint, data, headers = {}) {
    return this.request('PUT', endpoint, data, headers);
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, headers = {}) {
    return this.request('PATCH', endpoint, data, headers);
  }

  /**
   * DELETE request
   */
  delete(endpoint, headers = {}) {
    return this.request('DELETE', endpoint, null, headers);
  }
}

// Create singleton instance
const httpClient = new HttpClientBase();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HttpClientBase, httpClient };
}
