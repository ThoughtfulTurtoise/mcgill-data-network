(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile menu ----
  const links = document.getElementById('nav-links');
  const burger = document.getElementById('nav-burger');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.querySelectorAll('[data-close-menu]').forEach((el) => {
      el.addEventListener('click', () => {
        links.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Reveal on scroll ----
  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  const show = (el) => el.classList.add('is-visible');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(show);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  // ---- Stat count-up ----
  const runCount = (el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.round(target * ease(t));
      el.textContent = prefix + value.toLocaleString('en-US') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counts = Array.from(document.querySelectorAll('[data-countup]'));
  if (counts.length && !reduceMotion) {
    counts.forEach((el) => {
      el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    });
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counts.forEach((el) => cio.observe(el));
    } else {
      counts.forEach(runCount);
    }
  }

  // ---- Sticky nav + scroll spy ----
  const nav = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('[data-navlink]'));
  const sectionIds = ['about', 'events', 'partners', 'team', 'join', 'contact'];

  const handleScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);

    const mid = y + window.innerHeight * 0.32;
    let active = '';
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= mid) active = id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('data-navlink') === active);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
