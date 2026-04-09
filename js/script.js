document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const pagination = document.querySelector('.carousel-pagination');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Переменные для свайпа
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    const getVisibleSlides = () => window.innerWidth <= 768 ? 1 : 3;

    const getShiftWidth = () => {
        const gap = (window.innerWidth <= 768) ? 0 : 20;
        return slides[0].offsetWidth + gap;
    };

    // 1. Создание 9 точек
    function createDots() {
        pagination.innerHTML = ''; 
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            pagination.appendChild(dot);
        }
    }
    createDots();
    const dots = document.querySelectorAll('.dot');

    // 2. Основная функция обновления
    const updateSlider = () => {
        const visibleSlides = getVisibleSlides();
        const maxScrollIndex = totalSlides - visibleSlides;
        
        // Ограничиваем скролл ленты, но не индекс точки
        const scrollIndex = Math.min(currentIndex, maxScrollIndex);
        
        currentTranslate = -scrollIndex * getShiftWidth();
        prevTranslate = currentTranslate;
        
        container.style.transition = 'transform 0.3s ease-out';
        container.style.transform = `translateX(${currentTranslate}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Кнопки
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;
        prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? "0.3" : "1";
    };

    // 3. Обработчики кликов
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    pagination.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            currentIndex = parseInt(e.target.dataset.index);
            updateSlider();
        }
    });

    // 4. ЛОГИКА СВАЙПА (Touch & Mouse)
    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    };

    const touchStart = (event) => {
        isDragging = true;
        startPos = getPositionX(event);
        container.style.transition = 'none'; // Убираем анимацию при перетаскивании
        animationID = requestAnimationFrame(animationLoop);
    };

    const touchMove = (event) => {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    };

    const touchEnd = () => {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        // Если свайпнули достаточно сильно (более 50px)
        if (movedBy < -50 && currentIndex < totalSlides - 1) {
            currentIndex++;
        } else if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateSlider();
    };

    function animationLoop() {
        container.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animationLoop);
    }

    // Слушатели для свайпа
    container.addEventListener('touchstart', touchStart);
    container.addEventListener('touchmove', touchMove);
    container.addEventListener('touchend', touchEnd);
    container.addEventListener('mousedown', touchStart);
    container.addEventListener('mousemove', touchMove);
    container.addEventListener('mouseup', touchEnd);
    container.addEventListener('mouseleave', touchEnd);

    window.addEventListener('resize', () => updateSlider());
    updateSlider();

    // --- Аккордеон и Модалка (без изменений) ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    const modal = document.querySelector(".modal");
    const bookingForm = document.querySelector(".booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
            bookingForm.reset();
        });
    }
    document.querySelector(".modal__button")?.addEventListener("click", () => {
        modal.style.display = "none";
    });
   
   window.addEventListener("click", function(e){
    modal.style.display = "none"
   }) 
});