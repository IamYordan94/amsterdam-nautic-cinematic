/* ============================================================
   AMSTERDAM NAUTIC — main.js
   Locomotive Scroll + GSAP ScrollTrigger + SplitType + reveals
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

  function animateLoader() {
    gsap.to(loaderFill, {
      width: '100%',
      duration: 1.4,
      ease: 'power2.inOut',
      onComplete: hideLoader
    });
  }

  /* ---------- Locomotive Scroll ---------- */
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 0.85,
    lerp: 0.08,
    getDirection: true
  });

  /* ---------- GSAP + ScrollTrigger wiring ---------- */
  gsap.registerPlugin(ScrollTrigger);

  locoScroll.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
  });

  ScrollTrigger.defaults({ scroller: '[data-scroll-container]' });

  /* ---------- SplitType character reveal ---------- */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const st = new SplitType(el, { types: 'lines,words,chars' });
    gsap.fromTo(
      st.chars,
      { opacity: 0, y: 46, rotateX: -30 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.9, stagger: 0.018, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  /* ---------- Image reveals ---------- */
  document.querySelectorAll('[data-reveal-image]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('revealed')
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(obj.v))
        });
      }
    });
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

  /* ---------- Refresh on load ---------- */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    animateLoader();
  });

  /* ---------- Refresh after all resources settle ---------- */
  let refreshTimer;
  window.addEventListener('resize', () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
})();
