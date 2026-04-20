/* ─────────────────────────────────────────────────────────
   filter-stack-viz.js
   Shows how stacking 3×3 convolutions builds up the same
   receptive field as a single large filter, with fewer params.
   Slider controls number of stacked 3×3s (1–3).
   Highlights the receptive field on a mini input grid.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('filter-stack-viz');
  if (!container) return;

  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* Receptive field size after n stacked 3×3 convs */
  function rfSize(n) { return 1 + n * 2; }
  /* Equivalent single filter size */
  function eqFilter(n) { return rfSize(n); }
  /* Param counts (C channels) — ratio, not absolute */
  function stackParams(n) { return n * 9; }   /* n × 3×3 = n × 9C² */
  function singleParams(n) { var f = eqFilter(n); return f * f; } /* f×f×C² */

  var CELL = 22;
  var GRID = 9; /* 9×9 input grid for visualisation */
  var W = 540, H = 260;

  var svg = el('svg', {
    width: W, height: H,
    style: 'display:block;margin:0 auto;font-family:sans-serif;overflow:visible'
  });
  container.appendChild(svg);

  /* ── Input grid (left) ── */
  var gridOffX = 16, gridOffY = 36;
  var gridCells = [];
  for (var r = 0; r < GRID; r++) {
    gridCells[r] = [];
    for (var c = 0; c < GRID; c++) {
      var rect = el('rect', {
        x: gridOffX + c * CELL, y: gridOffY + r * CELL,
        width: CELL - 1, height: CELL - 1,
        fill: '#f0f4ff', stroke: '#dde', 'stroke-width': 0.5, rx: 1
      });
      svg.appendChild(rect);
      gridCells[r][c] = rect;
    }
  }
  var gridLabel = el('text', { x: gridOffX + (GRID * CELL) / 2, y: 26,
    'text-anchor': 'middle', 'font-size': 11, fill: '#666' });
  gridLabel.textContent = 'Input (9×9)';
  svg.appendChild(gridLabel);

  /* Highlighted receptive field overlay */
  var rfRect = el('rect', {
    x: gridOffX, y: gridOffY,
    width: CELL * 3 - 1, height: CELL * 3 - 1,
    fill: 'rgba(74,144,217,0.18)', stroke: '#4a90d9', 'stroke-width': 2,
    rx: 2
  });
  svg.appendChild(rfRect);

  /* ── Info panel (right) ── */
  var infoX = gridOffX + GRID * CELL + 32;

  var rfText = el('text', { x: infoX, y: 60, 'font-size': 13, fill: '#333' });
  svg.appendChild(rfText);

  var eqText = el('text', { x: infoX, y: 88, 'font-size': 13, fill: '#333' });
  svg.appendChild(eqText);

  var paramStack = el('text', { x: infoX, y: 124, 'font-size': 12, fill: '#4a90d9' });
  svg.appendChild(paramStack);

  var paramSingle = el('text', { x: infoX, y: 146, 'font-size': 12, fill: '#c0392b' });
  svg.appendChild(paramSingle);

  var savingText = el('text', { x: infoX, y: 174, 'font-size': 11, fill: '#27ae60', 'font-weight': 'bold' });
  svg.appendChild(savingText);

  /* Filter stack diagram */
  var stackY = 190;
  var filterBoxes = [];
  for (var i = 0; i < 3; i++) {
    var fb = el('rect', {
      x: infoX + i * 36, y: stackY,
      width: 30, height: 30,
      fill: '#e8f0fb', stroke: '#4a90d9', 'stroke-width': 1.5,
      rx: 3, opacity: 0.3
    });
    var ft = el('text', {
      x: infoX + i * 36 + 15, y: stackY + 19,
      'text-anchor': 'middle', 'font-size': 9, fill: '#4a90d9', opacity: 0.3
    });
    ft.textContent = '3×3';
    svg.appendChild(fb);
    svg.appendChild(ft);
    filterBoxes.push({ box: fb, txt: ft });
  }

  /* ── Slider ── */
  var sliderWrap = document.createElement('div');
  sliderWrap.style.cssText = 'display:flex;align-items:center;gap:12px;max-width:520px;margin:.5rem auto 0;font-family:sans-serif;font-size:.85rem;color:#555;';
  sliderWrap.innerHTML = '<span>Stacked 3×3 filters:</span>' +
    '<input type="range" id="fstack-slider" min="1" max="3" value="1" style="flex:1">' +
    '<span id="fstack-val" style="min-width:1.2em;font-weight:bold">1</span>';
  container.appendChild(sliderWrap);

  function update(n) {
    /* receptive field highlight */
    var rf = rfSize(n);
    var offset = Math.floor((GRID - rf) / 2);
    rfRect.setAttribute('x', gridOffX + offset * CELL);
    rfRect.setAttribute('y', gridOffY + offset * CELL);
    rfRect.setAttribute('width', rf * CELL - 1);
    rfRect.setAttribute('height', rf * CELL - 1);

    /* colour cells inside rf */
    for (var r = 0; r < GRID; r++) {
      for (var c = 0; c < GRID; c++) {
        var inside = (r >= offset && r < offset + rf && c >= offset && c < offset + rf);
        gridCells[r][c].setAttribute('fill', inside ? 'rgba(74,144,217,0.12)' : '#f0f4ff');
      }
    }

    rfText.textContent = 'Receptive field: ' + rf + '×' + rf;
    eqText.textContent = 'Equivalent single filter: ' + eqFilter(n) + '×' + eqFilter(n);

    var sp = stackParams(n);
    var ep = singleParams(n);
    paramStack.textContent = n + '× (3×3) → ' + sp + 'C² params';
    paramSingle.textContent = '1× (' + eqFilter(n) + '×' + eqFilter(n) + ') → ' + ep + 'C² params';
    var saving = Math.round((1 - sp / ep) * 100);
    savingText.textContent = saving > 0 ? '↓ ' + saving + '% fewer parameters' : 'Same parameters';

    /* filter boxes */
    filterBoxes.forEach(function(fb, i) {
      var active = i < n;
      fb.box.setAttribute('opacity', active ? 1 : 0.25);
      fb.txt.setAttribute('opacity', active ? 1 : 0.25);
    });

    document.getElementById('fstack-val').textContent = n;
  }

  document.getElementById('fstack-slider').addEventListener('input', function() {
    update(parseInt(this.value));
  });

  /* Animate slider on entry */
  var animated = false;
  function autoAnimate() {
    if (animated) return;
    animated = true;
    var n = 1;
    var slider = document.getElementById('fstack-slider');
    function step() {
      update(n);
      slider.value = n;
      if (n < 3) { n++; setTimeout(step, 700); }
    }
    step();
  }

  if (window.IntersectionObserver) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) autoAnimate();
    }, { threshold: 0.3 });
    obs.observe(container);
  } else {
    autoAnimate();
  }

  update(1);

})();
