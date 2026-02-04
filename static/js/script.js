document.addEventListener('DOMContentLoaded', function() {
    // Навигация по турнирной сетке
    const bracketNavBtns = document.querySelectorAll('.bracket-nav-btn');
    const bracketStages = document.querySelectorAll('.bracket-stage');
    
    if (bracketNavBtns.length > 0) {
        bracketNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const stage = this.dataset.stage;
                
                // Удаляем активный класс у всех кнопок
                bracketNavBtns.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                // Скрываем все этапы
                bracketStages.forEach(stage => stage.classList.remove('active'));
                // Показываем выбранный этап
                document.getElementById(stage).classList.add('active');
            });
        });
    }
    
    // Фильтрация расписания
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scheduleMatches = document.querySelectorAll('.schedule-match');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Удаляем активный класс у всех кнопок
                filterBtns.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                // Фильтруем матчи
                scheduleMatches.forEach(match => {
                    if (filter === 'all') {
                        match.style.display = 'flex';
                    } else if (match.classList.contains(filter)) {
                        match.style.display = 'flex';
                    } else {
                        match.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Имитация live обновления матчей
    function updateLiveMatches() {
        const liveMatches = document.querySelectorAll('.match-card.live, .schedule-match.live');
        
        liveMatches.forEach(match => {
            const oddsElements = match.querySelectorAll('.team-odds');
            if (oddsElements.length >= 2) {
                // Небольшое случайное изменение коэффициентов для эффекта live
                oddsElements[0].textContent = (Math.random() * 0.2 + 2.1).toFixed(2);
                oddsElements[1].textContent = (Math.random() * 0.2 + 1.6).toFixed(2);
            }
        });
    }
    
    // Обновляем live матчи каждые 10 секунд
    setInterval(updateLiveMatches, 10000);
    
    // Обработка кнопок "Напомнить"
    const reminderBtns = document.querySelectorAll('.btn-reminder');
    
    reminderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const matchElement = this.closest('.schedule-match, .match-card');
            const matchName = matchElement.querySelector('.match-teams, .match-details h3').textContent;
            
            // Сохраняем в localStorage
            const reminders = JSON.parse(localStorage.getItem('matchReminders') || '[]');
            reminders.push({
                match: matchName,
                time: new Date().toLocaleString()
            });
            localStorage.setItem('matchReminders', JSON.stringify(reminders));
            
            // Меняем текст кнопки
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Напоминание установлено';
            this.style.backgroundColor = '#2ed573';
            this.style.pointerEvents = 'none';
            
            // Восстанавливаем через 3 секунды
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.pointerEvents = '';
            }, 3000);
            
            // Показываем уведомление
            showNotification('Напоминание установлено на матч: ' + matchName);
        });
    });
    
    // Функция показа уведомления
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#1a1a2e';
        notification.style.color = '#fff';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        notification.style.borderLeft = '4px solid #00a8ff';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '400px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Загрузка данных через API (если нужно)
    function loadBracketData() {
        fetch('/api/bracket')
            .then(response => response.json())
            .then(data => {
                console.log('Bracket data loaded:', data);
                // Здесь можно обновить UI с новыми данными
            })
            .catch(error => console.error('Error loading bracket data:', error));
    }
    
    function loadScheduleData() {
        fetch('/api/schedule')
            .then(response => response.json())
            .then(data => {
                console.log('Schedule data loaded:', data);
                // Здесь можно обновить UI с новыми данными
            })
            .catch(error => console.error('Error loading schedule data:', error));
    }
    
    // Загружаем данные при необходимости
    // loadBracketData();
    // loadScheduleData();
});
function handleImageError(img) {
    img.src = '/static/images/players/default.jpg';
    img.onerror = null; // предотвращаем бесконечный цикл
}

// Инициализация после загрузки
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img[onerror*="handleImageError"]').forEach(img => {
        img.onerror = function() {
            handleImageError(this);
        };
    });
});
// Функция для обработки ошибок загрузки логотипов команд
function handleTeamLogoError(img) {
    const teamName = img.alt || '';
    const firstLetter = teamName.charAt(0).toUpperCase();
    const colors = ['#00a8ff', '#2ed573', '#ff9f1a', '#9b59b6', '#ff3838'];
    const colorIndex = teamName.length % colors.length;
    
    // Создаем canvas с инициалом команды
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 90; // Размер логотипа
    
    canvas.width = size;
    canvas.height = size;
    
    // Рисуем круг
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 5, 0, Math.PI * 2);
    ctx.fillStyle = colors[colorIndex];
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Добавляем текст
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(firstLetter, size/2, size/2);
    
    // Заменяем изображение на canvas
    img.style.display = 'none';
    img.parentNode.appendChild(canvas);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Находим все логотипы команд
    const teamLogos = document.querySelectorAll('.team-logo-large-img, .team-logo-img, .team-logo-small');
    
    teamLogos.forEach(img => {
        // Проверяем, загрузилось ли изображение
        if (img.complete && img.naturalHeight === 0) {
            // Изображение не загрузилось
            handleTeamLogoError(img);
        } else {
            // Добавляем обработчик на будущие ошибки
            img.onerror = function() {
                handleTeamLogoError(this);
            };
        }
    });
});
// В существующий script.js добавьте:

// Обработка кликов на матчи в расписании
function initScheduleInteractions() {
    const scheduleMatches = document.querySelectorAll('.schedule-match-link');
    
    scheduleMatches.forEach(matchLink => {
        matchLink.addEventListener('click', function(e) {
            // Уже есть ссылка, ничего дополнительного не нужно
            // Но можно добавить анимацию или подтверждение
            console.log('Переход к деталям матча');
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Добавьте эту строку
    if (document.querySelector('.schedule-page')) {
        initScheduleInteractions();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Функция переключения вкладок
    function switchTab(event) {
        event.preventDefault();
        
        // Удаляем активный класс со всех вкладок
        document.querySelectorAll('.tab-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем активный класс текущей вкладке
        event.currentTarget.classList.add('active');
        
        // Скрываем все панели
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Показываем выбранную панель
        const tabId = event.currentTarget.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    }
    
    // Назначаем обработчики на все вкладки
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', switchTab);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем высоту для вертикальных линий
    function updateConnectorLines() {
        const semifinals = document.querySelectorAll('.match-wrapper[data-match-id^="semifinal"]');
        const final = document.querySelector('.final');
        
        if (semifinals.length === 2 && final) {
            const semifinal1 = semifinals[0];
            const semifinal2 = semifinals[1];
            const finalRect = final.getBoundingClientRect();
            const semifinal1Rect = semifinal1.getBoundingClientRect();
            const semifinal2Rect = semifinal2.getBoundingClientRect();
            
            // Рассчитываем высоту для вертикальных линий
            const distance1 = Math.abs(finalRect.top - semifinal1Rect.bottom) + 20;
            const distance2 = Math.abs(semifinal2Rect.top - finalRect.bottom) + 20;
            
            // Обновляем CSS переменные
            document.documentElement.style.setProperty('--distance-1', distance1 + 'px');
            document.documentElement.style.setProperty('--distance-2', distance2 + 'px');
        }
    }
    
    // Обновляем линии при загрузке и изменении размера окна
    updateConnectorLines();
    window.addEventListener('resize', updateConnectorLines);
    
    // Добавляем классы при наведении для анимации линий
    const matchWrappers = document.querySelectorAll('.match-wrapper');
    
    matchWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function() {
            const allLines = document.querySelectorAll('.match-wrapper::after, .match-wrapper::before, .final::before');
            // Добавляем класс для подсветки всех линий
            document.body.classList.add('highlight-lines');
        });
        
        wrapper.addEventListener('mouseleave', function() {
            document.body.classList.remove('highlight-lines');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const matchWrappers = document.querySelectorAll('.match-wrapper');
    
    matchWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function() {
            const matchId = this.dataset.matchId;
            const lines = document.querySelectorAll('.connector-line');
            
            lines.forEach(line => {
                if (line.classList.contains('line-1') && matchId === 'semifinal-1') {
                    line.style.opacity = '1';
                    line.style.background = '#2ecc71';
                } else if (line.classList.contains('line-2') && matchId === 'semifinal-2') {
                    line.style.opacity = '1';
                    line.style.background = '#2ecc71';
                } else if (matchId === 'final') {
                    lines.forEach(l => {
                        l.style.opacity = '1';
                        l.style.background = '#00a8ff';
                    });
                }
            });
        });
        
        wrapper.addEventListener('mouseleave', function() {
            const lines = document.querySelectorAll('.connector-line');
            lines.forEach(line => {
                line.style.opacity = '';
                line.style.background = '';
            });
        });
    });
    
    // Анимация появления элементов
    const matches = document.querySelectorAll('.match-wrapper');
    matches.forEach((match, index) => {
        match.style.opacity = '0';
        match.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            match.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            match.style.opacity = '1';
            match.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});
document.addEventListener('DOMContentLoaded', function() {
 
    const thirdPlaceSection = document.querySelector('.third-place-section');
    if (thirdPlaceSection) {
        thirdPlaceSection.style.opacity = '0';
        thirdPlaceSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            thirdPlaceSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            thirdPlaceSection.style.opacity = '1';
            thirdPlaceSection.style.transform = 'translateY(0)';
        }, 300);
    }
    
});