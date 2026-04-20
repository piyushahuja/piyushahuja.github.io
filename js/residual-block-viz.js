/* ─────────────────────────────────────────────────────────
   residual-block-viz.js
   Animated residual block.
   Toggle between "plain" (no skip) and "residual" (with skip).
   During backprop animation, shows gradient flowing:
     - plain: through both conv layers (fades quickly)
     - residual: through skip connection (stays bright) + conv layers
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('residual-block-viz');
  if (!container) return;

  var W = 520, H = 200;
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

  /* ── Layout ── */
  var midY  = 80;
  var skipY = 148;

  /* Nodes: Input, Conv1, ReLU, Conv2, Add, Output */
  var nodes = [
    { id: 'in',    x: 36,  y: midY, w: 44, h: 32, label: 'x',       sub: 'input',   col: '#eafaf1', stroke: '#27ae60' },
    { id: 'c1',    x: 130, y: midY, w: 70, h: 32, label: 'Conv',     sub: '3×3, BN, ReLU', col: '#e8f0fb', stroke: '#4a90d9' },
    { id: 'c2',    x: 250, y: midY, w: 70, h: 32, label: 'Conv',     sub: '3×3, BN', col: '#e8f0fb', stroke: '#4a90d9' },
    { id: 'add',   x: 368, y: midY, w: 38, h: 32, label: '+',        sub: '',        col: '#fff8e1', stroke: '#e07b2a' },
    { id: 'out',   x: 454, y: midY, w: 44, h: 32, label: 'F(x)+x',   sub: 'output',  col: '#eafaf1', stroke: '#27ae60' }
  ];

  /* Draw node boxes */
  nodes.forEach(function(n) {
    var rect = el('rect', { x: n.x, y: n.y, width: n.w, height: n.h,
      fill: n.col, stroke: n.stroke, 'stroke-width': 1.5, rx: 4 });
    svg.appendChild(rect);
    var lbl = el('text', { x: n.x + n.w / 2, y: n.y + n.h / 2 - (n.sub ? 3 : 0),
      'text-anchor': 'middle', 'font-size': 10, 'font-weight': 'bold', fill: '#333' });
    lbl.textContent = n.label;
    svg.appendChild(lbl);
    if (n.sub) {
      var sub = el('text', { x: n.x + n.w / 2, y: n.y + n.h / 2 + 10,
        'text-anchor': 'middle', 'font-size': 7.5, fill: '#777' });
      sub.textContent = n.sub;
      svg.appendChild(sub);
    }
  });

  /* ── Forward arrows (main path) ── */
  var fwdArrows = [];
  var gaps = [
    [nodes[0].x + nodes[0].w, nodes[0].y + nodes[0].h/2, nodes[1].x, nodes[1].y + nodes[1].h/2],
    [nodes[1].x + nodes[1].w, nodes[1].y + nodes[1].h/2, nodes[2].x, nodes[2].y + nodes[2].h/2],
    [nodes[2].x + nodes[2].w, nodes[2].y + nodes[2].h/2, nodes[3].x, nodes[3].y + nodes[3].h/2],
    [nodes[3].x + nodes[3].w, nodes[3].y + nodes[3].h/2, nodes[4].x, nodes[4].y + nodes[4].h/2]
  ];
  gaps.forEach(function(g) {
    var line = el('line', { x1: g[0], y1: g[1], x2: g[2], y2: g[3],
      stroke: '#aaa', 'stroke-width': 1.5 });
    svg.appendChild(line);
    fwdArrows.push(line);
  });

  /* ── Skip connection (arc below) ── */
  var skipPath = el('path', {
    d: 'M ' + (nodes[0].x + nodes[0].w/2) + ',' + (nodes[0].y + nodes[0].h) +
       ' Q ' + (nodes[2].x + nodes[2].w/2) + ',' + (skipY + 20) +
       ' ' + (nodes[3].x + nodes[3].w/2) + ',' + (nodes[3].y + nodes[3].h),
    fill: 'none', stroke: '#e07b2a', 'stroke-width': 2, 'stroke-dasharray': '5,3'
  });
  svg.appendChild(skipPath);

  var skipLabel = el('text', { x: (nodes[0].x + nodes[3].x) / 2 + 20, y: skipY + 26,
    'text-anchor': 'middle', 'font-size': 9, fill: '#e07b2a' });
  skipLabel.textContent = 'skip: identity x';
  svg.appendChild(skipLabel);

  /* ── Gradient pulse elements ── */
  /* Gradient flows RIGHT→LEFT during backprop */
  /* We show pulsing dots travelling backward along each path */

  var gradDots = []; /* { dot, path: [{x,y},...], progress, speed } */

  function makeDot(col, r) {
    var d = el('circle', { r: r || 5, fill: col, opacity: 0.9 });
    svg.appendChild(d);
    return d;
  }

  /* Positions along main path (reverse order for backprop) */
  var mainPath = [
    { x: nodes[4].x + nodes[4].w/2, y: nodes[4].y + nodes[4].h/2 },
    { x: nodes[3].x + nodes[3].w/2, y: nodes[3].y + nodes[3].h/2 },
    { x: nodes[2].x + nodes[2].w/2, y: nodes[2].y + nodes[2].h/2 },
    { x: nodes[1].x + nodes[1].w/2, y: nodes[1].y + nodes[1].h/2 },
    { x: nodes[0].x + nodes[0].w/2, y: nodes[0].y + nodes[0].h/2 }
  ];

  /* Skip path control points (reverse) */
  var skipPathPts = [
    { x: nodes[3].x + nodes[3].w/2, y: nodes[3].y + nodes[3].h },
    { x: (nodes[0].x + nodes[3].x)/2 + 20, y: skipY + 18 },
    { x: nodes[0].x + nodes[0].w/2, y: nodes[0].y + nodes[0].h }
  ];

  function lerpPt(pts, t) {
    /* linear interpolation along a list of points */
    var total = pts.length - 1;
    var seg = Math.min(Math.floor(t * total), total - 1);
    var local = t * total - seg;
    var a = pts[seg], b = pts[seg + 1];
    return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
  }

  var mode = 'plain'; /* 'plain' | 'residual' */
  var animating = false;
  var rafId = null;
  var startTime = null;
  var DURATION = 1800; /* ms for one backprop pass */

  /* Gradient intensity: plain fades, residual stays bright through skip */
  function gradColor(progress, isSkip) {
    if (isSkip) {
      /* skip: bright orange all the way */
      return 'rgba(224,123,42,' + (0.5 + 0.5 * Math.sin(progress * Math.PI)) + ')';
    }
    if (mode === 'plain') {
      /* plain: fades from right (early layers) toward left (late layers = early in backprop) */
      /* actually fades as progress increases — simulating vanishing */
      var brightness = Math.max(0.08, 1 - progress * 1.4);
      return 'rgba(74,144,217,' + brightness.toFixed(2) + ')';
    } else {
      /* residual: stays reasonably bright */
      var brightness2 = Math.max(0.4, 1 - progress * 0.5);
      return 'rgba(74,144,217,' + brightness2.toFixed(2) + ')';
    }
  }

  var dot1 = makeDot('#4a90d9', 6);
  var dot2 = makeDot('#4a90d9', 6);
  var dotSkip = makeDot('#e07b2a', 5);

  function resetDots() {
    [dot1, dot2, dotSkip].forEach(function(d) {
      d.setAttribute('opacity', 0);
    });
  }

  function runBackprop(ts) {
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;
    var progress = Math.min(elapsed / DURATION, 1);

    /* dot1: travels full main path */
    var p1 = lerpPt(mainPath, progress);
    dot1.setAttribute('cx', p1.x);
    dot1.setAttribute('cy', p1.y);
    dot1.setAttribute('fill', gradColor(progress, false));
    dot1.setAttribute('opacity', progress < 1 ? 0.95 : 0);

    /* dot2: lags behind dot1 */
    var p2 = lerpPt(mainPath, Math.max(0, progress - 0.15));
    dot2.setAttribute('cx', p2.x);
    dot2.setAttribute('cy', p2.y);
    dot2.setAttribute('fill', gradColor(Math.max(0, progress - 0.15), false));
    dot2.setAttribute('opacity', progress > 0.15 && progress < 1 ? 0.6 : 0);

    /* skip dot: only in residual mode */
    if (mode === 'residual') {
      dotSkip.setAttribute('opacity', 0.9);
      /* skip dot starts at add node, travels skip arc to input */
      var skipProgress = Math.min(progress * 1.4, 1);
      var ps = lerpPt(skipPathPts, skipProgress);
      dotSkip.setAttribute('cx', ps.x);
      dotSkip.setAttribute('cy', ps.y);
    } else {
      dotSkip.setAttribute('opacity', 0);
    }

    if (progress < 1) {
      rafId = requestAnimationFrame(runBackprop);
    } else {
      resetDots();
      animating = false;
      startTime = null;
    }
  }

  /* ── Buttons ── */
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'text-align:center;margin-top:.5rem;display:flex;gap:8px;justify-content:center;';
  btnRow.innerHTML =
    '<button class="nn-btn" id="res-plain">Plain block</button>' +
    '<button class="nn-btn" id="res-residual" style="background:#fff8e1;border-color:#e07b2a;color:#e07b2a">Residual block</button>' +
    '<button class="nn-btn" id="res-backprop">▶ Backprop</button>';
  container.appendChild(btnRow);

  function setMode(m) {
    mode = m;
    skipPath.setAttribute('opacity', m === 'residual' ? 1 : 0.15);
    skipLabel.setAttribute('opacity', m === 'residual' ? 1 : 0.15);
    document.getElementById('res-plain').style.fontWeight    = m === 'plain'    ? 'bold' : '';
    document.getElementById('res-residual').style.fontWeight = m === 'residual' ? 'bold' : '';
  }

  document.getElementById('res-plain').addEventListener('click', function() { setMode('plain'); });
  document.getElementById('res-residual').addEventListener('click', function() { setMode('residual'); });
  document.getElementById('res-backprop').addEventListener('click', function() {
    if (animating) return;
    animating = true;
    startTime = null;
    requestAnimationFrame(runBackprop);
  });

  setMode('plain');
  resetDots();

  /* Auto-demo on entry */
  if (window.IntersectionObserver) {
    var demoed = false;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !demoed) {
        demoed = true;
        setTimeout(function() {
          setMode('residual');
          animating = true; startTime = null;
          requestAnimationFrame(runBackprop);
        }, 600);
      }
    }, { threshold: 0.4 });
    obs.observe(container);
  }

})();
