/* ─────────────────────────────────────────────────────────
   backprop-graph-viz.js
   Two-layer network computational graph: forward then backward pass.
   Nodes show value (forward) and gradient (backward) with ▶/◀ buttons.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('backprop-graph-viz');
  if (!container) return;

  var W = 560, H = 300;
  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ── Network: x → h = relu(w1*x + b1) → y = w2*h + b2, L = (y - t)^2 ── */
  var x = 0.8, w1 = 0.5, b1 = 0.1, w2 = 0.9, b2 = -0.2, t = 1.0;
  var z1 = w1 * x + b1;             // pre-activation
  var h  = Math.max(0, z1);         // relu
  var y  = w2 * h + b2;             // output
  var L  = (y - t) * (y - t);       // loss

  /* ── Gradients (manual chain rule) ── */
  var dL_dy  = 2 * (y - t);
  var dL_dw2 = dL_dy * h;
  var dL_db2 = dL_dy;
  var dL_dh  = dL_dy * w2;
  var dL_dz1 = dL_dh * (z1 > 0 ? 1 : 0); // relu derivative
  var dL_dw1 = dL_dz1 * x;
  var dL_db1 = dL_dz1;
  var dL_dx  = dL_dz1 * w1;

  /* ── Node layout ── */
  var nodes = [
    { id: 'x',  cx: 60,  cy: 150, label: 'x', fwd: x.toFixed(2),  grad: dL_dx.toFixed(3) },
    { id: 'w1', cx: 60,  cy: 80,  label: 'w₁', fwd: w1.toFixed(2), grad: dL_dw1.toFixed(3) },
    { id: 'b1', cx: 60,  cy: 220, label: 'b₁', fwd: b1.toFixed(2), grad: dL_db1.toFixed(3) },
    { id: 'z1', cx: 190, cy: 150, label: '×+', fwd: z1.toFixed(2), grad: dL_dz1.toFixed(3) },
    { id: 'h',  cx: 310, cy: 150, label: 'ReLU', fwd: h.toFixed(2), grad: dL_dh.toFixed(3) },
    { id: 'w2', cx: 310, cy: 80,  label: 'w₂', fwd: w2.toFixed(2), grad: dL_dw2.toFixed(3) },
    { id: 'b2', cx: 310, cy: 220, label: 'b₂', fwd: b2.toFixed(2), grad: dL_db2.toFixed(3) },
    { id: 'y',  cx: 430, cy: 150, label: '×+', fwd: y.toFixed(2),  grad: dL_dy.toFixed(3)  },
    { id: 'L',  cx: 520, cy: 150, label: 'L',  fwd: L.toFixed(3),  grad: '1' }
  ];

  /* edges: [from_id, to_id] */
  var edges = [
    ['x','z1'],['w1','z1'],['b1','z1'],
    ['z1','h'],
    ['h','y'],['w2','y'],['b2','y'],
    ['y','L']
  ];

  var PHASES = [
    { label: '① Forward pass', active: ['x','w1','b1','z1','h','w2','b2','y','L'], bwd: false },
    { label: '② Gradient at L', active: ['L'], bwd: true },
    { label: '③ Gradient at y', active: ['L','y'], bwd: true },
    { label: '④ Gradient at w₂, b₂, h', active: ['L','y','w2','b2','h'], bwd: true },
    { label: '⑤ Gradient at z₁ (ReLU)', active: ['L','y','w2','b2','h','z1'], bwd: true },
    { label: '⑥ Gradient at w₁, b₁, x', active: ['L','y','w2','b2','h','z1','w1','b1','x'], bwd: true }
  ];

  var phase = 0;

  var svg = el('svg', { width: W, height: H, style: 'display:block;margin:0 auto;font-family:sans-serif' });
  container.appendChild(svg);

  /* edge lines */
  var edgeEls = {};
  edges.forEach(function(e) {
    var from = nodes.filter(function(n){ return n.id===e[0]; })[0];
    var to   = nodes.filter(function(n){ return n.id===e[1]; })[0];
    var line = el('line', {
      x1: from.cx + 22, y1: from.cy,
      x2: to.cx   - 22, y2: to.cy,
      stroke: '#ccc', 'stroke-width': 1.5
    });
    svg.appendChild(line);
    edgeEls[e[0]+'>'+e[1]] = line;
  });

  /* node circles + text */
  var nodeEls = {};
  nodes.forEach(function(n) {
    var g = el('g', { transform: 'translate(' + n.cx + ',' + n.cy + ')' });
    var circle = el('circle', { r: 22, fill: '#f4f7fb', stroke: '#aac', 'stroke-width': 1.5 });
    var lbl = el('text', { y: -4, 'text-anchor': 'middle', 'font-size': 10, fill: '#444', 'font-weight': 'bold' });
    lbl.textContent = n.label;
    var val = el('text', { y: 9, 'text-anchor': 'middle', 'font-size': 9, fill: '#4a90d9' });
    val.textContent = n.fwd;
    var grd = el('text', { y: 9, 'text-anchor': 'middle', 'font-size': 9, fill: '#c0392b' });
    grd.textContent = '∂=' + n.grad;
    grd.style.display = 'none';
    g.appendChild(circle);
    g.appendChild(lbl);
    g.appendChild(val);
    g.appendChild(grd);
    svg.appendChild(g);
    nodeEls[n.id] = { circle: circle, val: val, grd: grd };
  });

  /* phase label */
  var phaseLabel = el('text', { x: W/2, y: 24, 'text-anchor': 'middle', 'font-size': 12, fill: '#555', 'font-weight': 'bold' });
  phaseLabel.textContent = PHASES[0].label;
  svg.appendChild(phaseLabel);

  function render() {
    var p = PHASES[phase];
    phaseLabel.textContent = p.label;

    nodes.forEach(function(n) {
      var els = nodeEls[n.id];
      var active = p.active.indexOf(n.id) !== -1;
      els.circle.setAttribute('fill', active ? (p.bwd ? '#fdecea' : '#e8f4e8') : '#f4f7fb');
      els.circle.setAttribute('stroke', active ? (p.bwd ? '#c0392b' : '#27ae60') : '#aac');
      els.val.style.display = (!p.bwd && active) ? '' : 'none';
      els.grd.style.display = (p.bwd && active) ? '' : 'none';
    });
  }

  /* buttons */
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'text-align:center;margin-top:.5rem;display:flex;gap:.5rem;justify-content:center;';
  var prevBtn = document.createElement('button');
  prevBtn.className = 'nn-btn'; prevBtn.textContent = '◀ Back';
  var nextBtn = document.createElement('button');
  nextBtn.className = 'nn-btn'; nextBtn.textContent = 'Next ▶';

  prevBtn.addEventListener('click', function() { if (phase > 0) { phase--; render(); } });
  nextBtn.addEventListener('click', function() { if (phase < PHASES.length - 1) { phase++; render(); } });

  btnRow.appendChild(prevBtn);
  btnRow.appendChild(nextBtn);
  container.appendChild(btnRow);

  render();
})();
