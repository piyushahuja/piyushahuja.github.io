/* ─────────────────────────────────────────────────────────
   gd-viz.js  —  Interactive gradient descent on a loss surface
   Mirrors the distill.pub/2017/momentum/ visualization style:
   - SVG contour plot of a 2D loss function
   - Trajectory updates in real-time as sliders change
   - No external libraries (pure SVG + vanilla JS)
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Configuration ──────────────────────────────────────── */
  var W = 520, H = 340;
  var PAD = { top: 20, right: 20, bottom: 20, left: 20 };
  var IW = W - PAD.left - PAD.right;
  var IH = H - PAD.top  - PAD.bottom;

  /* Domain: w1 in [-2.5, 2.5], w2 in [-2, 2] */
  var X0 = -2.5, X1 = 2.5, Y0 = -2.0, Y1 = 2.0;

  /* Loss: elongated bowl — similar to a poorly-conditioned quadratic */
  /* f(w1,w2) = 0.5*(5*w1^2 + 0.5*w2^2)  — eigenvalues 5 and 0.5 */
  function loss(w1, w2) {
    return 0.5 * (5 * w1 * w1 + 0.5 * w2 * w2);
  }
  function gradW1(w1) { return 5  * w1; }
  function gradW2(w2) { return 0.5 * w2; }

  /* Starting point */
  var START = [2.2, 1.8];
  var N_STEPS = 60;

  /* ── Coordinate helpers ─────────────────────────────────── */
  function toSvgX(w1) { return PAD.left  + (w1 - X0) / (X1 - X0) * IW; }
  function toSvgY(w2) { return PAD.top   + (1 - (w2 - Y0) / (Y1 - Y0)) * IH; }

  /* ── Build SVG ──────────────────────────────────────────── */
  var container = document.getElementById('gd-viz');
  if (!container) return;

  var ns = 'http://www.w3.org/2000/svg';

  var svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('width',  '100%');
  svg.style.display = 'block';
  svg.style.maxWidth = W + 'px';
  svg.style.margin = '0 auto';
  container.appendChild(svg);

  /* ── Draw contours ──────────────────────────────────────── */
  /* Precompute contour levels */
  var levels = [0.1, 0.3, 0.7, 1.4, 2.5, 4.0, 6.0, 9.0];
  /* Color scale: light yellow → blue (ColorBrewer YlGnBu) */
  var contourColors = [
    '#ffffd9','#edf8b1','#c7e9b4','#7fcdbb',
    '#41b6c4','#1d91c0','#225ea8','#0c2c84'
  ];

  /* Marching-squares-lite: just draw ellipses since f is a quadratic bowl */
  /* f(w1,w2) = c  =>  5*w1^2/2 + 0.5*w2^2/2 = c  (ellipse) */
  var contoursG = document.createElementNS(ns, 'g');
  contoursG.setAttribute('class', 'contours');
  svg.appendChild(contoursG);

  levels.forEach(function (c, i) {
    /* Semi-axes: a = sqrt(2c/5), b = sqrt(2c/0.5) = sqrt(4c) */
    var a = Math.sqrt(2 * c / 5);   /* w1 semi-axis */
    var b = Math.sqrt(2 * c / 0.5); /* w2 semi-axis */

    /* Only draw if ellipse fits (roughly) in domain */
    if (a > (X1 - X0) || b > (Y1 - Y0)) return;

    /* Convert semi-axes to SVG pixels */
    var rx = a / (X1 - X0) * IW;
    var ry = b / (Y1 - Y0) * IH;
    var cx = toSvgX(0);
    var cy = toSvgY(0);

    var el = document.createElementNS(ns, 'ellipse');
    el.setAttribute('cx', cx);
    el.setAttribute('cy', cy);
    el.setAttribute('rx', rx);
    el.setAttribute('ry', ry);
    el.setAttribute('fill',   contourColors[i] || '#eee');
    el.setAttribute('stroke', 'rgba(0,0,0,0.12)');
    el.setAttribute('stroke-width', '0.8');
    contoursG.appendChild(el);
  });

  /* ── Minimum marker ─────────────────────────────────────── */
  var minDot = document.createElementNS(ns, 'circle');
  minDot.setAttribute('cx', toSvgX(0));
  minDot.setAttribute('cy', toSvgY(0));
  minDot.setAttribute('r', 5);
  minDot.setAttribute('fill', '#004276');
  minDot.setAttribute('stroke', '#fff');
  minDot.setAttribute('stroke-width', 2);
  svg.appendChild(minDot);

  /* ── Trajectory group ───────────────────────────────────── */
  var trajG = document.createElementNS(ns, 'g');
  svg.appendChild(trajG);

  /* ── Start dot ──────────────────────────────────────────── */
  var startDot = document.createElementNS(ns, 'circle');
  startDot.setAttribute('cx', toSvgX(START[0]));
  startDot.setAttribute('cy', toSvgY(START[1]));
  startDot.setAttribute('r', 6);
  startDot.setAttribute('fill', '#e64c3c');
  startDot.setAttribute('stroke', '#fff');
  startDot.setAttribute('stroke-width', 2);
  svg.appendChild(startDot);

  /* ── Compute trajectory ─────────────────────────────────── */
  function computeTrajectory(lr, beta) {
    var pts = [START.slice()];
    var w1 = START[0], w2 = START[1];
    var v1 = 0, v2 = 0; /* velocity for momentum */

    for (var i = 0; i < N_STEPS; i++) {
      var g1 = gradW1(w1);
      var g2 = gradW2(w2);
      v1 = beta * v1 - lr * g1;
      v2 = beta * v2 - lr * g2;
      w1 = w1 + v1;
      w2 = w2 + v2;
      pts.push([w1, w2]);

      /* Clamp to domain */
      if (w1 < X0 - 1 || w1 > X1 + 1 || w2 < Y0 - 1 || w2 > Y1 + 1) break;
    }
    return pts;
  }

  /* ── Render trajectory ──────────────────────────────────── */
  function renderTrajectory(pts) {
    /* Clear previous */
    while (trajG.firstChild) trajG.removeChild(trajG.firstChild);

    if (pts.length < 2) return;

    /* Path */
    var d = '';
    for (var i = 0; i < pts.length; i++) {
      var px = toSvgX(pts[i][0]);
      var py = toSvgY(pts[i][1]);
      /* Clamp to SVG bounds for visual cleanliness */
      px = Math.max(-10, Math.min(W + 10, px));
      py = Math.max(-10, Math.min(H + 10, py));
      d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1);
    }

    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(0,0,0,0.75)');
    path.setAttribute('stroke-width', '1.8');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    trajG.appendChild(path);

    /* Dots at each step (up to 30) */
    var step = Math.max(1, Math.floor(pts.length / 30));
    for (var j = 1; j < pts.length; j += step) {
      var dot = document.createElementNS(ns, 'circle');
      var t = j / (pts.length - 1); /* 0..1 */
      dot.setAttribute('cx', toSvgX(pts[j][0]));
      dot.setAttribute('cy', toSvgY(pts[j][1]));
      dot.setAttribute('r', 3);
      dot.setAttribute('fill', 'rgba(0,0,0,' + (0.3 + 0.5 * t).toFixed(2) + ')');
      trajG.appendChild(dot);
    }
  }

  /* ── Slider wiring ──────────────────────────────────────── */
  var lrSlider  = document.getElementById('gd-lr');
  var momSlider = document.getElementById('gd-mom');
  var lrVal     = document.getElementById('gd-lr-val');
  var momVal    = document.getElementById('gd-mom-val');
  if (!lrSlider || !momSlider) return;

  function getLR()  { return +lrSlider.value  / 100; }
  function getMom() { return +momSlider.value  / 100; }

  function update() {
    var lr  = getLR();
    var mom = getMom();
    lrVal.textContent  = lr.toFixed(2);
    momVal.textContent = mom.toFixed(2);
    var pts = computeTrajectory(lr, mom);
    renderTrajectory(pts);
  }

  lrSlider.addEventListener('input',  update);
  momSlider.addEventListener('input', update);

  /* Initial render */
  update();

})();
