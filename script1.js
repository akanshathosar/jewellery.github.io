// script.js
// Shared site script: dark mode, animations, nav highlight, small helpers

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------
     Dark mode (persistent)
     ------------------------- */
  const darkToggle = document.getElementById('dark-mode-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem('site-dark');

  const applyDark = (isDark) => {
    document.body.classList.toggle('dark', isDark);
    if (darkToggle) {
      darkToggle.innerHTML = isDark ? '☀️' : '🌙';
      darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
  };

  // initialize
  if (stored !== null) {
    applyDark(stored === 'true');
  } else {
    applyDark(prefersDark);
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark');
      applyDark(isDark);
      localStorage.setItem('site-dark', String(isDark));
    });
  }

  /* -------------------------
     Highlight current nav link
     ------------------------- */
  try {
    const navLinks = document.querySelectorAll('nav a, nav .nav-link');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      // compare filenames (works for index.html and other pages)
      if (href.includes(path) || (path === 'index.html' && (href === '#home' || href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  } catch (e) { /* no-op */ }

  /* -------------------------
     GSAP Animations (if available)
     ------------------------- */
  if (window.gsap) {
    try {
      gsap.registerPlugin(window.ScrollTrigger || {});
      // Hero entrance (if any)
      gsap.from('.hero h2', { y: 30, opacity: 0, duration: 0.9, ease: 'power2.out' });
      gsap.from('.hero p', { y: 20, opacity: 0, duration: 1, delay: 0.15, ease: 'power2.out' });
      gsap.from('.cta-btn', { scale: 0.95, opacity: 0, duration: 0.8, delay: 0.25, ease: 'power2.out' });

      // Animate grid items on scroll
      const items = document.querySelectorAll('.item');
      if (items.length) {
        gsap.from(items, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    } catch (err) {
      // fail gracefully if ScrollTrigger not available
      console.warn('GSAP init error', err);
    }
  }

  /* -------------------------
     Accessibility: Close mobile dropdown on outside click (if used)
     ------------------------- */
  document.addEventListener('click', (e) => {
    const openDropdowns = document.querySelectorAll('.nav-item.open');
    openDropdowns.forEach(d => {
      if (!d.contains(e.target)) d.classList.remove('open');
    });
  });

  /* -------------------------
     Optional: Smooth jump to anchors on same page (enhance)
     ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl && window.location.pathname.endsWith(window.location.pathname.split('/').pop())) {
          // same-page anchor: prevent default to ensure smooth scroll behavior
          ev.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update URL hash without jumping
          history.replaceState(null, '', href);
        }
      }
    });
  });

}); // DOMContentLoaded
