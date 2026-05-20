/**
 * Salon Vision - App Area Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDropdowns();
  initTables();
  initCalendar();
  initModals();
});

/**
 * Sidebar functionality
 */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar__toggle');
  const mobileMenuBtn = document.querySelector('.topbar__mobile-menu');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const appMain = document.querySelector('.app-main');
  const topbar = document.querySelector('.topbar');

  if (!sidebar) return;

  // Desktop toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('is-collapsed');
      if (appMain) appMain.classList.toggle('sidebar-collapsed');
      if (topbar) topbar.classList.toggle('sidebar-collapsed');
      
      // Save state
      SalonVision.storage.set('sidebar_collapsed', sidebar.classList.contains('is-collapsed'));
    });
  }

  // Restore state
  const isCollapsed = SalonVision.storage.get('sidebar_collapsed', false);
  if (isCollapsed) {
    sidebar.classList.add('is-collapsed');
    if (appMain) appMain.classList.add('sidebar-collapsed');
    if (topbar) topbar.classList.add('sidebar-collapsed');
  }

  // Mobile toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('is-active');
      document.body.style.overflow = sidebar.classList.contains('is-open') ? 'hidden' : '';
    });
  }

  // Close sidebar on overlay click
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      sidebarOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }

  // Set active nav item
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.sidebar__nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('is-active');
    }
  });
}

/**
 * Dropdown functionality
 */
function initDropdowns() {
  const dropdownTriggers = document.querySelectorAll('[data-dropdown]');
  
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdownId = trigger.getAttribute('data-dropdown');
      const dropdown = document.querySelector(`#${dropdownId}`);
      
      if (dropdown) {
        // Close all other dropdowns
        document.querySelectorAll('.dropdown.is-open').forEach(d => {
          if (d.id !== dropdownId) d.classList.remove('is-open');
        });
        
        dropdown.classList.toggle('is-open');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.is-open').forEach(d => {
      d.classList.remove('is-open');
    });
  });
}

/**
 * Data tables functionality
 */
function initTables() {
  const tables = document.querySelectorAll('.data-table-wrapper');
  
  tables.forEach(tableWrapper => {
    const searchInput = tableWrapper.querySelector('.data-table-search input');
    const table = tableWrapper.querySelector('.data-table');
    
    if (searchInput && table) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }

    // Sort functionality
    const sortHeaders = tableWrapper.querySelectorAll('th[data-sort]');
    sortHeaders.forEach(header => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        const sortKey = header.getAttribute('data-sort');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = header.classList.contains('sort-asc');
        
        // Reset all headers
        sortHeaders.forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Sort rows
        rows.sort((a, b) => {
          const aVal = a.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;
          const bVal = b.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent;
          
          if (isAsc) {
            return bVal.localeCompare(aVal);
          }
          return aVal.localeCompare(bVal);
        });
        
        // Update header class
        header.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
        
        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
      });
    });
  });
}

/**
 * Calendar functionality
 */
function initCalendar() {
  const calendar = document.querySelector('.calendar');
  if (!calendar) return;

  let currentDate = new Date();
  let selectedDate = new Date();

  const titleEl = calendar.querySelector('.calendar__title');
  const gridEl = calendar.querySelector('.calendar__grid');
  const prevBtn = calendar.querySelector('[data-calendar-prev]');
  const nextBtn = calendar.querySelector('[data-calendar-next]');
  const todayBtn = calendar.querySelector('[data-calendar-today]');

  function renderCalendar() {
    if (!gridEl) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update title
    if (titleEl) {
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      titleEl.textContent = `${monthNames[month]} ${year}`;
    }

    // Clear grid (keep weekday headers)
    const weekdays = gridEl.querySelectorAll('.calendar__weekday');
    gridEl.innerHTML = '';
    weekdays.forEach(wd => gridEl.appendChild(wd));

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Get days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Add weekday headers if not present
    if (weekdays.length === 0) {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      dayNames.forEach(day => {
        const dayEl = document.createElement('span');
        dayEl.className = 'calendar__weekday';
        dayEl.textContent = day;
        gridEl.appendChild(dayEl);
      });
    }

    // Add days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const dayEl = createDayElement(prevMonthLastDay - i, true);
      gridEl.appendChild(dayEl);
    }

    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === today.getDate() && 
                      month === today.getMonth() && 
                      year === today.getFullYear();
      const isSelected = day === selectedDate.getDate() && 
                         month === selectedDate.getMonth() && 
                         year === selectedDate.getFullYear();
      
      const dayEl = createDayElement(day, false, isToday, isSelected);
      dayEl.addEventListener('click', () => {
        selectedDate = new Date(year, month, day);
        renderCalendar();
        onDateSelect(selectedDate);
      });
      gridEl.appendChild(dayEl);
    }

    // Add days from next month
    const remainingDays = 42 - (startDay + totalDays);
    for (let day = 1; day <= remainingDays; day++) {
      const dayEl = createDayElement(day, true);
      gridEl.appendChild(dayEl);
    }
  }

  function createDayElement(day, isOtherMonth, isToday = false, isSelected = false) {
    const dayEl = document.createElement('span');
    dayEl.className = 'calendar__day';
    if (isOtherMonth) dayEl.classList.add('calendar__day--other-month');
    if (isToday) dayEl.classList.add('calendar__day--today');
    if (isSelected) dayEl.classList.add('calendar__day--selected');
    
    const numberEl = document.createElement('span');
    numberEl.className = 'calendar__day-number';
    numberEl.textContent = day;
    dayEl.appendChild(numberEl);

    // Add sample events (would come from API)
    if (!isOtherMonth && Math.random() > 0.7) {
      const eventsEl = document.createElement('span');
      eventsEl.className = 'calendar__day-events';
      const eventEl = document.createElement('span');
      eventEl.className = 'calendar__event';
      eventEl.textContent = '09:00 - Corte';
      eventsEl.appendChild(eventEl);
      dayEl.appendChild(eventsEl);
    }

    return dayEl;
  }

  function onDateSelect(date) {
    // Update appointments list
    const appointmentsList = document.querySelector('.appointments-list');
    if (appointmentsList) {
      const title = appointmentsList.querySelector('.appointments-list__title');
      if (title) {
        title.textContent = `Agendamentos - ${SalonVision.date.formatBR(date)}`;
      }
    }
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date();
      selectedDate = new Date();
      renderCalendar();
    });
  }

  // Initial render
  renderCalendar();
}

/**
 * Modal functionality
 */
function initModals() {
  // Open modal buttons
  const openModalBtns = document.querySelectorAll('[data-modal-open]');
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-open');
      SalonVision.ui.openModal(modalId);
    });
  });

  // Close modal buttons
  const closeModalBtns = document.querySelectorAll('[data-modal-close]');
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        SalonVision.ui.closeModal(modal.id);
      }
    });
  });
}

/**
 * Form handlers for app area
 */
function handleNewAppointment(formData) {
  // API call would go here
  console.log('New appointment:', formData);
  SalonVision.ui.toast('Agendamento criado com sucesso!', 'success');
}

function handleNewClient(formData) {
  // API call would go here
  console.log('New client:', formData);
  SalonVision.ui.toast('Cliente cadastrado com sucesso!', 'success');
}

function handleNewProduct(formData) {
  // API call would go here
  console.log('New product:', formData);
  SalonVision.ui.toast('Produto cadastrado com sucesso!', 'success');
}
