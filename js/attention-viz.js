/* ─────────────────────────────────────────────────────────
   attention-viz.js
   Shows an attention alignment matrix for a short
   English → French translation example.
   Clicking a decoder row highlights the attended encoder
   positions and dims others.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('attention-viz');
  if (!container) return;

  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ── Data: attention weights (encoder cols × decoder rows) ── */
  /* rows = output (French), cols = input (English) */
  var SRC = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  var TGT = ['Le', 'chat', 'était', 'assis', 'sur', 'le', 'tapis'];

  /* Approximate plausible attention matrix (rows=TGT, cols=SRC) */
  var ATTN = [
    [0.80, 0.06, 0.04, 0.04, 0.04, 0.02], /* Le ← The */
    [0.04, 0.85, 0.04, 0.03, 0.02, 0.02], /* chat ← cat */
    [0.02, 0.04, 0.80, 0.06, 0.05, 0.03], /* était ← sat */
    [0.02, 0.04, 0.75, 0.10, 0.05, 0.04], /* assis ← sat */
    [0.03, 0.03, 0.04, 0.06, 0.12, 0.72], /* sur ← mat(ish) */
    [0.72, 0.05, 0.04, 0.04, 0.10, 0.05], /* le ← the */
    [0.03, 0.04, 0.05, 0.05, 0.07, 0.76]  /* tapis ← mat */
  ];

  var CELL = 40;
  var offX = 80, offY = 30;
  var W = offX + SRC.length * CELL + 60;
  var H = offY + TGT.length * CELL + 50;

  var svg = el('svg', {
    width: W, height: H,
    style: 'display:block;margin:0 auto;font-family:sans-serif;overflow:visible'
  });
  container.appendChild(svg);

  /* ── Source labels (top) ── */
  SRC.forEach(function(w, j) {
    var t = el('text', {
      x: offX + j * CELL + CELL / 2, y: offY - 8,
      'text-anchor': 'middle', 'font-size': 10, fill: '#4a90d9', 'font-weight': 'bold'
    });
    t.textContent = w;
    svg.appendChild(t);
  });

  /* ── Target labels (left) ── */
  TGT.forEach(function(w, i) {
    var t = el('text', {
      x: offX - 6, y: offY + i * CELL + CELL / 2 + 4,
      'text-anchor': 'end', 'font-size': 10, fill: '#27ae60', 'font-weight': 'bold'
    });
    t.textContent = w;
    svg.appendChild(t);
  });

  /* ── Axis labels ── */
  var srcAxisLbl = el('text', { x: offX + SRC.length * CELL / 2, y: offY - 20,
    'text-anchor': 'middle', 'font-size': 9, fill: '#888' });
  srcAxisLbl.textContent = '← Source (encoder) →';
  svg.appendChild(srcAxisLbl);

  /* ── Cells ── */
  var cellEls = [];
  ATTN.forEach(function(row, i) {
    var rowEls = [];
    row.forEach(function(w, j) {
      var shade = Math.round(255 * (1 - w));
      var fill = 'rgb(' + shade + ',' + shade + ',' + Math.round(255 * (1 - w * 0.3)) + ')';
      var rect = el('rect', {
        x: offX + j * CELL, y: offY + i * CELL,
        width: CELL - 1, height: CELL - 1,
        fill: fill, rx: 2, cursor: 'pointer'
      });
      svg.appendChild(rect);

      /* Weight value text */
      var wt = el('text', {
        x: offX + j * CELL + CELL / 2, y: offY + i * CELL + CELL / 2 + 4,
        'text-anchor': 'middle', 'font-size': 8,
        fill: w > 0.5 ? '#fff' : '#777'
      });
      wt.textContent = w.toFixed(2);
      svg.appendChild(wt);

      rowEls.push({ rect: rect, w: w, j: j });
    });
    cellEls.push(rowEls);
  });

  /* ── Row highlight on hover ── */
  var selectedRow = -1;

  function highlightRow(rowIdx) {
    selectedRow = rowIdx;
    cellEls.forEach(function(row, i) {
      row.forEach(function(c) {
        if (i === rowIdx) {
          /* Highlight: brighten high-attention cells */
          var alpha = 0.2 + c.w * 0.8;
          c.rect.setAttribute('stroke', '#e07b2a');
          c.rect.setAttribute('stroke-width', 2);
        } else {
          c.rect.setAttribute('opacity', 0.3);
          c.rect.setAttribute('stroke-width', 0);
        }
      });
    });
  }

  function clearHighlight() {
    selectedRow = -1;
    cellEls.forEach(function(row) {
      row.forEach(function(c) {
        c.rect.setAttribute('opacity', 1);
        c.rect.setAttribute('stroke-width', 0);
      });
    });
  }

  cellEls.forEach(function(row, i) {
    row.forEach(function(c) {
      c.rect.addEventListener('mouseenter', function() { highlightRow(i); });
      c.rect.addEventListener('mouseleave', clearHighlight);
    });
  });

  /* ── Legend ── */
  var legX = offX, legY = H - 14;
  var grad = el('defs', {});
  var linGrad = el('linearGradient', { id: 'att-grad', x1: 0, x2: 1, y1: 0, y2: 0 });
  linGrad.appendChild(el('stop', { offset: '0%',   'stop-color': 'rgb(255,255,255)' }));
  linGrad.appendChild(el('stop', { offset: '100%', 'stop-color': 'rgb(0,0,50)' }));
  grad.appendChild(linGrad);
  svg.appendChild(grad);

  svg.appendChild(el('rect', { x: legX, y: legY, width: 80, height: 8,
    fill: 'url(#att-grad)', rx: 2 }));
  var ll = el('text', { x: legX, y: legY - 3, 'font-size': 8, fill: '#888' });
  ll.textContent = 'low';
  svg.appendChild(ll);
  var lh = el('text', { x: legX + 80, y: legY - 3, 'text-anchor': 'end', 'font-size': 8, fill: '#888' });
  lh.textContent = 'high attention';
  svg.appendChild(lh);

  /* ── Instruction ── */
  var instrEl = el('text', { x: offX + SRC.length * CELL + 10, y: offY + 20,
    'font-size': 9, fill: '#888' });
  instrEl.textContent = 'Hover a row';
  svg.appendChild(instrEl);
  var instrEl2 = el('text', { x: offX + SRC.length * CELL + 10, y: offY + 33,
    'font-size': 9, fill: '#888' });
  instrEl2.textContent = 'to see what';
  svg.appendChild(instrEl2);
  var instrEl3 = el('text', { x: offX + SRC.length * CELL + 10, y: offY + 46,
    'font-size': 9, fill: '#888' });
  instrEl3.textContent = 'decoder attends';
  svg.appendChild(instrEl3);

})();
