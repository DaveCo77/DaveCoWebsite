/**
 * Pixel Array site — Lenis smooth scroll, nav, optional before/after slider, scroll reveals. (DaveCo: programming offshoot.)
 * Configure Stripe Payment Link in pay.html (STRIPE_PAYMENT_LINK).
 */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis = null;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.35,
            easing: function (t) {
                return Math.min(1, 1.001 - Math.pow(2, -10 * t));
            },
            smoothWheel: true,
            wheelMultiplier: 0.85,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    function scrollToTarget(hash) {
        if (!hash || hash === '#') return;
        const el = document.querySelector(hash);
        if (!el) return;
        const header = document.querySelector('[data-site-header]');
        const offset = header ? header.offsetHeight + 8 : 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        if (lenis) {
            lenis.scrollTo(top, { immediate: false });
        } else {
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                scrollToTarget(href);
                closeMobileNav();
            }
        });
    });

    const yearEl = document.getElementById('y');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const openBtn = document.querySelector('[data-nav-open]');
    const closeBtn = document.querySelector('[data-nav-close]');
    const panel = document.querySelector('[data-nav-panel]');

    function closeMobileNav() {
        document.body.classList.remove('nav-open');
        panel?.classList.remove('is-open');
        panel?.setAttribute('aria-hidden', 'true');
        openBtn?.setAttribute('aria-expanded', 'false');
    }

    function openMobileNav() {
        document.body.classList.add('nav-open');
        panel?.classList.add('is-open');
        panel?.setAttribute('aria-hidden', 'false');
        openBtn?.setAttribute('aria-expanded', 'true');
    }

    openBtn?.addEventListener('click', function () {
        if (panel?.classList.contains('is-open')) closeMobileNav();
        else openMobileNav();
    });
    closeBtn?.addEventListener('click', closeMobileNav);
    panel?.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMobileNav);
    });

    document.querySelectorAll('[data-dropdown]').forEach(function (wrap) {
        var btn = wrap.querySelector('[data-dropdown-btn]');
        var panel = wrap.querySelector('[data-dropdown-panel]');
        if (!btn || !panel) return;

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = wrap.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        panel.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                wrap.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    });

    document.addEventListener('click', function () {
        document.querySelectorAll('[data-dropdown].is-open').forEach(function (wrap) {
            wrap.classList.remove('is-open');
            var b = wrap.querySelector('[data-dropdown-btn]');
            if (b) b.setAttribute('aria-expanded', 'false');
        });
    });

    document.querySelectorAll('[data-dropdown]').forEach(function (wrap) {
        wrap.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    const slider = document.getElementById('comparison-slider');
    const renderLayer = document.getElementById('render-layer');
    const divider = document.getElementById('slider-divider');
    if (slider && renderLayer && divider) {
        slider.addEventListener('input', function (e) {
            const value = e.target.value;
            renderLayer.style.clipPath = 'polygon(0 0, ' + value + '% 0, ' + value + '% 100%, 0 100%)';
            divider.style.left = value + '%';
        });
    }

    if (!prefersReducedMotion) {
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            io.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
            );
            reveals.forEach(function (el) {
                io.observe(el);
            });
        } else {
            reveals.forEach(function (el) {
                el.classList.add('is-visible');
            });
        }
    } else {
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('is-visible');
        });
    }
})();
