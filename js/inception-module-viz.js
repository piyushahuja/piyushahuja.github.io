/* ─────────────────────────────────────────────────────────
   inception-module-viz.js
   Animates the Inception module: one input feature map,
   four parallel branches (1×1, 3×3, 5×5, MaxPool),
   concatenated into output. Branches animate in sequence.
   Hover a branch to see its parameter count vs plain conv.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('inception-module-viz');
  if (!container) return;

  var W = 560, H = 280;
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

  /* ── Layout constants ── */
  var INPUT_X = 30, INPUT_Y = 120, INPUT_W = 60, INPUT_H = 40;
  var BRANCH_X = 160;
  var BRANCH_W = 90, BRANCH_H = 34;
  var OUT_X = 430, OUT_Y = 110, OUT_W = 70, OUT_H = 60;

  var BRANCHES = [
    { label: '1×1 Conv',    sub: '64 filters',   y: 44,  col: '#e8f0fb', stroke: '#4a90d9', detail: '1×1: 1C² params\nno spatial context\nbut mixes channels' },
    { label: '3×3 Conv',    sub: '128 filters',  y: 100, col: '#d4e8ff', stroke: '#4a90d9', detail: '3×3: 9C² params\nmedium spatial context' },
    { label: '5×5 Conv',    sub: '32 filters',   y: 156, col: '#c4dfff', stroke: '#4a90d9', detail: '5×5: 25C² params\nbroad spatial context' },
    { label: 'MaxPool\n3×3',sub: '+ 1×1 proj',  y: 212, col: '#fdecea', stroke: '#c0392b', detail: 'Max pooling retains\ndominant activations;\n1×1 reduces channels' }
  ];

  /* Input box */
  var inputBox = el('rect', { x: INPUT_X, y: INPUT_Y, width: INPUT_W, height: INPUT_H,
    fill: '#eafaf1', stroke: '#27ae60', 'stroke-width': 2, rx: 4, opacity: 0 });
  svg.appendChild(inputBox);
  var inputLbl = el('text', { x: INPUT_X + INPUT_W / 2, y: INPUT_Y + INPUT_H / 2 + 4,
    'text-anchor': 'middle', 'font-size': 10, fill: '#27ae60', 'font-weight': 'bold', opacity: 0 });
  inputLbl.textContent = 'Input';
  svg.appendChild(inputLbl);

  /* Output box */
  var outputBox = el('rect', { x: OUT_X, y: OUT_Y, width: OUT_W, height: OUT_H,
    fill: '#eafaf1', stroke: '#27ae60', 'stroke-width': 2, rx: 4, opacity: 0 });
  svg.appendChild(outputBox);
  var outputLbl = el('text', { x: OUT_X + OUT_W / 2, y: OUT_Y + OUT_H / 2,
    'text-anchor': 'middle', 'font-size': 9, fill: '#27ae60', 'font-weight': 'bold', opacity: 0 });
  outputLbl.textContent = 'Concat';
  var outputLbl2 = el('text', { x: OUT_X + OUT_W / 2, y: OUT_Y + OUT_H / 2 + 13,
    'text-anchor': 'middle', 'font-size': 8, fill: '#27ae60', opacity: 0 });
  outputLbl2.textContent = 'output';
  svg.appendChild(outputLbl);
  svg.appendChild(outputLbl2);

  /* Tooltip */
  var tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute;background:#333;color:#fff;padding:5px 9px;border-radius:4px;font-size:11px;pointer-events:none;opacity:0;transition:opacity .15s;font-family:sans-serif;white-space:pre-line;line-height:1.5;';
  document.body.appendChild(tooltip);

  /* Branch elements */
  var branchEls = [];
  BRANCHES.forEach(function(b, i) {
    var bx = BRANCH_X, by = b.y;

    /* Input → branch line */
    var lineIn = el('line', {
      x1: INPUT_X + INPUT_W, y1: INPUT_Y + INPUT_H / 2,
      x2: bx, y2: by + BRANCH_H / 2,
      stroke: '#ccc', 'stroke-width': 1.5, opacity: 0
    });
    svg.appendChild(lineIn);

    /* Branch → output line */
    var lineOut = el('line', {
      x1: bx + BRANCH_W, y1: by + BRANCH_H / 2,
      x2: OUT_X, y2: OUT_Y + OUT_H / 2,
      stroke: '#ccc', 'stroke-width': 1.5, opacity: 0
    });
    svg.appendChild(lineOut);

    /* Branch box */
    var box = el('rect', { x: bx, y: by, width: BRANCH_W, height: BRANCH_H,
      fill: b.col, stroke: b.stroke, 'stroke-width': 1.5, rx: 4,
      opacity: 0, cursor: 'pointer' });
    svg.appendChild(box);

    /* Branch label */
    var lbl = el('text', { x: bx + BRANCH_W / 2, y: by + BRANCH_H / 2 - 3,
      'text-anchor': 'middle', 'font-size': 9, 'font-weight': 'bold', fill: '#333', opacity: 0 });
    lbl.textContent = b.label;
    svg.appendChild(lbl);
    var sub = el('text', { x: bx + BRANCH_W / 2, y: by + BRANCH_H / 2 + 9,
      'text-anchor': 'middle', 'font-size': 8, fill: '#666', opacity: 0 });
    sub.textContent = b.sub;
    svg.appendChild(sub);

    /* Hover */
    function show(e) {
      tooltip.textContent = b.detail;
      tooltip.style.opacity = 1;
      tooltip.style.left = (e.pageX + 12) + 'px';
      tooltip.style.top  = (e.pageY - 36) + 'px';
    }
    function hide() { tooltip.style.opacity = 0; }
    box.addEventListener('mouseenter', show);
    box.addEventListener('mousemove', show);
    box.addEventListener('mouseleave', hide);

    branchEls.push({ lineIn: lineIn, lineOut: lineOut, box: box, lbl: lbl, sub: sub });
  });

  /* ── Animate: input → branches one by one → output ── */
  var step = 0;

  function fadeIn(elems, cb) {
    var progress = 0;
    var steps = 12;
    function tick() {
      progress++;
      var op = progress / steps;
      elems.forEach(function(e) { e.setAttribute('opacity', op); });
      if (progress < steps) requestAnimationFrame(tick);
      else if (cb) setTimeout(cb, 60);
    }
    requestAnimationFrame(tick);
  }

  function animate() {
    /* 1: input box */
    fadeIn([inputBox, inputLbl], function() {
      /* 2: branches, one by one */
      var i = 0;
      function nextBranch() {
        if (i >= branchEls.length) {
          /* 3: output */
          fadeIn([outputBox, outputLbl, outputLbl2], null);
          return;
        }
        var b = branchEls[i];
        fadeIn([b.lineIn, b.box, b.lbl, b.sub], function() {
          fadeIn([b.lineOut], function() { i++; setTimeout(nextBranch, 80); });
        });
      }
      nextBranch();
    });
  }

  if (window.IntersectionObserver) {
    var animated = false;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !animated) { animated = true; animate(); }
    }, { threshold: 0.3 });
    obs.observe(container);
  } else {
    animate();
  }

})();
