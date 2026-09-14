/* ─────────────────────────────────────────────────────────
   lstm-cell-viz.js
   Diagram of an LSTM cell with labelled gates.
   Hover each gate to highlight it and show a description.
   The cell state (top path) is drawn as a highway.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('lstm-cell-viz');
  if (!container) return;

  var W = 560, H = 220;
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

  /* ── Arrowhead ── */
  var defs = el('defs', {});
  function mkMark(id, col) {
    var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 4, refY: 3, orient: 'auto' });
    m.appendChild(el('path', { d: 'M0,1 L6,3 L0,5 Z', fill: col }));
    defs.appendChild(m);
  }
  mkMark('arr-g', '#27ae60');
  mkMark('arr-b', '#4a90d9');
  mkMark('arr-o', '#e07b2a');
  mkMark('arr-r', '#c0392b');
  svg.appendChild(defs);

  /* ── Layout ── */
  var cellX = 80, cellY = 50, cellW = 400, cellH = 130;

  /* Cell state highway (top) */
  var csY = cellY + 20;
  svg.appendChild(el('line', { x1: 20, y1: csY, x2: cellX + cellW + 40, y2: csY,
    stroke: '#4a90d9', 'stroke-width': 3, 'marker-end': 'url(#arr-b)' }));
  var csLabel = el('text', { x: 12, y: csY - 8, 'font-size': 9, fill: '#4a90d9', 'font-weight': 'bold' });
  csLabel.textContent = 'C (cell state)';
  svg.appendChild(csLabel);

  /* Hidden state highway (bottom) */
  var hsY = cellY + cellH - 20;
  svg.appendChild(el('line', { x1: 20, y1: hsY, x2: cellX + cellW + 40, y2: hsY,
    stroke: '#e07b2a', 'stroke-width': 2, 'marker-end': 'url(#arr-o)' }));
  var hsLabel = el('text', { x: 12, y: hsY + 16, 'font-size': 9, fill: '#e07b2a', 'font-weight': 'bold' });
  hsLabel.textContent = 'h (hidden state)';
  svg.appendChild(hsLabel);

  /* ── Gates ── */
  var GATE_R = 16;

  var GATES = [
    { id: 'forget', label: 'f', symbol: '×', x: cellX + 80,  y: csY,   col: '#c0392b', mark: 'arr-r',
      desc: 'Forget gate: erases parts of the cell state. f≈0 → forget. f≈1 → keep.' },
    { id: 'input',  label: 'i', symbol: '+', x: cellX + 200, y: csY,   col: '#27ae60', mark: 'arr-g',
      desc: 'Input gate: controls how much new content to write into the cell state.' },
    { id: 'output', label: 'o', symbol: '×', x: cellX + 320, y: hsY,  col: '#e07b2a', mark: 'arr-o',
      desc: 'Output gate: filters the cell state to produce the hidden state h.' }
  ];

  /* Tooltip */
  var tip = document.createElement('div');
  tip.style.cssText = 'position:absolute;background:#333;color:#fff;padding:5px 10px;border-radius:4px;font-size:11px;pointer-events:none;opacity:0;transition:opacity .15s;font-family:sans-serif;max-width:220px;line-height:1.4;';
  document.body.appendChild(tip);

  var gateEls = {};

  GATES.forEach(function(g) {
    /* Gate circle */
    var circle = el('circle', { cx: g.x, cy: g.y, r: GATE_R,
      fill: '#fff', stroke: g.col, 'stroke-width': 2.5, cursor: 'pointer' });
    var sym = el('text', { x: g.x, y: g.y + 5, 'text-anchor': 'middle',
      'font-size': 14, 'font-weight': 'bold', fill: g.col, 'pointer-events': 'none' });
    sym.textContent = g.symbol;
    var lbl = el('text', { x: g.x, y: g.y + GATE_R + 13, 'text-anchor': 'middle',
      'font-size': 9, fill: g.col, 'pointer-events': 'none' });
    lbl.textContent = g.label + ' gate';
    svg.appendChild(circle);
    svg.appendChild(sym);
    svg.appendChild(lbl);

    gateEls[g.id] = circle;

    function showTip(e) {
      tip.textContent = g.desc;
      tip.style.opacity = 1;
      tip.style.left = (e.pageX + 12) + 'px';
      tip.style.top  = (e.pageY - 40) + 'px';
      circle.setAttribute('fill', g.col);
      sym.setAttribute('fill', '#fff');
    }
    function hideTip() {
      tip.style.opacity = 0;
      circle.setAttribute('fill', '#fff');
      sym.setAttribute('fill', g.col);
    }
    circle.addEventListener('mouseenter', showTip);
    circle.addEventListener('mousemove', showTip);
    circle.addEventListener('mouseleave', hideTip);
  });

  /* ── tanh node (new candidate content) ── */
  var tanhX = cellX + 200, tanhY = hsY;
  var tanhCirc = el('circle', { cx: tanhX, cy: tanhY, r: GATE_R,
    fill: '#f5f5f5', stroke: '#888', 'stroke-width': 2 });
  var tanhLbl = el('text', { x: tanhX, y: tanhY + 5, 'text-anchor': 'middle',
    'font-size': 9, fill: '#555' });
  tanhLbl.textContent = 'tanh';
  svg.appendChild(tanhCirc);
  svg.appendChild(tanhLbl);

  /* ── Connecting lines: input gate to cell state (tanh → +) ── */
  svg.appendChild(el('line', { x1: tanhX, y1: tanhY - GATE_R, x2: tanhX, y2: csY + GATE_R,
    stroke: '#27ae60', 'stroke-width': 1.5, 'marker-end': 'url(#arr-g)' }));

  /* output gate down to h ── */
  svg.appendChild(el('line', { x1: GATES[2].x, y1: csY + GATE_R, x2: GATES[2].x, y2: hsY - GATE_R,
    stroke: '#e07b2a', 'stroke-width': 1.5, 'marker-end': 'url(#arr-o)' }));

  /* tanh after cell state before output gate */
  var tanhOut = el('circle', { cx: GATES[2].x, cy: (csY + hsY) / 2, r: 13,
    fill: '#f5f5f5', stroke: '#888', 'stroke-width': 1.5 });
  var tanhOutL = el('text', { x: GATES[2].x, y: (csY + hsY) / 2 + 4,
    'text-anchor': 'middle', 'font-size': 8, fill: '#555' });
  tanhOutL.textContent = 'tanh';
  svg.appendChild(tanhOut);
  svg.appendChild(tanhOutL);

  /* ── h_{t-1} and x_t labels ── */
  var inY = H - 16;
  [cellX + 80, cellX + 160, cellX + 200, cellX + 320].forEach(function(gx, i) {
    if (i < 3) {
      svg.appendChild(el('line', { x1: gx, y1: inY, x2: gx, y2: hsY + GATE_R,
        stroke: '#bbb', 'stroke-width': 1.5, 'stroke-dasharray': '4,3' }));
    }
  });
  var inLbl = el('text', { x: cellX + 80, y: inY + 12, 'text-anchor': 'middle',
    'font-size': 8, fill: '#888' });
  inLbl.textContent = 'h_{t-1}, x_t inputs';
  svg.appendChild(inLbl);

  /* ── Description text ── */
  var descEl = el('text', { x: W / 2, y: H - 4, 'text-anchor': 'middle',
    'font-size': 9, fill: '#555' });
  descEl.textContent = 'Hover a gate to see what it controls.';
  svg.appendChild(descEl);

})();
