/* =========================================
   INITIAL LOAD & NAVBAR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Remove overlay
    setTimeout(() => {
        document.body.classList.add("page-loaded");
        triggerHeroAnimations();
    }, 100);

    initMenuData();
    initMagneticButtons();
    initScrollObserver();
    initParallax();
    initLiveStatus();
    initGallery();
    initHamburger(); // Mobile nav
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

/* =========================================
   HERO ANIMATIONS
========================================= */
function triggerHeroAnimations() {
    const staggers = document.querySelectorAll(".stagger-reveal span, .tagline, .stagger-reveal-delay-2");
    staggers.forEach((el) => {
        el.closest('.stagger-reveal') && el.closest('.stagger-reveal').classList.add('visible');
        el.classList.add('visible');
    });
}

/* =========================================
   HAMBURGER / MOBILE MENU
========================================= */
function initHamburger() {
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.innerHTML = `<span></span><span></span><span></span>`;

    // Create fullscreen mobile menu
    const mobileMenu = document.createElement('nav');
    mobileMenu.className = 'mobile-menu';

    // Copy nav links into mobile menu
    const navItems = [
        { href: '#about', label: 'About' },
        { href: '#popular', label: 'Popular' },
        { href: '#menu', label: 'Menu' },
        { href: '#gallery', label: 'Gallery' },
        { href: '#timing', label: 'Timing' },
        { href: '#location', label: 'Location' },
    ];

    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        mobileMenu.appendChild(a);
    });

    // Inject into DOM
    const navbar = document.querySelector('.navbar');
    navbar.appendChild(hamburger);
    document.body.appendChild(mobileMenu);

    // Toggle menu open/close
    function openMenu() {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when a nav link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();

            // Smooth scroll to target after menu closes
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350); // Wait for menu close animation
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* =========================================
   MAGNETIC BUTTONS ENGINE
========================================= */
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll(".magnetic-btn, .magnetic-text");

    magneticElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const hx = rect.left + rect.width / 2;
            const hy = rect.top + rect.height / 2;
            const dx = e.clientX - hx;
            const dy = e.clientY - hy;
            const strength = el.classList.contains('magnetic-btn') ? 0.3 : 0.15;
            el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;

            const glow = el.querySelector(".btn-glow");
            if (glow) {
                glow.style.left = `${e.clientX - rect.left}px`;
                glow.style.top = `${e.clientY - rect.top}px`;
            }
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "translate(0px, 0px)";
            el.style.transition = "transform 0.5s var(--easing)";
            setTimeout(() => { el.style.transition = ""; }, 500);
        });

        el.addEventListener("mouseenter", () => {
            el.style.transition = "none";
        });
    });
}

/* =========================================
   SCROLL INTERSECTION OBSERVER
========================================= */
function initScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                if (entry.target.classList.contains("about-section")) {
                    entry.target.querySelector(".about-container").classList.add("scale-up");
                }

                const textReveal = entry.target.querySelectorAll(".text-reveal");
                textReveal.forEach(tr => tr.classList.add("visible"));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".scroll-trigger").forEach(el => {
        observer.observe(el);
    });
}

/* =========================================
   PARALLAX ENGINE
========================================= */
function initParallax() {
    const parallaxElements = document.querySelectorAll(".parallax");

    let scrollY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 0.2;
                    const yPos = -(scrollY * speed);
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* =========================================
   MENU DATA & LOGIC
========================================= */
const menuData = [
    { id: 1, type: "biriyani", name: "Royal Mutton Biriyani", price: "Tk 450", desc: "Slow-cooked basmati rice with tender mutton chops.", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop" },
    { id: 2, type: "biriyani", name: "Chicken Kacchi", price: "Tk 350", desc: "Aromatic saffron rice layered with spiced chicken.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop" },
    { id: 3, type: "noodles", name: "Spicy Schezwan Noodles", price: "Tk 250", desc: "Wok-tossed noodles with fiery schezwan sauce.", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop" },
    { id: 4, type: "noodles", name: "Hakka Noodles", price: "Tk 220", desc: "Classic stir-fried noodles with crisp veggies.", img: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop" },
    { id: 5, type: "pasta", name: "Creamy Alfredo", price: "Tk 300", desc: "Penne in rich, velvety parmesan cream sauce.", img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop" },
    { id: 6, type: "pasta", name: "Spicy Arrabiata", price: "Tk 280", desc: "Classic Italian red sauce with garlic & chili.", img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=800&auto=format&fit=crop" },
    { id: 7, type: "kabab", name: "Seekh Kabab", price: "Tk 320", desc: "Minced beef skewers perfectly charred.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop" },
    { id: 8, type: "kabab", name: "Reshmi Tikka", price: "Tk 340", desc: "Melt-in-mouth chicken marinated in cream.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop" }
];

function initMenuData() {
    const grid = document.getElementById("menu-grid");
    const tabs = document.querySelectorAll(".menu-tab");

    function renderMenu(filterType) {
        grid.style.opacity = 0;

        setTimeout(() => {
            grid.innerHTML = "";
            const filtered = filterType === "all" ? menuData : menuData.filter(item => item.type === filterType);

            filtered.forEach(item => {
                const card = document.createElement("div");
                card.className = "menu-card glass-panel";
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="menu-info">
                        <h3>${item.name}</h3>
                        <span class="menu-price">${item.price}</span>
                    </div>
                    <p class="menu-desc">${item.desc}</p>
                    <a href="#" class="card-order-btn" title="Order ${item.name} on Foodpanda">
                        Order on Foodpanda
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                `;
                grid.appendChild(card);
            });
            grid.style.opacity = 1;
        }, 300);
    }

    grid.style.transition = "opacity 0.3s ease";
    renderMenu("all");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderMenu(tab.dataset.target);
        });
    });
}

/* =========================================
   SMOOTH SCROLLING FOR LINKS
========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* =========================================
   LIVE STATUS CHECKER + TODAY ROW HIGHLIGHT
========================================= */
function initLiveStatus() {
    function highlightTodayRow(bdDay) {
        // Uses data-day attribute on each <li> — matches JS getDay() value directly
        document.querySelectorAll('.time-list li').forEach(row => {
            row.classList.remove('today-row');
        });
        const todayRow = document.querySelector(`.time-list li[data-day="${bdDay}"]`);
        if (todayRow) todayRow.classList.add('today-row');
    }

    function checkStatus() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const bdTime = new Date(utc + (3600000 * 6));

        const day = bdTime.getDay();
        const hours = bdTime.getHours();

        let isOpen = false;

        if (day === 5) {
            if (hours >= 9 && hours < 22) isOpen = true;
        } else {
            if (hours >= 10 && hours < 22) isOpen = true;
        }

        const statusText = document.getElementById("liveStatusText");
        const dot = document.getElementById("liveDot");

        if (!statusText || !dot) return;

        if (isOpen) {
            statusText.textContent = "We are currently OPEN";
            statusText.style.color = "#00C851";
            dot.classList.add("open");
        } else {
            statusText.textContent = "We are currently CLOSED";
            statusText.style.color = "#ff4444";
            dot.classList.remove("open");
        }

        highlightTodayRow(day);
    }

    checkStatus();
    setInterval(checkStatus, 60000);
}

/* =========================================
   GALLERY DRAG SCROLL
========================================= */
function initGallery() {
    const track = document.querySelector('.gallery-track');
    const items = document.querySelectorAll('.gallery-item');
    if (!track || !items.length) return;

    function updateActiveItem() {
        const trackCenter = track.scrollLeft + track.offsetWidth / 2;
        let closestItem = null;
        let closestDist = Infinity;

        items.forEach(item => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(trackCenter - itemCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestItem = item;
            }
        });

        items.forEach(item => item.classList.remove('is-active'));
        if (closestItem) closestItem.classList.add('is-active');
    }

    track.addEventListener('scroll', () => {
        updateActiveItem();
        const hint = document.getElementById('galleryHint');
        if (hint && !hint.classList.contains('fade-out')) {
            hint.classList.add('fade-out');
        }
    }, { passive: true });
    updateActiveItem();

    let isDown = false, startX, scrollLeft, velocity = 0, lastX = 0, rafId;
    let isDragging = false;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        lastX = e.pageX;
        cancelAnimationFrame(rafId);
    });

    track.addEventListener('mouseleave', () => { isDown = false; applyMomentum(); });
    track.addEventListener('mouseup', () => { isDown = false; applyMomentum(); });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        if (Math.abs(e.pageX - startX) > 5) isDragging = true;
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        velocity = e.pageX - lastX;
        lastX = e.pageX;
        track.scrollLeft = scrollLeft - walk;
    });

    track.querySelectorAll("img").forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    let touchStartX, touchScrollLeft;
    track.addEventListener('touchstart', (e) => {
        isDragging = false;
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = track.scrollLeft;
        cancelAnimationFrame(rafId);
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        if (Math.abs(x - touchStartX) > 5) isDragging = true;
        track.scrollLeft = touchScrollLeft - (x - touchStartX);
    }, { passive: true });

    track.addEventListener('touchend', () => applyMomentum());

    function applyMomentum() {
        rafId = requestAnimationFrame(function decay() {
            velocity *= 0.92;
            track.scrollLeft -= velocity;
            updateActiveItem();
            if (Math.abs(velocity) > 0.5) rafId = requestAnimationFrame(decay);
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        items.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                if (isDragging) { e.preventDefault(); return; }
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = img.alt || '';
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 400);
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
}