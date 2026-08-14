/* ============================================================
   VAART — golden-hour 3D harbor (Three.js)
   25 boat-tour providers as stylized 3D boats in 5 clusters.
   Self-contained ES module; imports sibling providers.js.
   ============================================================ */

import * as THREE from 'three';
import { PROVIDERS, GROUPS, GROUP_ORDER } from './providers.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SPACING = 3.4;

// Warm palette only — terracotta / ochre / teal / cream / brick / wood.
// No cold blues or greys anywhere.
const PALETTE = {
  klassiek: { hull: [0x5a3526, 0x6a4230, 0x4a2c1e], roof: 0xefe0c0, glass: 0x9fd8c8 },
  open:     { hull: [0xc6533a, 0xb5452f, 0x9c4432], deck: 0x7a5a3a, console: 0xefe0c0 },
  zelf:     { hull: [0xd8a13a, 0xc98a2e, 0xb57a26], motor: 0x5a3526 },
  diner:    { hull: [0x8a3b5c, 0x74314d, 0x9c4a3a], cabin: 0x4a2c1e, window: 0xffc37a, deck: 0x7a5a3a },
  natuur:   { hull: [0x8b5e3c, 0x7a5032], roof: 0xefe0c0, deck: 0x7a5a3a },
};

const LAYOUT = {
  klassiek: { center: [-14, -6], rows: 1 },
  open:     { center: [0, 4], rows: 2, perRow: 6 },
  zelf:     { center: [14, -6], rows: 1 },
  diner:    { center: [-8, 10], rows: 1 },
  natuur:   { center: [12, 10], rows: 1 },
};

export function createHarbor({ container, onSelect }) {
  // ------------------------------------------------------------ renderer / scene / camera
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.cursor = 'default';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf7e3c4); // warm cream-orange sky
  scene.fog = new THREE.Fog(0xf2e2c8, 25, 90);  // warm fog

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 220);
  const baseElevation = Math.atan2(13, 30);
  const radius = Math.hypot(13, 30);
  let azimuth = 0;
  let elevation = baseElevation;
  let azimuthTarget = 0;
  let elevationTarget = baseElevation;

  function placeCamera() {
    camera.position.set(
      radius * Math.cos(elevation) * Math.sin(azimuth),
      radius * Math.sin(elevation),
      radius * Math.cos(elevation) * Math.cos(azimuth)
    );
    camera.lookAt(0, 0, 0);
  }
  placeCamera();

  // ------------------------------------------------------------ lights (warm golden hour)
  const sun = new THREE.DirectionalLight(0xffd9a8, 1.6);
  sun.position.set(-18, 22, 12);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xfff2e2, 0.9));
  const fill = new THREE.DirectionalLight(0xffe6c0, 0.5);
  fill.position.set(20, 8, -6);
  scene.add(fill);

  // ------------------------------------------------------------ water
  const waterGeo = new THREE.PlaneGeometry(140, 140, 44, 44);
  const waterBase = waterGeo.attributes.position.array.slice();
  const water = new THREE.Mesh(
    waterGeo,
    new THREE.MeshStandardMaterial({ color: 0x6aa79c, roughness: 0.35, metalness: 0.08 })
  );
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // ------------------------------------------------------------ shared builders
  const geoCache = new Map();
  function boxGeo(w, h, d) {
    const k = `${w}|${h}|${d}`;
    if (!geoCache.has(k)) geoCache.set(k, new THREE.BoxGeometry(w, h, d));
    return geoCache.get(k);
  }
  function box(w, h, d, mat, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(boxGeo(w, h, d), mat);
    m.position.set(x, y, z);
    return m;
  }
  const std = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.08, ...opts });
  const glassMat = () =>
    new THREE.MeshPhongMaterial({
      color: PALETTE.klassiek.glass, transparent: true, opacity: 0.35,
      shininess: 70, specular: 0xfff2e2,
    });

  function makeLabelSprite(text) {
    const font = 'bold 34px sans-serif';
    const padX = 26, padY = 14;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.font = font;
    const tw = ctx.measureText(text).width;
    const w = Math.ceil(tw + padX * 2);
    const h = Math.ceil(34 + padY * 2);
    c.width = w;
    c.height = h;
    ctx.font = font;
    const r = h / 2;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.arcTo(w, 0, w, r, r);
    ctx.lineTo(w, h - r);
    ctx.arcTo(w, h, w - r, h, r);
    ctx.lineTo(r, h);
    ctx.arcTo(0, h, 0, h - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,248,236,0.9)';
    ctx.fill();
    ctx.fillStyle = '#2a2018';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 1);

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    const aspect = w / h;
    let wh = 0.7;
    let ww = wh * aspect;
    if (ww > 4.4) { ww = 4.4; wh = ww / aspect; }
    sprite.scale.set(ww, wh, 1);
    return sprite;
  }

  // ------------------------------------------------------------ boat archetypes
  function buildBoat(provider, idx) {
    const g = provider.group;
    const p = PALETTE[g];
    const hullVariant = p.hull[idx % p.hull.length];

    const group = new THREE.Group();
    const b = {
      group, provider, gkey: g,
      hull: null, hullMat: null, origEmissive: 0,
      label: null, labelBase: new THREE.Vector3(),
      mats: [], yTarget: 0, sink: 0, hovered: false,
      fade: 1, fadeTarget: 1, filtered: false, labelOpacityTarget: 1,
    };
    const add = (mesh, mat, base = 1) => {
      group.add(mesh);
      b.mats.push({ mat, base });
      return mesh;
    };

    // fake shadow (small dark semi-transparent circle under the hull)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: 0.14, depthWrite: false,
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);
    b.mats.push({ mat: shadowMat, base: 0.14 });

    switch (g) {
      case 'klassiek': {
        const hullMat = std(hullVariant, { roughness: 0.6 });
        b.hull = add(box(1.1, 0.4, 3.2, hullMat, 0, 0.2, 0), hullMat);
        b.hullMat = hullMat;
        b.origEmissive = hullMat.emissive.getHex();
        const gm = glassMat();
        add(box(0.9, 0.5, 1.8, gm, 0, 0.55, 0.35), gm, 0.35);
        const roofMat = std(p.roof);
        add(box(1.0, 0.08, 1.9, roofMat, 0, 0.84, 0.35), roofMat);
        break;
      }
      case 'open': {
        const hullMat = std(hullVariant, { roughness: 0.65 });
        b.hull = add(box(1.0, 0.35, 2.6, hullMat, 0, 0.175, 0), hullMat);
        b.hullMat = hullMat;
        b.origEmissive = hullMat.emissive.getHex();
        const deckMat = std(p.deck);
        add(box(0.85, 0.06, 0.34, deckMat, 0, 0.42, -0.55), deckMat);
        add(box(0.85, 0.06, 0.34, deckMat, 0, 0.42, 0), deckMat);
        add(box(0.85, 0.06, 0.34, deckMat, 0, 0.42, 0.55), deckMat);
        const consoleMat = std(p.console);
        add(box(0.5, 0.42, 0.42, consoleMat, 0, 0.4, -1.05), consoleMat);
        break;
      }
      case 'zelf': {
        const hullMat = std(hullVariant, { roughness: 0.6 });
        b.hull = add(box(0.9, 0.35, 2.2, hullMat, 0, 0.175, 0), hullMat);
        b.hullMat = hullMat;
        b.origEmissive = hullMat.emissive.getHex();
        const motorMat = std(p.motor);
        add(box(0.36, 0.55, 0.3, motorMat, 0, 0.28, -1.25), motorMat);
        add(box(0.05, 0.05, 0.7, motorMat, 0, 0.42, -0.75), motorMat);
        break;
      }
      case 'diner': {
        const hullMat = std(hullVariant, { roughness: 0.6 });
        b.hull = add(box(1.2, 0.45, 3.4, hullMat, 0, 0.225, 0), hullMat);
        b.hullMat = hullMat;
        b.origEmissive = hullMat.emissive.getHex();
        const cabinMat = std(p.cabin, { roughness: 0.55 });
        add(box(1.0, 0.55, 2.0, cabinMat, 0, 0.68, 0.1), cabinMat);
        const winMat = new THREE.MeshStandardMaterial({
          color: 0xffe0b0, emissive: p.window, emissiveIntensity: 0.9, roughness: 0.6,
        });
        add(box(1.02, 0.22, 0.03, winMat, 0, 0.68, 1.115), winMat);
        add(box(1.02, 0.22, 0.03, winMat, 0, 0.68, -0.915), winMat);
        const deckMat = std(p.deck);
        add(box(0.34, 0.03, 0.34, deckMat, 0, 0.55, -1.15), deckMat);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 6), deckMat);
        leg.position.set(0, 0.4, -1.15);
        add(leg, deckMat);
        break;
      }
      case 'natuur': {
        const hullMat = std(hullVariant, { roughness: 0.7 });
        b.hull = add(box(0.7, 0.3, 2.6, hullMat, 0, 0.15, 0), hullMat);
        b.hullMat = hullMat;
        b.origEmissive = hullMat.emissive.getHex();
        const roofMat = std(p.roof);
        add(box(0.6, 0.06, 1.1, roofMat, 0, 0.5, 0.1), roofMat);
        const deckMat = std(p.deck);
        add(box(0.55, 0.05, 0.4, deckMat, 0, 0.35, -0.5), deckMat);
        break;
      }
    }

    b.hull.userData.boat = b;

    b.label = makeLabelSprite(provider.name);
    b.label.position.y = 1.6;
    b.labelBase.copy(b.label.scale);
    group.add(b.label);

    return b;
  }

  // ------------------------------------------------------------ layout (5 clusters)
  const boats = [];
  const centroids = {};
  const byGroup = {};
  for (const key of GROUP_ORDER) byGroup[key] = [];
  for (const p of PROVIDERS) byGroup[p.group].push(p);

  for (const key of GROUP_ORDER) {
    const cfg = LAYOUT[key];
    const list = byGroup[key];
    const [cx, cz] = cfg.center;
    const rowCount = cfg.rows || 1;
    const perRow = cfg.perRow || Math.ceil(list.length / rowCount);
    let placed = 0;
    let sumX = 0, sumZ = 0;
    for (let r = 0; r < rowCount && placed < list.length; r++) {
      const rowN = Math.min(perRow, list.length - placed);
      const rz = cz - r * 3; // second row offset z -3
      for (let i = 0; i < rowN; i++) {
        const provider = list[placed];
        const b = buildBoat(provider, placed);
        const x = (i - (rowN - 1) / 2) * SPACING + cx;
        b.group.position.set(x, 0, rz);
        // gentle fan toward scene centre + a touch of life
        b.group.rotation.y = clamp(-x * 0.02, -0.35, 0.35) + (Math.random() - 0.5) * 0.16;
        scene.add(b.group);
        boats.push(b);
        sumX += x;
        sumZ += rz;
        placed++;
      }
    }
    centroids[key] = { x: sumX / placed, z: sumZ / placed };
  }

  let rayHulls = boats.map((b) => b.hull);
  let filterKey = null;

  // ------------------------------------------------------------ pointer / orbit / hover / click
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let dragging = false;
  let downX = 0, downY = 0, lastX = 0, lastY = 0, moved = 0;
  let pressBoat = null;
  let hoveredBoat = null;

  function updatePointer(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function hullAt(e) {
    updatePointer(e);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(rayHulls, false);
    return hits.length ? hits[0].object.userData.boat : null;
  }

  function setHover(boat) {
    if (boat === hoveredBoat) return;
    if (hoveredBoat) {
      hoveredBoat.hovered = false;
      hoveredBoat.hullMat.emissive.setHex(hoveredBoat.origEmissive);
    }
    hoveredBoat = boat;
    renderer.domElement.style.cursor = boat ? 'pointer' : 'default';
    if (boat) {
      boat.hovered = true;
      boat.hullMat.emissive.setHex(0x332211);
    }
  }

  function onPointerDown(e) {
    dragging = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    moved = 0;
    pressBoat = hullAt(e);
  }

  function onPointerMove(e) {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      azimuthTarget = clamp(azimuthTarget - dx * 0.004, -0.35, 0.35);
      elevationTarget = clamp(elevationTarget + dy * 0.0025, baseElevation - 0.1, baseElevation + 0.1);
    }
    setHover(hullAt(e));
  }

  function onPointerUp() {
    dragging = false;
    if (moved < 6 && pressBoat && onSelect) onSelect(pressBoat.provider);
    pressBoat = null;
  }

  function onPointerLeave() {
    dragging = false;
    pressBoat = null;
    setHover(null);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerLeave);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);

  // ------------------------------------------------------------ filter
  function setFilter(key) {
    filterKey = key;
    for (const b of boats) {
      b.filtered = key !== null && b.gkey !== key;
      b.fadeTarget = b.filtered ? 0.25 : 1;
      b.sink = b.filtered ? -0.3 : 0;
      b.labelOpacityTarget = b.filtered ? 0 : 1;
    }
    rayHulls = boats.filter((b) => !b.filtered).map((b) => b.hull);
    if (key && centroids[key]) {
      azimuthTarget = clamp(-centroids[key].x * 0.03, -0.35, 0.35);
    } else {
      azimuthTarget = 0;
    }
    if (hoveredBoat && hoveredBoat.filtered) setHover(null);
  }

  // ------------------------------------------------------------ resize
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(resize);
    ro.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  // ------------------------------------------------------------ render loop
  const clock = new THREE.Clock();
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // water waves
    const pos = waterGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = waterBase[i * 3];
      const y = waterBase[i * 3 + 1];
      pos.array[i * 3 + 2] =
        Math.sin(x * 0.16 + t * 1.1) * 0.03 + Math.cos(y * 0.13 + t * 0.8) * 0.03;
    }
    pos.needsUpdate = true;

    // camera (idle drift only when free)
    const drift = (!dragging && filterKey === null) ? 0.05 * Math.sin(t * 0.12) : 0;
    azimuth += (azimuthTarget + drift - azimuth) * 0.05;
    elevation += (elevationTarget - elevation) * 0.05;
    placeCamera();

    // boats
    for (const b of boats) {
      b.yTarget = b.sink + (b.hovered ? 0.12 : 0);
      b.group.position.y += (b.yTarget - b.group.position.y) * 0.12;
      b.fade += (b.fadeTarget - b.fade) * 0.12;
      const transparent = b.fade < 0.999;
      for (const m of b.mats) {
        m.mat.opacity = m.base * b.fade;
        m.mat.transparent = transparent || m.base < 1;
      }
      const lm = b.label.material;
      lm.opacity += (b.labelOpacityTarget - lm.opacity) * 0.12;
      const s = b.hovered ? 1.15 : 1;
      b.label.scale.x += (b.labelBase.x * s - b.label.scale.x) * 0.15;
      b.label.scale.y += (b.labelBase.y * s - b.label.scale.y) * 0.15;
    }

    renderer.render(scene, camera);
  }
  animate();

  // ------------------------------------------------------------ dispose
  function dispose() {
    cancelAnimationFrame(rafId);
    if (ro) ro.disconnect();
    window.removeEventListener('resize', resize);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerLeave);
    renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m.map) m.map.dispose();
          m.dispose();
        }
      }
    });
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { setFilter, resize, dispose };
}
