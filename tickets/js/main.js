/* ============================================================
   VAART — Amsterdam boottickets · 4D mouse-driven canal scene
   Three.js: glide through the gracht, providers as boats.
   ============================================================ */

import * as THREE from 'three';

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
  { name: 'Canal Motorboats', cat: 'Zelf varen', tag: 'Eigen motorboot door de grachten, maximaal vrijheid.', price: 'vanaf €60' },
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
const cardEl = document.getElementById('card');
const cardCat = document.getElementById('cardCat');
const cardName = document.getElementById('cardName');
const cardTag = document.getElementById('cardTag');
const cardPrice = document.getElementById('cardPrice');
const cardBook = document.getElementById('cardBook');
const cardClose = document.getElementById('cardClose');
const panelEl = document.getElementById('panel');
const panelList = document.getElementById('panelList');
const panelClose = document.getElementById('panelClose');
const listBtn = document.getElementById('listBtn');
const countEl = document.getElementById('count');
const hintEl = document.getElementById('hint');

countEl.textContent = PROVIDERS.length;

/* ---------- Scene ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7ead8);
scene.fog = new THREE.Fog(0xf7ead8, 28, 130);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 220);
camera.position.set(0, 3.4, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('scene').appendChild(renderer.domElement);

/* ---------- Lights ---------- */
const sun = new THREE.DirectionalLight(0xfff1d6, 1.9);
sun.position.set(12, 22, 8);
scene.add(sun);
const fill = new THREE.DirectionalLight(0xffe9d0, 0.6);
fill.position.set(-8, 6, -6);
scene.add(fill);
scene.add(new THREE.AmbientLight(0xfff2e2, 0.9));

/* ---------- Water ---------- */
const waterGeo = new THREE.PlaneGeometry(50, 230, 42, 100);
waterGeo.rotateX(-Math.PI / 2);
const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({ color: 0x6aa79c, roughness: 0.35, metalness: 0.05 }));
water.position.set(0, -0.15, -95);
scene.add(water);
const waterVerts = waterGeo.attributes.position;

/* ---------- Materials ---------- */
const houseColors = [0xb4553f, 0xd8a13a, 0x93a58a, 0x7e95a6, 0xefe0c6, 0xc26a4a, 0x8f6b4a, 0xa65d43];
const roofColors = [0x6d4a35, 0x59483a, 0x6a5a4a, 0x7a4a3a];
const hullColors = [0x2f4a4a, 0x4a3b2f, 0x6d2f2f, 0x2f4a3b, 0x3b3b4a, 0x6d5a2f];

function mat(color, rough = 0.7) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.02 });
}

/* ---------- Stepped canal house ---------- */
function makeHouse(w, h) {
  const g = new THREE.Group();
  const d = 2.1;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(houseColors[(Math.random() * houseColors.length) | 0]));
  body.position.y = h / 2;
  g.add(body);

  // stepped gable
  let prevW = w;
  let y = h;
  for (let i = 0; i < 2; i++) {
    const nw = prevW * 0.62;
    const nh = 0.55 + Math.random() * 0.4;
    const step = new THREE.Mesh(new THREE.BoxGeometry(nw, nh, d), mat(roofColors[(Math.random() * roofColors.length) | 0], 0.8));
    step.position.y = y + nh / 2;
    g.add(step);
    y += nh;
    prevW = nw;
  }
  return g;
}

/* ---------- Boat ---------- */
function makeBoat(provider, idx) {
  const g = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.95), mat(hullColors[idx % hullColors.length], 0.55));
  hull.position.y = 0.22;
  hull.userData.provider = provider;
  g.add(hull);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.72), mat(0xfff4e0, 0.6));
  cabin.position.set(0.1, 0.72, 0);
  g.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.12, 0.8), mat(0xc6533a, 0.7));
  roof.position.set(0.1, 1.06, 0);
  g.add(roof);

  const label = makeLabel(provider.name);
  label.position.y = 1.7;
  g.add(label);

  g.userData.hull = hull;
  g.userData.provider = provider;
  g.userData.baseY = 0;
  g.userData.bob = Math.random() * Math.PI * 2;
  return g;
}

/* ---------- Text label sprite ---------- */
function makeLabel(text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 96;
  const ctx = c.getContext('2d');
  ctx.font = '700 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(42,32,24,0.85)';
  ctx.fillText(text, 256, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(3.4, 0.64, 1);
  return sp;
}

/* ---------- Build the world ---------- */
const boats = [];
const boatHulls = [];

PROVIDERS.forEach((p, i) => {
  const boat = makeBoat(p, i);
  const side = (i % 2 === 0) ? -3.6 : 3.6;
  boat.position.set(side, 0, -7 - i * 6);
  boats.push(boat);
  boatHulls.push(boat.userData.hull);
  scene.add(boat);
});

// Canal houses on both banks
for (let bank = -1; bank <= 1; bank += 2) {
  const x = bank * 5.2;
  let z = 4;
  while (z > -180) {
    const w = 1.4 + Math.random() * 1.1;
    const h = 2.4 + Math.random() * 2.6;
    const house = makeHouse(w, h);
    house.position.set(x + (Math.random() - 0.5) * 1.2, 0, z);
    scene.add(house);
    z -= w + 0.4 + Math.random() * 0.5;
  }
}

/* ---------- Pointer / steering ---------- */
const pointer = new THREE.Vector2(-10, -10);
let mouseX = 0, mouseY = 0;

window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  pointer.set(mouseX, -mouseY);
  hintEl.style.opacity = '0';
});

/* ---------- Raycast (click + hover) ---------- */
const raycaster = new THREE.Raycaster();
let hovered = null;

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(boatHulls);
  if (hits.length) {
    openCard(hits[0].object.userData.provider);
  }
});

/* ---------- Card + panel logic ---------- */
function openCard(p) {
  cardCat.textContent = p.cat;
  cardName.textContent = p.name;
  cardTag.textContent = p.tag;
  cardPrice.textContent = p.price;
  cardBook.href = '#'; // TODO: real reseller/affiliate link
  cardEl.classList.add('open');
  cardEl.setAttribute('aria-hidden', 'false');
}

function closeCard() { cardEl.classList.remove('open'); cardEl.setAttribute('aria-hidden', 'true'); }
cardClose.addEventListener('click', closeCard);
cardEl.addEventListener('click', (e) => { if (e.target === cardEl) closeCard(); });

function openPanel() { panelEl.classList.add('open'); panelEl.setAttribute('aria-hidden', 'false'); }
function closePanel() { panelEl.classList.remove('open'); panelEl.setAttribute('aria-hidden', 'true'); }
listBtn.addEventListener('click', openPanel);
panelClose.addEventListener('click', closePanel);

PROVIDERS.forEach((p) => {
  const item = document.createElement('div');
  item.className = 'panel-item';
  item.innerHTML = `<div class="panel-item__cat">${p.cat}</div><div class="panel-item__name">${p.name}</div><div class="panel-item__price">${p.price}</div>`;
  item.addEventListener('click', () => { closePanel(); openCard(p); });
  panelList.appendChild(item);
});

/* ---------- Resize ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- Animate ---------- */
const clock = new THREE.Clock();
let camZ = 16;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = Math.min(clock.getDelta(), 0.05);

  // glide forward (slower while hovering a boat)
  const glide = hovered ? 0.02 : 0.055;
  camZ -= glide;

  // steer with mouse
  const targetX = mouseX * 4.5;
  camera.position.x += (targetX - camera.position.x) * 0.045;
  camera.position.y = 3.4 + mouseY * 1.1;
  camera.position.z = camZ;
  camera.lookAt(camera.position.x * 0.5 + mouseX * 3, 2.1, camZ - 12);

  // animate water
  const arr = waterVerts.array;
  for (let i = 0; i < arr.length; i += 3) {
    const x = arr[i], z = arr[i + 2];
    arr[i + 1] = Math.sin(x * 0.45 + t * 1.1) * 0.1 + Math.cos(z * 0.28 + t * 1.5) * 0.09;
  }
  waterVerts.needsUpdate = true;

  // bob boats
  boats.forEach((b) => {
    b.position.y = Math.sin(t * 1.6 + b.userData.bob) * 0.07;
    b.rotation.z = Math.sin(t * 1.1 + b.userData.bob) * 0.02;
  });

  // hover highlight
  if (pointer.x > -10) {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(boatHulls);
    const h = hits.length ? hits[0].object : null;
    if (h !== hovered) {
      if (hovered) hovered.material.emissive.setHex(0x000000);
      hovered = h;
      if (hovered) hovered.material.emissive.setHex(0x7a2a1a);
    }
  }

  renderer.render(scene, camera);
}

animate();
