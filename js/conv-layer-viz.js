/* ─────────────────────────────────────────────────────────
   conv-layer-viz.js
   Visualises a single convolution layer step:
   - 7×7 input grid (hand-drawn edge pattern)
   - 3×3 filter (highlighted sliding window)
   - 5×5 output feature map (computed dot products)
   Click a cell in the output to highlight which input region
   produced it. Animated scan on load.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('conv-layer-viz');
  if (!container) return;

  /* ── Input: 7×7 greyscale patch with a vertical edge ── */
  var INPUT = [
    [0.9, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1],
    [0.9, 0.9, 0.8, 0.1, 0.1, 0.1, 0.1],
    [0.9, 0.8, 0.9, 0.2, 0.1, 0.1, 0.1],
    [0.8, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1],
    [0.9, 0.9, 0.8, 0.1, 0.1, 0.1, 0.1],
    [0.9, 0.8, 0.9, 0.2, 0.1, 0.1, 0.1],
    [0.9, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1]
  ];

  /* ── Filter: vertical edge detector (Sobel-like) ── */
  var FILTER = [
    [ 1,  0, -1],
    [ 1,  0, -1],
    [ 1,  0, -1]
  ];

  var IN_SIZE = 7, F_SIZE = 3, OUT_SIZE = IN_SIZE - F_SIZE + 1; // 5

  /* compute output */
  var OUTPUT = [];
  for (var r = 0; r < OUT_SIZE; r++) {
    OUTPUT[r] = [];
    for (var c = 0; c < OUT_SIZE; c++) {
      var sum = 0;
      for (var fr = 0; fr < F_SIZE; fr++)
        for (var fc = 0; fc < F_SIZE; fc++)
          sum += INPUT[r+fr][c+fc] * FILTER[fr][fc];
      OUTPUT[r][c] = sum;
    }
  }

  var maxOut = Math.max.apply(null, OUTPUT.map(function(row){ return Math.max.apply(null, row.map(Math.abs)); }));

  /* ── Layout ── */
  var CELL = 32, GAP = 28;
  var IN_W  = IN_SIZE  * CELL;
  var OUT_W = OUT_SIZE * CELL;
  var F_W   = F_SIZE   * CELL;
  var totalW = IN_W + GAP + F_W + GAP + OUT_W + 40;
  var totalH = Math.max(IN_SIZE, F_SIZE) * CELL + 60;

  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function grayHex(v) {
    var c = Math.round((1 - v) * 220 + 18);
    return 'rgb(' + c + ',' + c + ',' + c + ')';
  }
  function outColor(v, max) {
    var t = v / max; // -1 to 1
    if (t >= 0) return 'rgb(74,144,' + Math.round(50 + t * 167) + ')';
    return 'rgb(' + Math.round(220 + t * 120) + ',80,80)';
  }

  var svg = el('svg', {
    width: totalW, height: totalH,
    style: 'display:block;margin:0 auto;font-family:sans-serif;overflow:visible'
  });
  container.appendChild(svg);

  var offX_in  = 0;
  var offX_f   = IN_W + GAP;
  var offX_out = IN_W + GAP + F_W + GAP;
  var offY     = 30;

  /* labels */
  function addLabel(x, y, text) {
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': 11, fill: '#666' });
    t.textContent = text;
    svg.appendChild(t);
  }
  addLabel(offX_in  + IN_W/2,  16, 'Input (7×7)');
  addLabel(offX_f   + F_W/2,   16, 'Filter (3×3)');
  addLabel(offX_out + OUT_W/2, 16, 'Feature map (5×5)');

  /* draw input grid */
  var inputCells = [];
  for (var r = 0; r < IN_SIZE; r++) {
    inputCells[r] = [];
    for (var c = 0; c < IN_SIZE; c++) {
      var rect = el('rect', {
        x: offX_in + c * CELL, y: offY + r * CELL,
        width: CELL - 1, height: CELL - 1,
        fill: grayHex(INPUT[r][c]), rx: 2
      });
      svg.appendChild(rect);
      inputCells[r][c] = rect;
    }
  }

  /* filter grid */
  for (var fr2 = 0; fr2 < F_SIZE; fr2++) {
    for (var fc2 = 0; fc2 < F_SIZE; fc2++) {
      var v = FILTER[fr2][fc2];
      var fill = v > 0 ? '#c8e6c9' : v < 0 ? '#ffcdd2' : '#f5f5f5';
      svg.appendChild(el('rect', {
        x: offX_f + fc2 * CELL, y: offY + fr2 * CELL,
        width: CELL - 1, height: CELL - 1,
        fill: fill, stroke: '#aaa', 'stroke-width': 0.5, rx: 2
      }));
      var vt = el('text', {
        x: offX_f + fc2 * CELL + CELL/2,
        y: offY + fr2 * CELL + CELL/2 + 4,
        'text-anchor': 'middle', 'font-size': 11, fill: '#444'
      });
      vt.textContent = v > 0 ? '+1' : v < 0 ? '-1' : '0';
      svg.appendChild(vt);
    }
  }

  /* output grid */
  var outputCells = [];
  for (var r2 = 0; r2 < OUT_SIZE; r2++) {
    outputCells[r2] = [];
    for (var c2 = 0; c2 < OUT_SIZE; c2++) {
      (function(r2, c2) {
        var rect = el('rect', {
          x: offX_out + c2 * CELL, y: offY + r2 * CELL,
          width: CELL - 1, height: CELL - 1,
          fill: outColor(OUTPUT[r2][c2], maxOut),
          rx: 2, cursor: 'pointer', stroke: 'none', 'stroke-width': 2
        });
        var vt = el('text', {
          x: offX_out + c2 * CELL + CELL/2,
          y: offY + r2 * CELL + CELL/2 + 4,
          'text-anchor': 'middle', 'font-size': 9, fill: '#fff'
        });
        vt.textContent = OUTPUT[r2][c2].toFixed(1);
        svg.appendChild(rect);
        svg.appendChild(vt);
        outputCells[r2][c2] = rect;

        rect.addEventListener('mouseenter', function() { highlight(r2, c2); });
        rect.addEventListener('mouseleave', clearHighlight);
      })(r2, c2);
    }
  }

  /* sliding window highlight rect on input */
  var winRect = el('rect', {
    width: F_SIZE * CELL - 1, height: F_SIZE * CELL - 1,
    fill: 'none', stroke: '#e07b2a', 'stroke-width': 2.5,
    rx: 3, opacity: 0
  });
  svg.appendChild(winRect);

  function highlight(r, c) {
    winRect.setAttribute('x', offX_in + c * CELL);
    winRect.setAttribute('y', offY + r * CELL);
    winRect.setAttribute('opacity', 1);
    outputCells[r][c].setAttribute('stroke', '#e07b2a');
  }
  function clearHighlight() {
    winRect.setAttribute('opacity', 0);
    for (var r = 0; r < OUT_SIZE; r++)
      for (var c = 0; c < OUT_SIZE; c++)
        outputCells[r][c].setAttribute('stroke', 'none');
  }

  /* animate scan on load */
  var scanR = 0, scanC = 0, scanning = true;
  function scan() {
    if (!scanning) return;
    highlight(scanR, scanC);
    scanC++;
    if (scanC >= OUT_SIZE) { scanC = 0; scanR++; }
    if (scanR >= OUT_SIZE) { scanning = false; clearHighlight(); return; }
    setTimeout(scan, 120);
  }

  if (window.IntersectionObserver) {
    var obs = new IntersectionObserver(function(e) {
      if (e[0].isIntersecting && scanning && scanR === 0 && scanC === 0) scan();
    }, { threshold: 0.3 });
    obs.observe(container);
  } else {
    scan();
  }

  /* caption hint */
  var hint = document.createElement('p');
  hint.style.cssText = 'text-align:center;font-size:.8rem;color:#888;margin-top:.25rem;font-family:sans-serif;';
  hint.textContent = 'Hover an output cell to see which input region produced it.';
  container.appendChild(hint);

})();
