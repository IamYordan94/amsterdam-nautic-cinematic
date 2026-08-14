/**
 * scrub.js — canvas scroll-scrub renderer (image-sequence technique).
 *
 * Plays back a pre-rendered frame sequence inside a hero container as the
 * user scrolls. No GSAP/Three dependency: the page's main.js drives it by
 * calling setProgress(scrollProgress) from its own scroll handler.
 *
 * Usage:
 *   import { createScrub } from './scrub.js';
 *   const scrub = createScrub({
 *     container: document.getElementById('heroScrub'),
 *     count: 106,
 *     basePath: 'video/frames',
 *   });
 *   await scrub.ready;
 *   onScroll(p => scrub.setProgress(p));
 *   // when tearing the page down: scrub.dispose();
 */

const FRAME_W = 864;
const FRAME_H = 462;

export function createScrub({ container, count, basePath }) {
  if (!container) {
    throw new Error('scrub: container is required');
  }

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // ---- frame preloading -------------------------------------------------
  const images = new Array(count);
  let lastLoadedIndex = -1;
  let currentFrame = -1;

  const ready = new Promise((resolve) => {
    if (count <= 0) {
      resolve();
      return;
    }

    let remaining = count;
    const frameUrl = (i) =>
      `${basePath}/frame-${String(i + 1).padStart(4, '0')}.webp`;

    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        images[i] = img;
        lastLoadedIndex = i;
        if (--remaining === 0) finish();
      };
      img.onerror = () => {
        console.warn(`scrub: failed to preload frame ${i + 1}`);
        if (--remaining === 0) finish();
      };
      img.src = frameUrl(i);
    }

    function finish() {
      // Ensure the hero isn't blank before the first scroll tick.
      if (currentFrame === -1) {
        currentFrame = 0;
        draw();
      }
      resolve();
    }
  });

  // ---- draw (cover fit, center-crop) -----------------------------------
  function resolveImage() {
    if (currentFrame >= 0 && images[currentFrame]) return images[currentFrame];
    // Fallback: last successfully loaded frame (any position).
    if (lastLoadedIndex >= 0) return images[lastLoadedIndex];
    return null;
  }

  function draw() {
    if (!ctx) return;

    const img = resolveImage();
    if (!img) return;

    const iw = img.naturalWidth || img.width || FRAME_W;
    const ih = img.naturalHeight || img.height || FRAME_H;
    if (!iw || !ih) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ---- sizing / resize --------------------------------------------------
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.clientWidth;
    const h = container.clientHeight;
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    draw();
  }

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  // ---- public API --------------------------------------------------------
  function setProgress(p) {
    const clamped = Math.min(1, Math.max(0, Number(p) || 0));
    const idx = Math.round(clamped * (count - 1));
    if (idx === currentFrame) return;
    currentFrame = idx;
    draw();
  }

  function dispose() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    } else {
      window.removeEventListener('resize', resize);
    }
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    images.length = 0;
    currentFrame = -1;
    lastLoadedIndex = -1;
  }

  return { ready, setProgress, dispose };
}
