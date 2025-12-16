document.addEventListener('DOMContentLoaded', () => {

    console.log('Fission Run: Core Script Loaded');

    // --------------------------------------------------------
    // 1. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК
    // --------------------------------------------------------
    
    gsap.registerPlugin(ScrollTrigger);
    lucide.createIcons();

    // Плавный скролл (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --------------------------------------------------------
    // 2. МОБИЛЬНОЕ МЕНЮ
    // --------------------------------------------------------
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const menuIcon = burger.querySelector('i');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.add('is-active');
            menuIcon.setAttribute('data-lucide', 'x');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('is-active');
            menuIcon.setAttribute('data-lucide', 'menu');
            document.body.style.overflow = '';
        }
        lucide.createIcons();
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });


    // --------------------------------------------------------
    // 3. АНИМАЦИИ (GSAP)
    // --------------------------------------------------------

    // Hero Анимация
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle && typeof SplitType !== 'undefined') {
        const split = new SplitType('.hero__title', { types: 'chars' });
        const tl = gsap.timeline();
        
        tl.fromTo(split.chars, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: 'back.out(1.7)' }
        )
        .fromTo('.hero__desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero__btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero__stats', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.2');
    } else {
        gsap.to('.hero__content', { opacity: 1, duration: 1 });
    }

    // Заголовки секций
    const sectionHeaders = gsap.utils.toArray('.section__header, .section__title:not(.hero__title)');
    sectionHeaders.forEach(header => {
        gsap.fromTo(header, 
            { opacity: 0, y: 40 },
            {
                scrollTrigger: { trigger: header, start: 'top 85%' },
                opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
            }
        );
    });

    // Функция для карточек
    function animateCards(selector, triggerSelector) {
        const cards = gsap.utils.toArray(selector);
        if (cards.length > 0) {
            gsap.fromTo(cards, 
                { opacity: 0, y: 60 },
                {
                    scrollTrigger: { trigger: triggerSelector, start: 'top 80%' },
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out', clearProps: 'transform, opacity'
                }
            );
        }
    }

    animateCards('.platform__card', '.platform__grid');
    animateCards('.feature-item', '.innovation__grid');
    animateCards('.practice-card', '.practices__list');


    // --------------------------------------------------------
    // 4. ФОРМА КОНТАКТОВ (ИСПРАВЛЕННАЯ ЛОГИКА)
    // --------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.querySelector('.form-success');
    
    if (contactForm) {
        // Настройка капчи
        const captchaLabel = document.getElementById('captchaQuestion');
        const captchaInput = document.getElementById('captcha');
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        if(captchaLabel) captchaLabel.textContent = `${num1} + ${num2}`;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Останавливаем стандартную отправку
            
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input');
            const policyCheckbox = document.getElementById('policy');
            const phone = document.getElementById('phone');

            // 1. Сброс всех ошибок
            inputs.forEach(input => input.parentElement.classList.remove('error'));
            if(policyCheckbox) policyCheckbox.parentElement.classList.remove('error');

            // 2. Проверка телефона (только цифры)
            if (phone && !/^\d{10,}$/.test(phone.value.replace(/\D/g, ''))) {
                phone.parentElement.classList.add('error');
                isValid = false;
            }

            // 3. Проверка капчи
            if (captchaInput && parseInt(captchaInput.value) !== num1 + num2) {
                captchaInput.parentElement.classList.add('error');
                isValid = false;
            }

            // 4. Проверка чекбокса (ОБЯЗАТЕЛЬНО)
            if (policyCheckbox && !policyCheckbox.checked) {
                policyCheckbox.parentElement.classList.add('error'); // Подсветка ошибки
                isValid = false;
            }

            // 5. Проверка пустых полей
            inputs.forEach(input => {
                if(input.hasAttribute('required') && !input.value) {
                    input.parentElement.classList.add('error');
                    isValid = false;
                }
            });

            // Если все проверки пройдены
            if (isValid) {
                const btn = contactForm.querySelector('button');
                const btnText = btn.querySelector('.btn-text');
                
                // Анимация кнопки
                btnText.textContent = 'Отправка...';
                btn.style.opacity = '0.7';
                btn.disabled = true;
                
                // Имитация задержки сервера
                setTimeout(() => {
                    // 1. Скрываем форму полностью
                    contactForm.style.display = 'none';
                    
                    // 2. Показываем блок успеха
                    if(successMsg) {
                        successMsg.style.display = 'block';
                        
                        // Анимируем появление
                        gsap.fromTo(successMsg, 
                            { opacity: 0, y: 20 }, 
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    }
                    console.log('✅ Данные успешно отправлены');
                }, 1500);
            } else {
                // Если есть ошибки - небольшая анимация "тряски" формы
                gsap.fromTo(contactForm, {x: -5}, {x: 5, duration: 0.1, repeat: 3, yoyo: true});
            }
        });
    }


    // --------------------------------------------------------
    // 5. COOKIE POPUP
    // --------------------------------------------------------
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookie = document.getElementById('acceptCookie');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'block';
            gsap.fromTo(cookiePopup, 
                { y: 100, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
        }, 2000);

        if (acceptCookie) {
            acceptCookie.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                gsap.to(cookiePopup, { 
                    y: 50, opacity: 0, duration: 0.3, 
                    onComplete: () => cookiePopup.style.display = 'none' 
                });
            });
        }
    }
    
    ScrollTrigger.refresh();
});