document.addEventListener('DOMContentLoaded', function() {
    // === КАРУСЕЛЬ ===
    let currentIndex = 0;
    let cardWidth = 0;
    
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.car-card');
    const totalCards = cards.length;
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    function updateCardWidth() {
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth + 30; // + адаптивный gap
        }
    }

    function updateCarousel() {
        updateCardWidth();
        
        // Сколько карточек помещается в видимую область
        const containerWidth = track.parentElement.offsetWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth) || 1;
        
        // Ограничиваем индекс
        const maxIndex = Math.max(0, totalCards - visibleCards);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // Плавная прокрутка
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Состояние кнопок
        if (prevBtn) prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.4';
        if (nextBtn) nextBtn.style.opacity = currentIndex < maxIndex ? '1' : '0.4';
    }

    // Следующая карточка
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            updateCardWidth();
            const containerWidth = track.parentElement.offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth) || 1;
            const maxIndex = Math.max(0, totalCards - visibleCards);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Предыдущая карточка
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    // Инициализация и адаптация под размер экрана
    function initCarousel() {
        updateCarousel();
    }

    // Обработчики событий
    window.addEventListener('resize', function() {
        // Небольшая задержка для debounce
        clearTimeout(window.carouselResizeTimeout);
        window.carouselResizeTimeout = setTimeout(updateCarousel, 150);
    });

    // Запуск после загрузки
    initCarousel();

    // === МОДАЛЬНОЕ ОКНО ===
    const modal = document.getElementById('bookingModal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.querySelector('.modal-close');

    // Открытие модалки
    if (openBtns.length > 0) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Блокируем скролл
                }
            });
        });
    }

    // Закрытие модалки
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Возвращаем скролл
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Клик по фону модалки
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Закрытие на Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // === АВТОПРОКРУТКА (опционально) ===
    let autoScrollInterval;
    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (nextBtn && nextBtn.style.opacity !== '0.4') {
                nextBtn.click();
            }
        }, 5000); // 5 секунд
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Автопрокрутка при наведении
    const wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoScroll);
        wrapper.addEventListener('mouseleave', startAutoScroll);
        startAutoScroll(); // Запуск автопрокрутки
    }

    console.log('Карусель и модальное окно инициализированы');
});
