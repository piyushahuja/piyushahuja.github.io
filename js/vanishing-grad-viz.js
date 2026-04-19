/* ─────────────────────────────────────────────────────────
   vanishing-grad-viz.js
   Shows gradient magnitude per layer for sigmoid vs ReLU,
   side by side, animated. Bar height = log-normalised gradient.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('vanishing-grad-viz');
  if (!container) return;

  var N_LAYERS = 8;
  var W = 520, H = 220;
  var PAD = { top: 32, right: 24, bottom: 44, left: 52 };
  var IW = W - PAD.left - PAD.right;
  var IH = H - PAD.top - PAD.bottom;

  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* gradient magnitudes per layer (simulated, layer 0 = output) */
  function sigmoidGrads(n) {
    var g = [];
    for (var i = 0; i < n; i++) g.push(Math.pow(0.25, i));
    return g;
  }
  function reluGrads(n) {
    var g = [];
    for (var i = 0; i < n; i++) g.push(Math.pow(0.97, i)); // slight decay from dead neurons
    return g;
  }

  var svg = el('svg', { width: W, height: H, style: 'display:block;margin:0 auto;font-family:sans-serif' });
  container.appendChild(svg);

  /* axis */
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left + IW, y1: PAD.top + IH, y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left, y1: PAD.top, y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));

  /* axis label */
  var xLbl = el('text', { x: PAD.left + IW/2, y: H - 4, 'text-anchor': 'middle', 'font-size': 11, fill: '#888' });
  xLbl.textContent = 'Layer (output → input)';
  svg.appendChild(xLbl);
  var yLbl = el('text', { x: 12, y: PAD.top + IH/2, 'text-anchor': 'middle', 'font-size': 10, fill: '#888',
    transform: 'rotate(-90,12,' + (PAD.top + IH/2) + ')' });
  yLbl.textContent = '|gradient|';
  svg.appendChild(yLbl);

  /* legend */
  var ly = PAD.top - 4;
  [[' Sigmoid', '#c0392b'], [' ReLU', '#27ae60']].forEach(function(item, i) {
    var lx = PAD.left + i * 160;
    svg.appendChild(el('rect', { x: lx, y: ly, width: 14, height: 10, fill: item[1], opacity: 0.7 }));
    var t = el('text', { x: lx + 18, y: ly + 9, 'font-size': 10, fill: '#555' });
    t.textContent = item[0];
    svg.appendChild(t);
  });

  /* bars */
  var barWidth = IW / N_LAYERS;
  var sigBars = [], relBars = [], labels = [];

  for (var i = 0; i < N_LAYERS; i++) {
    var bx = PAD.left + i * barWidth;
    var bxSig = bx + barWidth * 0.1;
    var bxRel = bx + barWidth * 0.52;
    var bw = barWidth * 0.35;

    var sigBar = el('rect', { x: bxSig, y: PAD.top + IH, width: bw, height: 0, fill: '#c0392b', opacity: 0.7 });
    var relBar = el('rect', { x: bxRel, y: PAD.top + IH, width: bw, height: 0, fill: '#27ae60', opacity: 0.7 });
    svg.appendChild(sigBar);
    svg.appendChild(relBar);
    sigBars.push(sigBar);
    relBars.push(relBar);

    var lbl = el('text', { x: bx + barWidth/2, y: PAD.top + IH + 14, 'text-anchor': 'middle', 'font-size': 9, fill: '#888' });
    lbl.textContent = 'L' + (N_LAYERS - i);
    svg.appendChild(lbl);
    labels.push(lbl);
  }

  var frame = 0, N_FRAMES = 30, rafId = null;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(progress) {
    var sg = sigmoidGrads(N_LAYERS);
    var rg = reluGrads(N_LAYERS);
    var maxG = Math.max.apply(null, sg.concat(rg));

    for (var i = 0; i < N_LAYERS; i++) {
      var sh = easeOut(progress) * (sg[i] / maxG) * IH;
      var rh = easeOut(progress) * (rg[i] / maxG) * IH;
      sh = Math.max(sh, 1);
      rh = Math.max(rh, 1);
      sigBars[i].setAttribute('y', PAD.top + IH - sh);
      sigBars[i].setAttribute('height', sh);
      relBars[i].setAttribute('y', PAD.top + IH - rh);
      relBars[i].setAttribute('height', rh);
    }
  }

  function animate() {
    if (frame > N_FRAMES) return;
    draw(frame / N_FRAMES);
    frame++;
    rafId = requestAnimationFrame(function() { setTimeout(animate, 20); });
  }

  /* Intersection Observer: animate when in view */
  if (window.IntersectionObserver) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && frame === 0) animate();
    }, { threshold: 0.3 });
    obs.observe(container);
  } else {
    animate();
  }

})();
