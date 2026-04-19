/* ─────────────────────────────────────────────────────────
   convergence-viz.js — Perceptron convergence squeeze argument
   Shows alignment (W·W*) growing linearly, |W| growing as √t,
   and cosine being squeezed to 1. Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('convergence-viz');
  if (!container) return;

  /* ── Layout ─────────────────────────────────────────────── */
  var W = 520, H = 300;
  var PAD = { top: 28, right: 24, bottom: 44, left: 52 };
  var IW = W - PAD.left - PAD.right;
  var IH = H - PAD.top  - PAD.bottom;
  var N  = 40; // number of mistake steps to show

  /* ── Simulation constants (normalised) ──────────────────── */
  /* alignment grows as: A(t) = t  (linear, min-gain = 1 per step)  */
  /* magnitude grows as: M(t) = sqrt(t) * 1.4  (bounded per step)   */
  /* cosine = A(t) / (M(t) * |W*|),  |W*| = 1 (normalised)          */
  function alignment(t) { return t; }
  function magnitude(t)  { return Math.sqrt(t) * 1.4; }
  function cosine(t)     { return t > 0 ? Math.min(alignment(t) / magnitude(t), 1) : 0; }

  var maxA = alignment(N);
  var maxM = magnitude(N);
  var maxY = Math.max(maxA, maxM) * 1.08;

  /* ── Coordinate helpers ─────────────────────────────────── */
  function sx(t)  { return PAD.left + (t / N) * IW; }
  function sy(v)  { return PAD.top  + (1 - v / maxY) * IH; }
  function syC(v) { return PAD.top  + (1 - v) * IH; } /* cosine: 0–1 */

  /* ── SVG helpers ─────────────────────────────────────────── */
  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ── Build SVG ──────────────────────────────────────────── */
  var svg = el('svg', { width: W, height: H, style: 'display:block;margin:0 auto;font-family:sans-serif' });
  container.appendChild(svg);

  /* Grid lines */
  [0.25, 0.5, 0.75, 1.0].forEach(function(f) {
    svg.appendChild(el('line', {
      x1: PAD.left, x2: PAD.left + IW,
      y1: syC(f),   y2: syC(f),
      stroke: '#eee', 'stroke-width': 1
    }));
  });

  /* Axes */
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left + IW, y1: PAD.top + IH, y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left,      y1: PAD.top,      y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));

  /* Axis labels */
  svg.appendChild(el('text', { x: PAD.left + IW / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 11, fill: '#888' })).textContent = 'mistakes';

  /* Right-axis cosine label */
  var cosLabel = el('text', { x: PAD.left + IW + 6, y: syC(1.0) + 4, 'font-size': 10, fill: '#888' });
  cosLabel.textContent = '1.0';
  svg.appendChild(cosLabel);
  var cosLabel0 = el('text', { x: PAD.left + IW + 6, y: syC(0) + 4, 'font-size': 10, fill: '#888' });
  cosLabel0.textContent = '0';
  svg.appendChild(cosLabel0);

  /* Legend */
  var legendY = PAD.top + 4;
  [[' alignment  (W·W*)', '#4a90d9'], [' magnitude |W|', '#e07b2a'], [' cosine', '#27ae60']].forEach(function(item, i) {
    var lx = PAD.left + i * 148;
    svg.appendChild(el('line', { x1: lx, x2: lx + 18, y1: legendY + 5, y2: legendY + 5, stroke: item[1], 'stroke-width': 2.5 }));
    var t = el('text', { x: lx + 20, y: legendY + 9, 'font-size': 10, fill: '#555' });
    t.textContent = item[0];
    svg.appendChild(t);
  });

  /* ── Animated paths ─────────────────────────────────────── */
  var pathA = el('path', { fill: 'none', stroke: '#4a90d9', 'stroke-width': 2.5 });
  var pathM = el('path', { fill: 'none', stroke: '#e07b2a', 'stroke-width': 2.5 });
  var pathC = el('path', { fill: 'none', stroke: '#27ae60', 'stroke-width': 2.5, 'stroke-dasharray': '5,3' });
  svg.appendChild(pathA);
  svg.appendChild(pathM);
  svg.appendChild(pathC);

  /* Cosine = 1 reference line */
  svg.appendChild(el('line', {
    x1: PAD.left, x2: PAD.left + IW,
    y1: syC(1), y2: syC(1),
    stroke: '#27ae60', 'stroke-width': 1, 'stroke-dasharray': '3,4', opacity: 0.4
  }));

  /* ── Button ─────────────────────────────────────────────── */
  var btn = document.createElement('div');
  btn.style.cssText = 'text-align:center;margin-top:.4rem;';
  btn.innerHTML = '<button class="nn-btn" id="conv-run">▶ Run</button>';
  container.appendChild(btn);

  /* ── Animation ──────────────────────────────────────────── */
  var frame = 0, rafId = null, running = false;

  function buildPath(fn, tMax, scaleY) {
    /* scaleY: 'main' uses sy(), 'cosine' uses syC() */
    var d = '';
    for (var t = 0; t <= tMax; t++) {
      var v = fn(t);
      var x = sx(t);
      var y = scaleY === 'cosine' ? syC(v) : sy(v);
      d += (t === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    return d;
  }

  function draw(t) {
    pathA.setAttribute('d', buildPath(alignment, t, 'main'));
    pathM.setAttribute('d', buildPath(magnitude, t, 'main'));
    pathC.setAttribute('d', buildPath(cosine,    t, 'cosine'));
  }

  function animate() {
    if (frame > N) { running = false; document.getElementById('conv-run').textContent = '↺ Reset'; return; }
    draw(frame);
    frame++;
    rafId = requestAnimationFrame(function() { setTimeout(animate, 40); });
  }

  document.getElementById('conv-run').addEventListener('click', function() {
    if (running) return;
    if (frame > N) { frame = 0; draw(0); }
    running = true;
    this.textContent = '…';
    animate();
  });

  draw(0);
})();
