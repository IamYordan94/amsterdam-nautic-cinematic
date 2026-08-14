/* ============================================================
   VAART — The Harbor · main.js
   Wires: loader · static art hero · 3D harbor · card · panel · filters
   (scroll-scrub video engine removed — hero is generated artwork)
   ============================================================ */

import { PROVIDERS, GROUPS, GROUP_ORDER } from './providers.js';
import { createHarbor } from './harbor.js';

const $ = (id) => document.getElementById(id);
gsap.registerPlugin(ScrollTrigger);

/* ---------- Provider card ---------- */
const cardEl = $('card'), cardCat = $('cardCat'), cardName = $('cardName'), cardImg = $('cardImg');
const cardTag = $('cardTag'), cardPrice = $('cardPrice'), cardBook = $('cardBook'), cardClose = $('cardClose');

function openCard(p) {
  cardCat.textContent = p.cat;
  cardCat.style.color = (GROUPS[p.group] || {}).color || 'var(--coral)';
  cardName.textContent = p.name;
  cardTag.textContent = p.tag;
  cardPrice.textContent = p.price;
  if (p.slug) {
    cardImg.src = `images/artwork/${p.slug}.webp`;
    cardImg.alt = `Geschilderd tafereel van ${p.name}`;
    cardImg.hidden = false;
  } else {
    cardImg.hidden = true;
  }
  cardBook.href = '#'; // TODO: real reseller/affiliate link
  cardEl.classList.add('open');
  cardEl.setAttribute('aria-hidden', 'false');
}
function closeCard() { cardEl.classList.remove('open'); cardEl.setAttribute('aria-hidden', 'true'); }
cardClose.addEventListener('click', closeCard);
cardEl.addEventListener('click', (e) => { if (e.target === cardEl) closeCard(); });

/* ---------- Full list panel ---------- */
const panelEl = $('panel'), panelList = $('panelList'), panelClose = $('panelClose'), listBtn = $('listBtn');
function openPanel() { panelEl.classList.add('open'); panelEl.setAttribute('aria-hidden', 'false'); }
function closePanel() { panelEl.classList.remove('open'); panelEl.setAttribute('aria-hidden', 'true'); }
listBtn.addEventListener('click', openPanel);
panelClose.addEventListener('click', closePanel);

PROVIDERS.forEach((p) => {
  const item = document.createElement('div');
  item.className = 'panel-item';
  item.innerHTML = `<img class="panel-item__thumb" src="images/artwork/${p.slug}.webp" alt="" loading="lazy" /><div class="panel-item__cat">${p.cat}</div><div class="panel-item__name">${p.name}</div><div class="panel-item__price">${p.price}</div>`;
  item.querySelector('.panel-item__cat').style.color = (GROUPS[p.group] || {}).color;
  item.addEventListener('click', () => { closePanel(); openCard(p); });
  panelList.appendChild(item);
});
$('count').textContent = PROVIDERS.length;

/* ---------- Harbor (3D providers) ---------- */
let harbor = null;
try {
  harbor = createHarbor({ container: $('harbor'), onSelect: openCard });
} catch (err) {
  console.warn('harbor init failed:', err);
}

/* ---------- Category filters ---------- */
let activeFilter = null;
GROUP_ORDER.forEach((key) => {
  const g = GROUPS[key];
  const btn = document.createElement('button');
  btn.className = 'filter';
  btn.innerHTML = `<span class="filter__dot" style="background:${g.color}"></span>${g.label}`;
  btn.addEventListener('click', () => {
    if (activeFilter === key) {
      activeFilter = null;
      btn.classList.remove('active');
      harbor && harbor.setFilter(null);
    } else {
      document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = key;
      harbor && harbor.setFilter(key);
    }
  });
  $('filters').appendChild(btn);
});

/* ---------- Hero crossfade scrollytelling (5 generated scenes) ---------- */
const scenes = gsap.utils.toArray('.scene');
if (scenes.length) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });
  tl.set(scenes[0], { opacity: 1, scale: 1 }, 0);
  scenes.forEach((s, i) => {
    if (i === 0) return;
    tl.fromTo(s, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'none' }, i * 1.4);
    tl.to(scenes[i - 1], { opacity: 0, duration: 1.6, ease: 'none' }, i * 1.4 + 1.0);
  });
}

/* ---------- Mouse parallax on the hero ---------- */
if (window.matchMedia && matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
    gsap.to('#heroStage', {
      x: mx * 18, y: my * 12,
      duration: 1.4, ease: 'power2.out', overwrite: 'auto'
    });
    gsap.to('#heroBg', {
      x: mx * 10, y: my * 6, scale: 1.04,
      duration: 1.4, ease: 'power2.out', overwrite: 'auto'
    });
  });
}

/* ---------- Hero hint fades once you scroll ---------- */
ScrollTrigger.create({
  trigger: '#hero', start: '8% top',
  onEnter: () => gsap.to('#hint', { opacity: 0, duration: 0.4 })
});

/* ---------- Boot ---------- */
function boot() {
  // deterministic, gsap-independent loader removal
  setTimeout(() => {
    const l = $('loader');
    if (!l) return;
    l.style.transition = 'opacity 0.6s ease';
    l.style.opacity = '0';
    setTimeout(() => l.remove(), 700);
  }, 900);
  ScrollTrigger.refresh();
}
boot();
