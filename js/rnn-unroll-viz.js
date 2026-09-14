/* ─────────────────────────────────────────────────────────
   rnn-unroll-viz.js
   Shows the "loop" view and "unrolled" view of an RNN.
   A token sequence animates step-by-step, with the hidden
   state h flowing right and the output y produced at each step.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('rnn-unroll-viz');
  if (!container) return;

  var W = 560, H = 200;
  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  var svg = el('svg', {
    width: W, height: H,
    style: 'display:block;margin:0 auto;font-family:sans-serif;overflow:visible'
  });
  container.appendChild(svg);

  /* ── Tokens ── */
  var TOKENS = ['The', 'cat', 'sat', 'on', 'mat'];
  var N = TOKENS.length;

  /* Layout */
  var cellW = 60, cellH = 36;
  var startX = 40, cellY = 80;
  var stepX  = 96; /* spacing between unrolled cells */

  /* ── Colours ── */
  var COL_CELL   = { fill: '#e8f0fb', stroke: '#4a90d9' };
  var COL_HIDDEN = { fill: '#fff3e0', stroke: '#e07b2a' };
  var COL_TOKEN  = { fill: '#eafaf1', stroke: '#27ae60' };
  var COL_ACTIVE = { fill: '#4a90d9', stroke: '#4a90d9' };

  /* ── Defs: arrowhead ── */
  var defs = el('defs', {});
  function makeMarker(id, col) {
    var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 4, refY: 3, orient: 'auto' });
    m.appendChild(el('path', { d: 'M0,1 L6,3 L0,5 Z', fill: col }));
    defs.appendChild(m);
  }
  makeMarker('arr-blue',   '#4a90d9');
  makeMarker('arr-orange', '#e07b2a');
  makeMarker('arr-green',  '#27ae60');
  svg.appendChild(defs);

  /* ── Build unrolled cells ── */
  var cells = [], tokenBoxes = [], hiddenBoxes = [], inputArrows = [], outputArrows = [], hiddenArrows = [];
  var hiddenLabels = [], tokenLabels = [], cellLabels = [];

  /* h0 ghost */
  var h0x = startX - stepX;
  var h0 = el('rect', { x: h0x, y: cellY, width: cellW, height: cellH,
    fill: COL_HIDDEN.fill, stroke: COL_HIDDEN.stroke, 'stroke-width': 1.5, rx: 4 });
  svg.appendChild(h0);
  var h0lbl = el('text', { x: h0x + cellW / 2, y: cellY + cellH / 2 + 4,
    'text-anchor': 'middle', 'font-size': 9, fill: '#e07b2a' });
  h0lbl.textContent = 'h₀';
  svg.appendChild(h0lbl);

  for (var i = 0; i < N; i++) {
    var cx = startX + i * stepX;
    var cy = cellY;

    /* Token input box */
    var tb = el('rect', { x: cx, y: cy + cellH + 16, width: cellW, height: 26,
      fill: COL_TOKEN.fill, stroke: COL_TOKEN.stroke, 'stroke-width': 1.5, rx: 4, opacity: 0.3 });
    svg.appendChild(tb);
    var tl = el('text', { x: cx + cellW / 2, y: cy + cellH + 16 + 16,
      'text-anchor': 'middle', 'font-size': 9, fill: '#27ae60', opacity: 0.3 });
    tl.textContent = TOKENS[i];
    svg.appendChild(tl);
    tokenBoxes.push(tb);
    tokenLabels.push(tl);

    /* Input arrow (token → cell) */
    var ia = el('line', {
      x1: cx + cellW / 2, y1: cy + cellH + 16,
      x2: cx + cellW / 2, y2: cy + cellH,
      stroke: '#27ae60', 'stroke-width': 1.5, 'marker-end': 'url(#arr-green)', opacity: 0.3
    });
    svg.appendChild(ia);
    inputArrows.push(ia);

    /* Cell */
    var cell = el('rect', { x: cx, y: cy, width: cellW, height: cellH,
      fill: COL_CELL.fill, stroke: COL_CELL.stroke, 'stroke-width': 1.5, rx: 4, opacity: 0.4 });
    svg.appendChild(cell);
    var cl = el('text', { x: cx + cellW / 2, y: cy + cellH / 2 + 4,
      'text-anchor': 'middle', 'font-size': 9, 'font-weight': 'bold', fill: '#4a90d9', opacity: 0.4 });
    cl.textContent = 'RNN';
    svg.appendChild(cl);
    cells.push(cell);
    cellLabels.push(cl);

    /* Hidden state arrow (cell → next cell) */
    if (i < N - 1) {
      var ha = el('line', {
        x1: cx + cellW, y1: cy + cellH / 2,
        x2: cx + stepX, y2: cy + cellH / 2,
        stroke: '#e07b2a', 'stroke-width': 2, 'marker-end': 'url(#arr-orange)', opacity: 0.3
      });
      svg.appendChild(ha);
      hiddenArrows.push(ha);
    }

    /* Hidden state label */
    var hl = el('text', { x: cx + cellW + (stepX - cellW) / 2, y: cy + cellH / 2 - 6,
      'text-anchor': 'middle', 'font-size': 8, fill: '#e07b2a', opacity: 0.3 });
    hl.textContent = 'h' + String.fromCharCode(0x2080 + (i + 1));
    svg.appendChild(hl);
    hiddenLabels.push(hl);

    /* Output arrow (cell → y) */
    var oa = el('line', {
      x1: cx + cellW / 2, y1: cy,
      x2: cx + cellW / 2, y2: cy - 20,
      stroke: '#aaa', 'stroke-width': 1.5, 'marker-end': 'url(#arr-blue)', opacity: 0.3
    });
    svg.appendChild(oa);
    outputArrows.push(oa);

    /* y label */
    var yl = el('text', { x: cx + cellW / 2, y: cy - 24,
      'text-anchor': 'middle', 'font-size': 9, fill: '#888', opacity: 0.3 });
    yl.textContent = 'y' + String.fromCharCode(0x2080 + (i + 1));
    svg.appendChild(yl);
    outputArrows.push(yl); /* reuse array for animation */
  }

  /* h0 arrow */
  var h0arr = el('line', {
    x1: h0x + cellW, y1: cellY + cellH / 2,
    x2: startX, y2: cellY + cellH / 2,
    stroke: '#e07b2a', 'stroke-width': 2, 'marker-end': 'url(#arr-orange)'
  });
  svg.appendChild(h0arr);

  /* ── Step animation ── */
  var currentStep = -1;

  function resetAll() {
    for (var i = 0; i < N; i++) {
      cells[i].setAttribute('opacity', 0.3);
      cellLabels[i].setAttribute('opacity', 0.3);
      tokenBoxes[i].setAttribute('opacity', 0.3);
      tokenLabels[i].setAttribute('opacity', 0.3);
      inputArrows[i].setAttribute('opacity', 0.3);
    }
    for (var j = 0; j < hiddenArrows.length; j++) {
      hiddenArrows[j].setAttribute('opacity', 0.3);
      hiddenLabels[j].setAttribute('opacity', 0.3);
    }
    for (var k = 0; k < outputArrows.length; k++) {
      outputArrows[k].setAttribute('opacity', 0.3);
    }
  }

  function activateStep(step) {
    resetAll();
    if (step < 0 || step >= N) return;

    /* Highlight cells 0..step */
    for (var i = 0; i <= step; i++) {
      cells[i].setAttribute('opacity', 1);
      cellLabels[i].setAttribute('opacity', 1);
      tokenBoxes[i].setAttribute('opacity', 1);
      tokenLabels[i].setAttribute('opacity', 1);
      inputArrows[i].setAttribute('opacity', 1);
    }
    /* Highlight arrows 0..step-1 */
    for (var j = 0; j < step && j < hiddenArrows.length; j++) {
      hiddenArrows[j].setAttribute('opacity', 1);
      hiddenLabels[j].setAttribute('opacity', 1);
    }
    /* Output at current step */
    outputArrows[step * 2].setAttribute('opacity', 1);
    outputArrows[step * 2 + 1].setAttribute('opacity', 1);

    /* Pulse current cell */
    cells[step].setAttribute('fill', '#4a90d9');
    cellLabels[step].setAttribute('fill', '#fff');
  }

  /* ── Buttons ── */
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'text-align:center;margin-top:.5rem;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;';

  var btnStep = document.createElement('button');
  btnStep.className = 'nn-btn';
  btnStep.textContent = '▶ Step';
  btnStep.addEventListener('click', function() {
    currentStep = (currentStep + 1) % N;
    activateStep(currentStep);
  });

  var btnReset = document.createElement('button');
  btnReset.className = 'nn-btn';
  btnReset.textContent = 'Reset';
  btnReset.addEventListener('click', function() {
    currentStep = -1;
    resetAll();
  });

  btnRow.appendChild(btnStep);
  btnRow.appendChild(btnReset);
  container.appendChild(btnRow);

  /* Auto-animate on entry */
  if (window.IntersectionObserver) {
    var animated = false;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        var s = 0;
        function autoStep() {
          currentStep = s;
          activateStep(s);
          s++;
          if (s < N) setTimeout(autoStep, 700);
        }
        setTimeout(autoStep, 400);
      }
    }, { threshold: 0.3 });
    obs.observe(container);
  }

  resetAll();

})();
