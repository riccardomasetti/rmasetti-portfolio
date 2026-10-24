// A section-anchored ASCII field, shaped by continuously evolving noise.
function initPointerGlow() {
  const home = document.querySelector('#home.portfolio-section');
  if (!home) return;
  const preference = window.matchMedia('(prefers-reduced-motion: no-preference)');
  let cleanup = () => {};

  const syncPreference = () => {
    cleanup();
    if (!preference.matches) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.className = 'ambient-fog ambient-fog-visible';
    canvas.setAttribute('aria-hidden', 'true');
    home.appendChild(canvas);
    const controller = new AbortController();
    const noise = Float32Array.from({ length: 256 * 256 }, () => Math.random());
    const sample = (x, y) => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      let fx = x - ix;
      let fy = y - iy;
      fx = fx * fx * (3 - 2 * fx);
      fy = fy * fy * (3 - 2 * fy);
      const row = (iy & 255) * 256;
      const nextRow = ((iy + 1) & 255) * 256;
      const a = noise[row + (ix & 255)];
      const b = noise[row + ((ix + 1) & 255)];
      const c = noise[nextRow + (ix & 255)];
      const d = noise[nextRow + ((ix + 1) & 255)];
      return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
    };
    const field = (x, y, t) => {
      let value = 0;
      let amplitude = 0.57;
      // Different scales drift in different directions, continually dissolving the texture.
      for (let octave = 0; octave < 4; octave++) {
        value += amplitude * sample(x + t * (octave % 2 ? -0.7 : 1), y + t * (0.35 + octave * 0.17));
        x = x * 1.93 + 17.2;
        y = y * 2.07 - 11.8;
        amplitude *= 0.5;
      }
      return value / 1.06875;
    };
    const clamp = value => Math.max(0, Math.min(1, value));
    const glyphs = '.,:;+*';
    const accents = '$#[]{}<>/=';
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let phase = Math.random() * 100;
    let visible = false;
    let pointer = null;
    let pointerActive = false;
    let pointerMix = 0;

    const draw = now => {
      frame = 0;
      if (!visible || document.hidden) { previousTime = 0; return; }
      const elapsed = previousTime ? now - previousTime : 40;
      if (elapsed < 40) { frame = requestAnimationFrame(draw); return; }
      previousTime = now;
      const dt = Math.min(elapsed, 80) / 1000;
      phase += dt * 0.24;
      pointerMix += ((pointerActive ? 1 : 0) - pointerMix) * (1 - Math.exp(-dt * 5));
      context.clearRect(0, 0, width, height);
      context.font = '12px ui-monospace, SFMono-Regular, Consolas, monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#5895d7';
      const scale = 3.3 / Math.max(height, 500);
      const radius = Math.min(190, width * 0.45);

      for (let row = 0, sy = 10; sy < height; row++, sy += 19) {
        for (let col = 0, sx = 7; sx < width; col++, sx += 14) {
          // Stable variation breaks up the grid without flickering between frames.
          const cell = ((row * 131 + col) * 7) & 65535;
          if (noise[cell] < 0.06) continue;
          const jitterX = (noise[(cell + 1) & 65535] - 0.5) * 3;
          const jitterY = (noise[(cell + 2) & 65535] - 0.5) * 4;
          const x = sx * scale;
          const y = sy * scale;
          let clearing = 1;
          if (pointer && pointerMix > 0.005) {
            const dx = sx - pointer.x;
            const dy = sy - pointer.y;
            const influence = Math.exp(-(dx * dx + dy * dy) / (radius * radius)) * pointerMix;
            clearing = 1 - influence * 0.98;
          }
          const warpX = field(x * 0.75 + 12.4, y * 0.75 + 5.2, phase * 0.7);
          const warpY = field(x * 0.75 - 2.1, y * 0.75 + 25.7, phase * 0.55);
          const density = field(x + warpX * 1.8, y + warpY * 1.8, phase);
          const fog = clamp((density - 0.34) / 0.36);
          if (fog < 0.08) continue;
          // Keep the text area quiet while the cloud remains stronger at the edges.
          const centre = Math.exp(-(((sx - width / 2) / (width * 0.36)) ** 2
            + ((sy - height * 0.46) / (height * 0.32)) ** 2));
          context.globalAlpha = fog ** 1.3 * (0.48 - centre * 0.22) * clearing;
          const character = noise[(cell + 3) & 65535] < 0.18
            ? accents[Math.floor(noise[(cell + 4) & 65535] * accents.length)]
            : glyphs[Math.min(glyphs.length - 1, Math.floor(fog * glyphs.length))];
          context.fillText(character,
            sx + jitterX + (warpX - 0.5) * 9,
            sy + jitterY + (warpY - 0.5) * 9);
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      width = home.clientWidth;
      height = home.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      start();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(home);
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    });
    visibilityObserver.observe(home);
    const clearPointer = () => { pointerActive = false; };
    home.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = home.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      pointerActive = true;
    }, { passive: true, signal: controller.signal });
    home.addEventListener('pointerleave', clearPointer, { signal: controller.signal });
    window.addEventListener('blur', clearPointer, { signal: controller.signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        clearPointer();
      } else start();
    }, { signal: controller.signal });
    resize();
    cleanup = () => {
      controller.abort();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      cancelAnimationFrame(frame);
      canvas.remove();
    };
  };
  preference.addEventListener('change', syncPreference);
  syncPreference();
}
