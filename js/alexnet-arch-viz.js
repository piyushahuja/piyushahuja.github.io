/* ─────────────────────────────────────────────────────────
   alexnet-arch-viz.js
   Animated AlexNet architecture diagram.
   Shows each layer block animating in left-to-right,
   with GPU split (blue/orange), layer names, and dims.
   Hover a block to see parameter count.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('alexnet-arch-viz');
  if (!container) return;

  var W = 580, H = 220;
  var ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ── Layer definitions ─────────────────────────────────
     Each layer: label, sublabel, width, height, color, params string, gpu (1|2|both)
  */
  var layers = [
    { label: 'Input',   sub: '224×224×3',   w: 44, h: 110, col: '#e8f0fb', stroke: '#4a90d9', params: '—',             gpu: 0 },
    { label: 'Conv1',   sub: '55×55×96',    w: 52, h: 100, col: '#dde8ff', stroke: '#4a90d9', params: '35K params',    gpu: 1 },
    { label: 'Conv2',   sub: '27×27×256',   w: 52, h:  88, col: '#d0e4ff', stroke: '#4a90d9', params: '614K params',   gpu: 1 },
    { label: 'Conv3',   sub: '13×13×384',   w: 52, h:  76, col: '#c4dfff', stroke: '#4a90d9', params: '885K params',   gpu: 2 },
    { label: 'Conv4',   sub: '13×13×384',   w: 52, h:  76, col: '#c4dfff', stroke: '#4a90d9', params: '1.3M params',   gpu: 2 },
    { label: 'Conv5',   sub: '13×13×256',   w: 52, h:  68, col: '#bbd9ff', stroke: '#4a90d9', params: '885K params',   gpu: 2 },
    { label: 'FC6',     sub: '4096',         w: 44, h:  56, col: '#e8f5e9', stroke: '#27ae60', params: '37.7M params',  gpu: 2 },
    { label: 'FC7',     sub: '4096',         w: 44, h:  56, col: '#d7f0db', stroke: '#27ae60', params: '16.8M params',  gpu: 2 },
    { label: 'FC8',     sub: '1000',         w: 44, h:  44, col: '#c8eacd', stroke: '#27ae60', params: '4.1M params',   gpu: 2 },
    { label: 'Softmax', sub: 'classes',      w: 40, h:  36, col: '#eafaf1', stroke: '#27ae60', params: '—',             gpu: 0 }
  ];

  var GAP = 8;
  var totalW = layers.reduce(function(s, l) { return s + l.w + GAP; }, 0) + 20;
  var scale = Math.min(1, W / totalW);

  var svg = el('svg', {
    width: W, height: H,
    style: 'display:block;margin:0 auto;font-family:sans-serif;overflow:visible'
  });
  container.appendChild(svg);

  /* GPU split band */
  var gpu1End = 0, gpu2Start = 9999;
  var cx = 10;
  layers.forEach(function(l, i) {
    if (l.gpu === 1 && cx > gpu1End) gpu1End = cx + l.w * scale;
    if (l.gpu === 2 && cx < gpu2Start) gpu2Start = cx;
    cx += (l.w + GAP) * scale;
  });

  /* GPU labels */
  var gpuY = H - 18;
  var midGpu1 = (10 + gpu1End) / 2;
  var midGpu2 = (gpu2Start + cx - GAP * scale) / 2;

  var gLabel1 = el('text', { x: midGpu1, y: gpuY, 'text-anchor': 'middle', 'font-size': 9, fill: '#4a90d9', opacity: 0 });
  gLabel1.textContent = 'GPU 1';
  svg.appendChild(gLabel1);
  var gLabel2 = el('text', { x: midGpu2, y: gpuY, 'text-anchor': 'middle', 'font-size': 9, fill: '#e07b2a', opacity: 0 });
  gLabel2.textContent = 'GPU 2';
  svg.appendChild(gLabel2);

  /* Tooltip */
  var tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute;background:#333;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;pointer-events:none;opacity:0;transition:opacity .15s;font-family:sans-serif;';
  document.body.appendChild(tooltip);

  /* Build layer rects — initially invisible */
  var rects = [], labelEls = [], subEls = [];
  cx = 10;

  layers.forEach(function(layer, i) {
    var lw = layer.w * scale;
    var lh = layer.h * scale;
    var ly = (H - 32 - lh) / 2;
    var strokeCol = layer.gpu === 2 ? '#e07b2a' : layer.stroke;

    var rect = el('rect', {
      x: cx, y: ly, width: lw, height: lh,
      fill: layer.col, stroke: strokeCol, 'stroke-width': 1.5,
      rx: 3, opacity: 0, cursor: 'pointer'
    });
    svg.appendChild(rect);
    rects.push(rect);

    var lbl = el('text', {
      x: cx + lw / 2, y: ly + lh / 2 - 5,
      'text-anchor': 'middle', 'font-size': 9, fill: '#333',
      'font-weight': 'bold', opacity: 0
    });
    lbl.textContent = layer.label;
    svg.appendChild(lbl);
    labelEls.push(lbl);

    var sub = el('text', {
      x: cx + lw / 2, y: ly + lh / 2 + 7,
      'text-anchor': 'middle', 'font-size': 7.5, fill: '#666', opacity: 0
    });
    sub.textContent = layer.sub;
    svg.appendChild(sub);
    subEls.push(sub);

    /* Arrow to next */
    if (i < layers.length - 1) {
      var arr = el('line', {
        x1: cx + lw, y1: H / 2 - 16,
        x2: cx + lw + GAP * scale, y2: H / 2 - 16,
        stroke: '#ccc', 'stroke-width': 1, 'marker-end': 'url(#arr)', opacity: 0
      });
      svg.appendChild(arr);
      rects.push(arr); // animate with same timing
      labelEls.push(el('g', {}));
      subEls.push(el('g', {}));
    }

    /* Hover */
    (function(layer, rect, lbl, sub) {
      function show(e) {
        tooltip.textContent = layer.label + ' — ' + layer.params;
        tooltip.style.opacity = 1;
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top  = (e.pageY - 28) + 'px';
      }
      function hide() { tooltip.style.opacity = 0; }
      rect.addEventListener('mouseenter', show);
      rect.addEventListener('mousemove', show);
      rect.addEventListener('mouseleave', hide);
    })(layer, rect, lbl, sub);

    cx += (layer.w + GAP) * scale;
  });

  /* Arrowhead marker */
  var defs = el('defs', {});
  var marker = el('marker', { id: 'arr', markerWidth: 6, markerHeight: 6, refX: 3, refY: 3, orient: 'auto' });
  var markerPath = el('path', { d: 'M0,1 L5,3 L0,5 Z', fill: '#ccc' });
  marker.appendChild(markerPath);
  defs.appendChild(marker);
  svg.insertBefore(defs, svg.firstChild);

  /* ── Animation: reveal layers one by one ── */
  var revealed = 0;

  function revealNext() {
    if (revealed >= rects.length) {
      gLabel1.setAttribute('opacity', 1);
      gLabel2.setAttribute('opacity', 1);
      return;
    }
    var r = rects[revealed];
    r.setAttribute('opacity', 1);
    if (labelEls[revealed]) labelEls[revealed].setAttribute('opacity', 1);
    if (subEls[revealed]) subEls[revealed].setAttribute('opacity', 1);
    revealed++;
    setTimeout(revealNext, 120);
  }

  if (window.IntersectionObserver) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && revealed === 0) revealNext();
    }, { threshold: 0.3 });
    obs.observe(container);
  } else {
    revealNext();
  }

})();
