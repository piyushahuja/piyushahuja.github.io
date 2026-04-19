/* ─────────────────────────────────────────────────────────
   uat-viz.js — Universal Approximation demo
   Target: sin(πx). Each neuron adds a scaled sigmoid bump.
   Slider controls number of neurons (1–12).
   Shows individual neuron contributions (faint) + sum (solid).
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('uat-viz');
  if (!container) return;

  var W = 520, H = 240;
  var PAD = { top: 28, right: 24, bottom: 44, left: 48 };
  var IW = W - PAD.left - PAD.right;
  var IH = H - PAD.top - PAD.bottom;
  var N_POINTS = 200;
  var MAX_N = 12;

  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* target function */
  function target(x) { return Math.sin(Math.PI * x); } // x in [0,1]

  /* sigmoid */
  function sig(z) { return 1 / (1 + Math.exp(-z)); }

  /* fit N neurons to approximate target using evenly-spaced bumps */
  function neuronBumps(n) {
    /* Each neuron is a steep sigmoid step, scaled + shifted.
       Two neurons per "bump": one rising, one falling edge.
       For simplicity: use n bump neurons equally spaced,
       each with weight ≈ step height from a finite-difference of target. */
    var centres = [];
    for (var i = 0; i < n; i++) {
      centres.push((i + 0.5) / n);
    }
    /* Approximate target by sum of box functions (neural-network style):
       neuron_i(x) ≈ target(c_i) * [heaviside(x - c_i) - heaviside(x - c_{i+1})]
       Realised with steep sigmoids. */
    var steep = 40;
    return centres.map(function(c, i) {
      var left  = c - 0.5/n;
      var right = c + 0.5/n;
      var h = target(c); // height of target at centre
      return function(x) {
        return h * (sig(steep * (x - left)) - sig(steep * (x - right)));
      };
    });
  }

  var svg = el('svg', { width: W, height: H, style: 'display:block;margin:0 auto;font-family:sans-serif' });
  container.appendChild(svg);

  /* axes */
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left + IW, y1: PAD.top + IH, y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left, y1: PAD.top, y2: PAD.top + IH, stroke: '#ccc', 'stroke-width': 1 }));

  /* x=0 midline reference */
  var midY = PAD.top + IH / 2;
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left + IW, y1: midY, y2: midY, stroke: '#eee', 'stroke-width': 1 }));

  /* axis labels */
  var xLbl = el('text', { x: PAD.left + IW/2, y: H - 4, 'text-anchor': 'middle', 'font-size': 11, fill: '#888' });
  xLbl.textContent = 'x';
  svg.appendChild(xLbl);

  /* legend */
  var ly = PAD.top - 4;
  svg.appendChild(el('line', { x1: PAD.left, x2: PAD.left + 18, y1: ly + 5, y2: ly + 5, stroke: '#bbb', 'stroke-width': 1.5, 'stroke-dasharray': '4,2' }));
  var tgt = el('text', { x: PAD.left + 22, y: ly + 9, 'font-size': 10, fill: '#888' });
  tgt.textContent = 'target sin(πx)';
  svg.appendChild(tgt);
  svg.appendChild(el('line', { x1: PAD.left + 130, x2: PAD.left + 148, y1: ly + 5, y2: ly + 5, stroke: '#4a90d9', 'stroke-width': 2.5 }));
  var app = el('text', { x: PAD.left + 152, y: ly + 9, 'font-size': 10, fill: '#555' });
  app.textContent = 'network output';
  svg.appendChild(app);

  /* coordinate helpers */
  function sx(x) { return PAD.left + x * IW; }
  function sy(v) { return midY - v * (IH / 2.2); }

  /* draw target */
  var pts = [];
  for (var i = 0; i <= N_POINTS; i++) {
    var xv = i / N_POINTS;
    pts.push(sx(xv).toFixed(1) + ',' + sy(target(xv)).toFixed(1));
  }
  svg.appendChild(el('polyline', { points: pts.join(' '), fill: 'none', stroke: '#bbb', 'stroke-width': 1.5, 'stroke-dasharray': '5,3' }));

  /* neuron paths (faint, added per neuron) */
  var neuronPathGroup = el('g', {});
  svg.appendChild(neuronPathGroup);

  /* network output path */
  var outputPath = el('path', { fill: 'none', stroke: '#4a90d9', 'stroke-width': 2.5 });
  svg.appendChild(outputPath);

  /* neuron count label */
  var countLabel = el('text', { x: PAD.left + IW - 4, y: PAD.top + 14, 'text-anchor': 'end', 'font-size': 11, fill: '#4a90d9' });
  svg.appendChild(countLabel);

  function render(n) {
    /* clear neuron paths */
    while (neuronPathGroup.firstChild) neuronPathGroup.removeChild(neuronPathGroup.firstChild);

    var bumps = neuronBumps(n);

    /* individual neuron contributions */
    bumps.forEach(function(fn) {
      var pts2 = [];
      for (var i = 0; i <= N_POINTS; i++) {
        var xv = i / N_POINTS;
        pts2.push(sx(xv).toFixed(1) + ',' + sy(fn(xv)).toFixed(1));
      }
      neuronPathGroup.appendChild(el('polyline', {
        points: pts2.join(' '), fill: 'none', stroke: '#e07b2a', 'stroke-width': 1, opacity: 0.35
      }));
    });

    /* sum */
    var d = '';
    for (var i = 0; i <= N_POINTS; i++) {
      var xv = i / N_POINTS;
      var sum = bumps.reduce(function(acc, fn) { return acc + fn(xv); }, 0);
      var cmd = i === 0 ? 'M' : 'L';
      d += cmd + sx(xv).toFixed(1) + ',' + sy(sum).toFixed(1) + ' ';
    }
    outputPath.setAttribute('d', d);

    countLabel.textContent = n + ' neuron' + (n === 1 ? '' : 's');
  }

  /* slider */
  var sliderRow = document.createElement('div');
  sliderRow.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:.75rem;margin-top:.5rem;font-family:sans-serif;font-size:.82rem;';
  sliderRow.innerHTML =
    '<span style="color:#555;">Neurons</span>' +
    '<input type="range" id="uat-n" min="1" max="' + MAX_N + '" value="3" step="1" style="width:160px;">' +
    '<span id="uat-n-val" style="color:#4a90d9;font-weight:bold;min-width:2rem;">3</span>';
  container.appendChild(sliderRow);

  var slider = document.getElementById('uat-n');
  var valLabel = document.getElementById('uat-n-val');

  slider.addEventListener('input', function() {
    valLabel.textContent = this.value;
    render(parseInt(this.value, 10));
  });

  render(3);
})();
