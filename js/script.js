document.addEventListener('DOMContentLoaded', () => {
    // ===== Envelope Animation Sequence =====
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const inviteLetters = document.querySelectorAll('#inviteText .letter');
    const hero = document.querySelector('.hero');

    // Phase 1: Langsung animate "You're invited to" letters — envelope sudah visible di state awal
    // Delay singkat agar browser selesai render dulu
    setTimeout(() => {
        envelopeOverlay.classList.add('animate');
        inviteLetters.forEach((letter, i) => {
            letter.style.transitionDelay = `${i * 0.04}s`;
        });
    }, 200);

    // Phase 1: Animate "You're invited to" letters
    // setTimeout(() => {
    //     envelopeOverlay.classList.add('animate');
    //     inviteLetters.forEach((letter, i) => {
    //         letter.style.transitionDelay = `${i * 0.04}s`;
    //     });
    // }, 200);

    // Phase 2: 3 detik state awal, lalu top flap buka
    setTimeout(() => {
        envelopeOverlay.classList.add('open');
    }, 3000);

    // Phase 3: Hero mulai scale saat layer lain slide (~1s setelah open)
    setTimeout(() => {
        hero.classList.add('revealed');
    }, 4100);

    // Phase 4: Hide overlay + show nav + animate hero text (1s setelah semua slide habis)
    setTimeout(() => {
        envelopeOverlay.classList.add('hidden');
        document.getElementById('mainNav').classList.add('visible');
        animateHero();
    }, 5100);

    // Phase 5: Remove overlay dari DOM
    setTimeout(() => {
        envelopeOverlay.style.display = 'none';
    }, 6100);

    // ===== Hero Letter-by-Letter Animation =====
    function animateHero() {
        const subtitleLetters = document.querySelectorAll('#heroSubtitle .letter');
        const titleLetters = document.querySelectorAll('#heroTitle .letter');
        const amp = document.querySelector('#heroTitle .amp');

        hero.classList.add('animate');

        subtitleLetters.forEach((letter, i) => {
            letter.style.transitionDelay = `${i * 0.03}s`;
        });

        const subtitleDelay = subtitleLetters.length * 0.03;
        titleLetters.forEach((letter, i) => {
            letter.style.transitionDelay = `${subtitleDelay + 0.2 + i * 0.04}s`;
        });

        if (amp) {
            amp.style.transitionDelay = `${subtitleDelay + 0.1}s`;
        }
    }

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