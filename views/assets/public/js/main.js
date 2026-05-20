/**
 * Salon Vision - Public Area Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initForms();
});

/**
 * Header scroll behavior
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    
    if (menuIcon && closeIcon) {
      menuIcon.style.display = isOpen ? 'none' : 'block';
      closeIcon.style.display = isOpen ? 'block' : 'none';
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
      
      if (menuIcon && closeIcon) {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Form handling
 */
function initForms() {
  // Login form
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  // Register form
  const registerForm = document.querySelector('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
  }

  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll('.password-toggle');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        toggle.setAttribute('aria-label', 'Ocultar senha');
      } else if (input) {
        input.type = 'password';
        toggle.setAttribute('aria-label', 'Mostrar senha');
      }
    });
  });

  // Phone mask
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 6) {
        if (value.length === 11) {
          value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
          value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d+)/, '($1) $2');
      }
      
      e.target.value = value;
    });
  });
}

/**
 * Handle login form submission
 */
async function handleLoginSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = form.querySelector('#email').value;
  const password = form.querySelector('#password').value;
  const remember = form.querySelector('#remember')?.checked || false;

  // Validate
  if (!email || !password) {
    SalonVision.ui.toast('Por favor, preencha todos os campos', 'error');
    return;
  }

  // Show loading
  SalonVision.ui.showLoading(submitBtn);

  try {
    // API call would go here
    // const response = await httpClient.post('/auth/login', { email, password });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to dashboard
    window.location.href = '/views/app/dashboard.html';
  } catch (error) {
    SalonVision.ui.toast(error.message || 'Erro ao fazer login', 'error');
  } finally {
    SalonVision.ui.hideLoading(submitBtn);
  }
}

/**
 * Handle register form submission
 */
async function handleRegisterSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = SalonVision.form.getData(form);

  // Validate required fields
  const errors = SalonVision.form.validateRequired(form);
  if (errors.length > 0) {
    SalonVision.ui.toast('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  // Validate email
  if (!SalonVision.form.validateEmail(formData.email)) {
    SalonVision.ui.toast('Por favor, insira um e-mail válido', 'error');
    return;
  }

  // Validate password match
  if (formData.password !== formData.password_confirm) {
    SalonVision.ui.toast('As senhas não coincidem', 'error');
    return;
  }

  // Validate terms
  if (!formData.terms) {
    SalonVision.ui.toast('Você precisa aceitar os termos de uso', 'error');
    return;
  }

  // Show loading
  SalonVision.ui.showLoading(submitBtn);

  try {
    // API call would go here
    // const response = await httpClient.post('/auth/register', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    SalonVision.ui.toast('Conta criada com sucesso!', 'success');
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = '/views/public/login.html';
    }, 1000);
  } catch (error) {
    SalonVision.ui.toast(error.message || 'Erro ao criar conta', 'error');
  } finally {
    SalonVision.ui.hideLoading(submitBtn);
  }
}

/**
 * Handle contact form submission
 */
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = SalonVision.form.getData(form);

  // Validate required fields
  const errors = SalonVision.form.validateRequired(form);
  if (errors.length > 0) {
    SalonVision.ui.toast('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  // Show loading
  SalonVision.ui.showLoading(submitBtn);

  try {
    // API call would go here
    // const response = await httpClient.post('/contact', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    SalonVision.ui.toast('Mensagem enviada com sucesso!', 'success');
    form.reset();
  } catch (error) {
    SalonVision.ui.toast(error.message || 'Erro ao enviar mensagem', 'error');
  } finally {
    SalonVision.ui.hideLoading(submitBtn);
  }
}
