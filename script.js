let bookingData = {
    barber: '',
    service: '',
    price: 0,
    date: '',
    time: '',
    clientName: '',
    clientPhone: ''
};

let courseData = {
    phone: '',
    location: '',
    email: '',
    password: '',
    type: '',
    schedule: ''
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const holidays = [
    '2025-01-01',
    '2025-04-18',
    '2025-04-20',
    '2025-04-25',
    '2025-05-01',
    '2025-06-10',
    '2025-06-19',
    '2025-08-15',
    '2025-10-05',
    '2025-11-01',
    '2025-12-01',
    '2025-12-08',
    '2025-12-25'
];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function selectBarber(barber) {
    bookingData.barber = barber;
    showPage('service-selection');
}

function selectService(service, price) {
    bookingData.service = service;
    bookingData.price = price;
    showPage('date-selection');
    renderCalendar();
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const weekdaysContainer = document.createElement('div');
    weekdaysContainer.className = 'calendar-weekdays';
    weekDays.forEach(day => {
        const weekday = document.createElement('div');
        weekday.className = 'calendar-weekday';
        weekday.textContent = day;
        weekdaysContainer.appendChild(weekday);
    });
    calendar.parentElement.insertBefore(weekdaysContainer, calendar);
    
    const existingWeekdays = document.querySelectorAll('.calendar-weekdays');
    if (existingWeekdays.length > 1) {
        existingWeekdays[0].remove();
    }
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dayOfWeek === 0 || dayOfWeek === 1 || holidays.includes(dateString) || date < today) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.onclick = () => selectDate(day);
        }
        
        calendar.appendChild(dayElement);
    }
}

function selectDate(day) {
    bookingData.date = `${day}/${currentMonth + 1}/${currentYear}`;
    showPage('time-selection');
    renderTimeSlots();
}

function renderTimeSlots() {
    const morningSlots = document.getElementById('morning-slots');
    const afternoonSlots = document.getElementById('afternoon-slots');
    
    morningSlots.innerHTML = '';
    afternoonSlots.innerHTML = '';
    
    for (let hour = 8; hour < 12; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
            const slot = createTimeSlot(time);
            morningSlots.appendChild(slot);
        }
    }
    
    for (let hour = 14; hour < 19; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
            const slot = createTimeSlot(time);
            afternoonSlots.appendChild(slot);
        }
    }
}

function createTimeSlot(time) {
    const slot = document.createElement('div');
    slot.className = 'time-slot';
    slot.textContent = time;
    slot.onclick = () => selectTime(time);
    return slot;
}

function selectTime(time) {
    bookingData.time = time;
    showPage('client-info');
    setupPhoneValidation('client-phone', 'client-country-code');
}

function setupPhoneValidation(phoneInputId, countrySelectId) {
    const phoneInput = document.getElementById(phoneInputId);
    const countrySelect = document.getElementById(countrySelectId);
    
    function updateMaxLength() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const maxLength = selectedOption.getAttribute('data-length');
        phoneInput.setAttribute('maxlength', maxLength);
    }
    
    updateMaxLength();
    
    countrySelect.addEventListener('change', updateMaxLength);
    
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

document.getElementById('client-form').addEventListener('submit', function(e) {
    e.preventDefault();
    bookingData.clientName = document.getElementById('client-name').value;
    const countryCode = document.getElementById('client-country-code').value;
    const phone = document.getElementById('client-phone').value;
    bookingData.clientPhone = countryCode + ' ' + phone;
    
    const message = document.getElementById('thank-you-message');
    message.textContent = 'Iremos enviar uma mensagem para o seu telemóvel a relembrar a sua marcação';
    
    showPage('thank-you');
});

document.getElementById('course-registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const countryCode = document.getElementById('course-country-code').value;
    const phone = document.getElementById('course-phone').value;
    courseData.phone = countryCode + ' ' + phone;
    courseData.location = document.getElementById('course-location').value;
    courseData.email = document.getElementById('course-email').value;
    courseData.password = document.getElementById('course-password').value;
    
    const message = document.getElementById('thank-you-message');
    if (courseData.type === 'online') {
        message.textContent = 'Iremos enviar uma mensagem para o seu telemóvel com todas as informações para a aula online';
    } else {
        message.textContent = 'Iremos enviar uma mensagem para o seu telemóvel com todas as informações para a aula presencial';
    }
    
    showPage('thank-you');
});

function selectCourseType(type) {
    courseData.type = type;
    showPage('course-schedule');
    renderCourseSchedule(type);
}

function renderCourseSchedule(type) {
    const scheduleContent = document.getElementById('schedule-content');
    scheduleContent.innerHTML = '';
    
    if (type === 'online') {
        const onlineSchedule = [
            { day: 'Segunda-feira', times: ['10:00 - 11:30', '15:30 - 16:00', '19:30 - 20:00', '21:00 - 22:30'] },
            { day: 'Quarta-feira', times: ['10:00 - 11:30', '15:30 - 16:00', '19:30 - 20:00', '21:00 - 22:30'] },
            { day: 'Sexta-feira', times: ['10:00 - 11:30', '15:30 - 16:00', '19:30 - 20:00', '21:00 - 22:30'] }
        ];
        
        onlineSchedule.forEach(schedule => {
            const section = document.createElement('div');
            section.className = 'schedule-section';
            
            const title = document.createElement('h3');
            title.textContent = schedule.day;
            section.appendChild(title);
            
            schedule.times.forEach(time => {
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `<p>${time}</p>`;
                item.onclick = () => selectCourseSchedule(`${schedule.day} - ${time}`);
                section.appendChild(item);
            });
            
            scheduleContent.appendChild(section);
        });
    } else {
        const presencialSchedule = [
            { day: 'Terça-feira', times: ['20:00 - 22:00'] },
            { day: 'Quinta-feira', times: ['20:00 - 22:00'] },
            { day: 'Sábado', times: ['09:00 - 11:00'] }
        ];
        
        presencialSchedule.forEach(schedule => {
            const section = document.createElement('div');
            section.className = 'schedule-section';
            
            const title = document.createElement('h3');
            title.textContent = schedule.day;
            section.appendChild(title);
            
            schedule.times.forEach(time => {
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `<p>${time}</p>`;
                item.onclick = () => selectCourseSchedule(`${schedule.day} - ${time}`);
                section.appendChild(item);
            });
            
            scheduleContent.appendChild(section);
        });
    }
}

function selectCourseSchedule(schedule) {
    courseData.schedule = schedule;
    showPage('course-registration');
    setupPhoneValidation('course-phone', 'course-country-code');
}
