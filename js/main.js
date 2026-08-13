/* ============================================================
   AMSTERDAM NAUTIC — main.js
   Locomotive Scroll (parallax) + GSAP + SplitType + reveals
   Reveals use IntersectionObserver — robust with smooth scroll.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const loaderFill = loader.querySelector('.loader__fill');

  function hideLoader() {
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete: () => loader.remove()
    });
  }

  /* ---------- Locomotive Scroll (parallax layers) ---------- */
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 0.85,
    lerp: 0.08
  });

  /* ---------- SplitType character reveal ---------- */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const st = new SplitType(el, { types: 'lines,words,chars' });
    gsap.set(st.chars, { opacity: 0, y: 46, rotateX: -30 });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(st.chars, {
              opacity: 1, y: 0, rotateX: 0,
              duration: 0.9, stagger: 0.018, ease: 'power3.out'
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
  });

  /* ---------- Image reveals ---------- */
  document.querySelectorAll('[data-reveal-image]').forEach((el) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('revealed');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const obj = { v: 0 };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(obj, {
              v: target, duration: 1.6, ease: 'power2.out',
              onUpdate: () => (el.textContent = Math.round(obj.v))
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });

  /* ---------- Fleet card hover tilt ---------- */
  document.querySelectorAll('.boat').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' });
    });
  });

  /* ---------- Init on load ---------- */
  window.addEventListener('load', () => {
    // Recalculate Locomotive heights once images have settled
    requestAnimationFrame(() => {
      if (locoScroll && typeof locoScroll.update === 'function') locoScroll.update();
    });
    gsap.to(loaderFill, {
      width: '100%',
      duration: 1.4,
      ease: 'power2.inOut',
      onComplete: hideLoader
    });
  });
})();
