/**
 * Salon Vision - Common Utilities
 * Reusable JavaScript utilities
 */

const SalonVision = {
  /**
   * DOM Utilities
   */
  dom: {
    /**
     * Query selector shorthand
     */
    $(selector, context = document) {
      return context.querySelector(selector);
    },

    /**
     * Query selector all shorthand
     */
    $$(selector, context = document) {
      return Array.from(context.querySelectorAll(selector));
    },

    /**
     * Add event listener
     */
    on(element, event, handler, options = {}) {
      if (typeof element === 'string') {
        element = this.$(element);
      }
      if (element) {
        element.addEventListener(event, handler, options);
      }
    },

    /**
     * Add event listener to multiple elements
     */
    onAll(selector, event, handler, options = {}) {
      this.$$(selector).forEach(el => {
        el.addEventListener(event, handler, options);
      });
    },

    /**
     * Toggle class
     */
    toggleClass(element, className) {
      if (typeof element === 'string') {
        element = this.$(element);
      }
      if (element) {
        element.classList.toggle(className);
      }
    },

    /**
     * Add class
     */
    addClass(element, className) {
      if (typeof element === 'string') {
        element = this.$(element);
      }
      if (element) {
        element.classList.add(className);
      }
    },

    /**
     * Remove class
     */
    removeClass(element, className) {
      if (typeof element === 'string') {
        element = this.$(element);
      }
      if (element) {
        element.classList.remove(className);
      }
    },

    /**
     * Check if element has class
     */
    hasClass(element, className) {
      if (typeof element === 'string') {
        element = this.$(element);
      }
      return element ? element.classList.contains(className) : false;
    }
  },

  /**
   * Form Utilities
   */
  form: {
    /**
     * Get form data as object
     */
    getData(form) {
      const formData = new FormData(form);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    },

    /**
     * Validate required fields
     */
    validateRequired(form) {
      const requiredFields = SalonVision.dom.$$('[required]', form);
      const errors = [];
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          errors.push({
            field: field.name || field.id,
            message: 'Este campo é obrigatório'
          });
          field.classList.add('form-input--error');
        } else {
          field.classList.remove('form-input--error');
        }
      });
      
      return errors;
    },

    /**
     * Validate email
     */
    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    /**
     * Validate phone (Brazilian format)
     */
    validatePhone(phone) {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 10 && cleaned.length <= 11;
    },

    /**
     * Format phone number
     */
    formatPhone(value) {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },

    /**
     * Format currency (BRL)
     */
    formatCurrency(value) {
      const number = parseFloat(value) || 0;
      return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
  },

  /**
   * Date Utilities
   */
  date: {
    /**
     * Format date to Brazilian format
     */
    formatBR(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toLocaleDateString('pt-BR');
    },

    /**
     * Format datetime to Brazilian format
     */
    formatDateTimeBR(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toLocaleString('pt-BR');
    },

    /**
     * Format time
     */
    formatTime(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    getRelativeTime(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return 'agora mesmo';
      if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
      if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
      
      return this.formatBR(date);
    }
  },

  /**
   * UI Utilities
   */
  ui: {
    /**
     * Show toast notification
     */
    toast(message, type = 'info', duration = 3000) {
      const container = SalonVision.dom.$('#toast-container') || this.createToastContainer();
      
      const toast = document.createElement('aside');
      toast.className = `alert alert--${type}`;
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `
        <span class="alert__icon">
          ${this.getToastIcon(type)}
        </span>
        <p class="alert__content">${message}</p>
      `;
      
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    /**
     * Create toast container
     */
    createToastContainer() {
      const container = document.createElement('aside');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: var(--space-4);
        right: var(--space-4);
        z-index: var(--z-tooltip);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      `;
      document.body.appendChild(container);
      return container;
    },

    /**
     * Get toast icon
     */
    getToastIcon(type) {
      const icons = {
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      };
      return icons[type] || icons.info;
    },

    /**
     * Open modal
     */
    openModal(modalId) {
      const modal = SalonVision.dom.$(`#${modalId}`);
      const backdrop = SalonVision.dom.$(`#${modalId}-backdrop`);
      
      if (modal) {
        modal.classList.add('is-active');
        if (backdrop) backdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    },

    /**
     * Close modal
     */
    closeModal(modalId) {
      const modal = SalonVision.dom.$(`#${modalId}`);
      const backdrop = SalonVision.dom.$(`#${modalId}-backdrop`);
      
      if (modal) {
        modal.classList.remove('is-active');
        if (backdrop) backdrop.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    },

    /**
     * Toggle dropdown
     */
    toggleDropdown(dropdownId) {
      const dropdown = SalonVision.dom.$(`#${dropdownId}`);
      if (dropdown) {
        dropdown.classList.toggle('is-open');
      }
    },

    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
      SalonVision.dom.$$('.dropdown.is-open').forEach(dropdown => {
        dropdown.classList.remove('is-open');
      });
    },

    /**
     * Show loading state
     */
    showLoading(element) {
      if (typeof element === 'string') {
        element = SalonVision.dom.$(element);
      }
      if (element) {
        element.setAttribute('data-original-content', element.innerHTML);
        element.innerHTML = '<span class="spinner"></span>';
        element.disabled = true;
      }
    },

    /**
     * Hide loading state
     */
    hideLoading(element) {
      if (typeof element === 'string') {
        element = SalonVision.dom.$(element);
      }
      if (element) {
        const originalContent = element.getAttribute('data-original-content');
        if (originalContent) {
          element.innerHTML = originalContent;
          element.removeAttribute('data-original-content');
        }
        element.disabled = false;
      }
    }
  },

  /**
   * Storage Utilities
   */
  storage: {
    /**
     * Set item in localStorage
     */
    set(key, value) {
      try {
        localStorage.setItem(`sv_${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('Storage error:', e);
      }
    },

    /**
     * Get item from localStorage
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(`sv_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Storage error:', e);
        return defaultValue;
      }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
      localStorage.removeItem(`sv_${key}`);
    },

    /**
     * Clear all app storage
     */
    clear() {
      Object.keys(localStorage)
        .filter(key => key.startsWith('sv_'))
        .forEach(key => localStorage.removeItem(key));
    }
  },

  /**
   * Initialize common functionality
   */
  init() {
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this.ui.closeAllDropdowns();
      }
    });

    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.dom.$$('.modal.is-active').forEach(modal => {
          this.ui.closeModal(modal.id);
        });
      }
    });

    // Close modals on backdrop click
    this.dom.onAll('.modal-backdrop', 'click', (e) => {
      const backdropId = e.target.id;
      const modalId = backdropId.replace('-backdrop', '');
      this.ui.closeModal(modalId);
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  SalonVision.init();
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SalonVision;
}
