document.addEventListener('DOMContentLoaded', () => {
    // Catatan: logika animasi envelope/hero ada di js/envelope.js (add-on).
    // File ini hanya berisi interaksi website (scroll reveal, nav, FAQ, RSVP, countdown).

    // ===== Scroll-Triggered Reveal Animations =====
    const revealSections = document.querySelectorAll('.intro, .gallery, .venue, .details, .schedule, .rsvp, .faq, .registry, .countdown');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach(section => {
        section.classList.add('reveal');
        revealObserver.observe(section);
    });

    // ===== Navigation Active State on Scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== RSVP Form Dummy Submit =====
    const rsvpForm = document.getElementById('rsvpForm');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData.entries());
        console.log('RSVP submitted:', data);
        alert('Thank you for your RSVP! We have received your response.');
        rsvpForm.reset();
    });

    // ===== Countdown Timer =====
    const targetDate = new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 1);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.getElementById('days').textContent = '000';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});