/* ============================================================
   VAART — Amsterdam boottickets · scroll-scrubbed video hero
   ============================================================ */

/* ---------- Provider data (prices/links are placeholders) ---------- */
const PROVIDERS = [
  { name: 'Lovers Canal Cruises', cat: 'Klassieke rondvaart', tag: 'De iconische glazen-dak rondvaart, 75 min door de grachtengordel.', price: 'vanaf €18' },
  { name: 'Blue Boat Company', cat: 'Klassieke rondvaart', tag: 'Eén uur door het hart van de grachten, meertalige audiogids.', price: 'vanaf €18' },
  { name: 'Stromma Canal Tours', cat: 'Klassieke rondvaart', tag: 'Hop-on hop-off langs alle hotspots, de hele dag geldig.', price: 'vanaf €20' },
  { name: 'Amsterdam Circle Line', cat: 'Hop-on hop-off', tag: 'Uitstappen waar je wilt, ticket 24 uur geldig.', price: 'vanaf €22' },
  { name: 'Flagship Amsterdam', cat: 'Open boot', tag: 'De gezellige open boot met kapitein — de lokale favoriet.', price: 'vanaf €24' },
  { name: 'KINboat', cat: 'Open elektrische boot', tag: '100% elektrisch varen door de grachten, klein en persoonlijk.', price: 'vanaf €22' },
  { name: 'Those Dam Boat Guys', cat: 'Open boot', tag: 'Kleine open boten, verhalen van echte locals.', price: 'vanaf €28' },
  { name: 'Pure Boats Amsterdam', cat: 'Open boot', tag: 'Privé- en kleine groepen, rustig en op maat.', price: 'vanaf €25' },
  { name: 'Starboard Boats', cat: 'Open boot', tag: 'Open vaart met kapitein, dagelijks vertrek.', price: 'vanaf €24' },
  { name: 'Friendship Amsterdam', cat: 'Open boot', tag: 'Luxe open boot, all-inclusive optie aan boord.', price: 'vanaf €30' },
  { name: 'Mokumboot', cat: 'Open boot', tag: 'Open boot door de grachten, vriendelijk geprijsd.', price: 'vanaf €20' },
  { name: 'Eco Boats Amsterdam', cat: 'Elektrische boot', tag: 'Duurzaam en emissievrij varen door de stad.', price: 'vanaf €21' },
  { name: 'Boaty Amsterdam', cat: 'Zelf varen', tag: 'Huur je eigen bootje en stuur zelf door de grachten.', price: 'vanaf €45/uur' },
  { name: 'Sloepdelen', cat: 'Zelf varen', tag: 'Deel een sloep per uur — geen vaarbewijs nodig.', price: 'vanaf €40/uur' },
  { name: "Adam's Boats", cat: 'Zelf varen', tag: 'Zelf sturen, eenvoudig en zonder ervaring.', price: 'vanaf €50' },
  { name: 'Canal Motorboats', cat: 'Zelf varen', tag: 'Eigen motorboot door de grachten, maximale vrijheid.', price: 'vanaf €60' },
  { name: 'Amsterdam Jewel Cruises', cat: 'Diner cruise', tag: 'Luxe diner op het water bij kaarslicht.', price: 'vanaf €90' },
  { name: "Rederij 't Smidtje", cat: 'Diner cruise', tag: 'Klassiek diner op een historisch salonschip.', price: 'vanaf €85' },
  { name: 'Candlelight Cruises', cat: 'Diner cruise', tag: 'Wijn en kaas bij kaarslicht, 2 uur door de grachten.', price: 'vanaf €55' },
  { name: 'Rederij P. Kooij', cat: 'Klassiek', tag: 'Kleinschalig en authentiek Amsterdams, al decennia.', price: 'vanaf €16' },
  { name: 'Voyage Amsterdam', cat: 'Open boot', tag: 'Kleine open rondvaart met persoonlijke aandacht.', price: 'vanaf €20' },
  { name: 'Water Colors', cat: 'Open boot', tag: 'Kunst en cultuur op het water, iets anders dan doorsnee.', price: 'vanaf €22' },
  { name: 'Amsterdam Boat Center', cat: 'Open boot', tag: 'Centraal gelegen, dagelijks vertrekken.', price: 'vanaf €19' },
  { name: 'Amsterdam Boat Adventures', cat: 'Open boot', tag: 'Avontuurlijke vaartochten net buiten de drukte.', price: 'vanaf €23' },
  { name: 'Wetlands Safari', cat: 'Natuur', tag: 'Naar de stilte van de Waterlandse wetlands, net buiten de stad.', price: 'vanaf €35' }
];

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const cardEl = $('card'), cardCat = $('cardCat'), cardName = $('cardName'), cardTag = $('cardTag');
const cardPrice = $('cardPrice'), cardBook = $('cardBook'), cardClose = $('cardClose');
const panelEl = $('panel'), panelList = $('panelList'), panelClose = $('panelClose');
const listBtn = $('listBtn'), countEl = $('count'), grid = $('grid'), tagsEl = $('tags');
const video = $('heroVideo');

countEl.textContent = PROVIDERS.length;

/* ---------- Card / panel ---------- */
function openCard(p) {
  cardCat.textContent = p.cat;
  cardName.textContent = p.name;
  cardTag.textContent = p.tag;
  cardPrice.textContent = p.price;
  cardBook.href = '#'; // TODO: real reseller/affiliate link
  cardEl.classList.add('open'); cardEl.setAttribute('aria-hidden', 'false');
}
function closeCard() { cardEl.classList.remove('open'); cardEl.setAttribute('aria-hidden', 'true'); }
cardClose.addEventListener('click', closeCard);
cardEl.addEventListener('click', (e) => { if (e.target === cardEl) closeCard(); });

function openPanel() { panelEl.classList.add('open'); panelEl.setAttribute('aria-hidden', 'false'); }
function closePanel() { panelEl.classList.remove('open'); panelEl.setAttribute('aria-hidden', 'true'); }
listBtn.addEventListener('click', openPanel);
panelClose.addEventListener('click', closePanel);

/* ---------- Providers grid ---------- */
PROVIDERS.forEach((p) => {
  const c = document.createElement('div');
  c.className = 'pcard';
  c.innerHTML = `<div class="pcard__cat">${p.cat}</div><div class="pcard__name">${p.name}</div><div class="pcard__tag">${p.tag}</div><div class="pcard__foot"><span class="pcard__price">${p.price}</span><span class="pcard__book">Boek →</span></div>`;
  c.addEventListener('click', () => openCard(p));
  grid.appendChild(c);
});

/* ---------- Panel list ---------- */
PROVIDERS.forEach((p) => {
  const item = document.createElement('div');
  item.className = 'panel-item';
  item.innerHTML = `<div class="panel-item__cat">${p.cat}</div><div class="panel-item__name">${p.name}</div><div class="panel-item__price">${p.price}</div>`;
  item.addEventListener('click', () => { closePanel(); openCard(p); });
  panelList.appendChild(item);
});

/* ---------- Scroll-scrubbed video ---------- */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: '#scrub',
  start: 'top top',
  end: 'bottom bottom',
  pin: '.scrub__pin',
  scrub: 0.6,
  onUpdate: (self) => {
    if (video.readyState >= 1 && video.duration) {
      video.currentTime = video.duration * self.progress;
    }
  }
});

/* ---------- Provider tags that appear as you glide ---------- */
const HIGHLIGHTS = [0, 4, 8, 12, 16, 20];
HIGHLIGHTS.forEach((idx, i) => {
  const p = PROVIDERS[idx];
  const t = document.createElement('div');
  t.className = 'tag';
  t.innerHTML = `<span class="tag__cat">${p.cat}</span><span class="tag__name">${p.name}</span>`;
  t.style.top = `${16 + i * 13}%`;
  if (i % 2 === 0) { t.style.left = '6%'; } else { t.style.right = '6%'; }
  t.addEventListener('click', () => openCard(p));
  tagsEl.appendChild(t);

  gsap.fromTo(t, { opacity: 0, y: 26 }, {
    opacity: 1, y: 0, ease: 'none',
    scrollTrigger: {
      trigger: '#scrub',
      start: `${6 + i * 14}% top`,
      end: `${13 + i * 14}% top`,
      scrub: true
    }
  });
});

/* ---------- Fade the hint once the user starts scrolling ---------- */
ScrollTrigger.create({
  trigger: '#scrub', start: '4% top',
  onEnter: () => gsap.to('#hint', { opacity: 0, duration: 0.4 })
});
