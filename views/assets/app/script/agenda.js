
(function () {
    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const ALL_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:30', '15:30', '17:00', '18:00'];
    const TAKEN_CACHE = {};

    const now = new Date();
    let viewYear = now.getFullYear(), viewMonth = now.getMonth();
    let selectedDate = {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear()
    }; selectedSlot = null;

    function getTaken(y, m, d) {
        const k = `${y}-${m}-${d}`;
        if (!TAKEN_CACHE[k]) {
            TAKEN_CACHE[k] = ALL_SLOTS.filter(() => Math.random() < 0.35);
        }
        return TAKEN_CACHE[k];
    }

    function renderCal() {
        document.getElementById('cal-label').textContent = `${MONTHS[viewMonth]} ${viewYear}`;
        const grid = document.getElementById('cal-grid');
        grid.innerHTML = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
            .map(d => `<span class="text-[9px] tracking-widest uppercase text-gray-400 font-medium py-1.5">${d}</span>`).join('');

        const ty = now.getFullYear(), tm = now.getMonth(), td = now.getDate();
        const first = new Date(viewYear, viewMonth, 1).getDay();
        const total = new Date(viewYear, viewMonth + 1, 0).getDate();

        for (let i = 0; i < first; i++) grid.innerHTML += `<span></span>`;

        for (let d = 1; d <= total; d++) {
            const past = (viewYear < ty) || (viewYear === ty && viewMonth < tm) || (viewYear === ty && viewMonth === tm && d < td);
            const isToday = viewYear === ty && viewMonth === tm && d === td;
            const isSel =
                d === selectedDate.day &&
                viewMonth === selectedDate.month &&
                viewYear === selectedDate.year &&
                !past;
            const hasDot = !past && getTaken(viewYear, viewMonth, d).length < ALL_SLOTS.length;

            let cls = 'relative py-1 text-center text-sm rounded-full transition-all ';
            if (past) {
                cls += 'text-gray-300 cursor-none';
            }
            else if (isToday) {
                cls += 'bg-[#C18057] text-white font-semibold cursor-none select';
            }
            else if (isSel) {
                cls += 'bg-gray-900 text-white cursor-none select';
            }
            else {
                cls += 'text-gray-600 hover:bg-[#f0e0d6] cursor-none select';
            }

            const dot = hasDot && !past ? `<span class="cursor-none absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C18057] opacity-60"></span>` : '';
            const click = past ? '' : `onclick="window.__calSelect(${d})"`;
            grid.innerHTML += `<span class="${cls}" ${click}>${d}${dot}</span>`;
        }

        document.getElementById('cal-prev').disabled = (viewYear === ty && viewMonth === tm);
    }

    function renderSlots() {
        const grid = document.getElementById('slots-grid');
        const btn = document.getElementById('confirm-btn');
        grid.innerHTML = '';
        const ty = now.getFullYear(), tm = now.getMonth(), td = now.getDate();
        const past = (viewYear < ty) || (viewYear === ty && viewMonth < tm) || (viewYear === ty && viewMonth === tm && selectedDate < td);
        if (past) { grid.innerHTML = '<span class="text-gray-300 text-xs">Sem horários disponíveis.</span>'; btn.disabled = true; return; }
        const taken = getTaken(viewYear, viewMonth, selectedDate);
        ALL_SLOTS.forEach(s => {
            const isTaken = taken.includes(s);
            const isSel = s === selectedSlot;
            let cls = 'px-3 py-1 rounded-full text-xs border transition-all ';
            if (isTaken) cls += 'border-gray-200 text-gray-300 line-through cursor-none';
            else if (isSel) cls += 'bg-[#C18057] border-[#C18057] text-white cursor-none';
            else cls += 'border-[#C18057] text-[#C18057] hover:bg-[#C18057] hover:text-white cursor-none';
            const click = isTaken ? '' : `onclick="window.__slotSelect('${s}')"`;
            grid.innerHTML += `<span class="${cls}" ${click}>${s}</span>`;
        });
        btn.disabled = !selectedSlot;
    }

    window.__calSelect = function (d) {
        selectedDate = {
            day: d,
            month: viewMonth,
            year: viewYear
        }; selectedSlot = null;
        document.getElementById('confirm-msg').textContent = '';
        renderCal(); renderSlots();
    };
    window.__slotSelect = function (s) {
        selectedSlot = s;
        document.getElementById('confirm-msg').textContent = '';
        renderSlots();
        document.getElementById('confirm-btn').disabled = false;
    };

    document.getElementById('cal-prev').addEventListener('click', () => {
        viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        const total = new Date(viewYear, viewMonth + 1, 0).getDate();
        if (selectedDate > total) selectedDate = total;
        selectedSlot = null;
        document.getElementById('confirm-msg').textContent = '';
        renderCal(); renderSlots();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
        viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        const total = new Date(viewYear, viewMonth + 1, 0).getDate();
        if (selectedDate > total) selectedDate = total; selectedSlot = null;
        document.getElementById('confirm-msg').textContent = '';
        renderCal(); renderSlots();
    });
    document.getElementById('confirm-btn').addEventListener('click', () => {
        if (!selectedSlot) return;
        document.getElementById('confirm-msg').textContent =
            `✓ Agendado para ${selectedDate} de ${MONTHS[viewMonth]} às ${selectedSlot}`;
        selectedSlot = null; renderSlots();
        document.getElementById('confirm-btn').disabled = true;
    });

    renderCal(); renderSlots();
})();
