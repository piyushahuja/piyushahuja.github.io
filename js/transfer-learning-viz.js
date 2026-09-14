/* ─────────────────────────────────────────────────────────
   transfer-learning-viz.js
   Shows a CNN as a stack of layers, coloured by freeze depth.
   Three regime buttons (tiny/moderate/large dataset).
   Frozen layers = blue/locked, fine-tuned = orange, replaced = green.
   Animates the freeze level sliding up the stack.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('transfer-learning-viz');
  if (!container) return;

  var W = 520, H = 240;
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

  /* ── Layer stack (bottom = input, top = classifier) ── */
  var LAYERS = [
    { label: 'Conv 1–2',  sub: 'edges, colours',   type: 'low'  },
    { label: 'Conv 3–4',  sub: 'textures, shapes',  type: 'mid'  },
    { label: 'Conv 5',    sub: 'object parts',       type: 'high' },
    { label: 'FC 6–7',    sub: 'combinations',       type: 'fc'   },
    { label: 'Classifier',sub: 'your classes',       type: 'cls'  }
  ];

  var N = LAYERS.length;
  var LAYER_H = 32, LAYER_GAP = 4;
  var stackH = N * (LAYER_H + LAYER_GAP) - LAYER_GAP;
  var stackX = 60, stackY = (H - stackH) / 2;
  var stackW = 160;

  /* colours */
  var COL_FROZEN   = { fill: '#e8f0fb', stroke: '#4a90d9', text: '#4a90d9' };
  var COL_FINETUNE = { fill: '#fff3e0', stroke: '#e07b2a', text: '#e07b2a' };
  var COL_REPLACE  = { fill: '#eafaf1', stroke: '#27ae60', text: '#27ae60' };

  /* Three regimes: how many layers frozen (from bottom), fine-tuned, replaced */
  /* tiny: all frozen + replace cls; moderate: low+mid frozen, high+fc tuned, cls replaced; large: none frozen */
  var REGIMES = [
    { label: 'Tiny dataset',     freeze: 4, finetune: 0, desc: 'Freeze all. Replace classifier only. Cache features — forward pass runs once.' },
    { label: 'Moderate dataset', freeze: 2, finetune: 2, desc: 'Freeze lower layers (universal features). Fine-tune upper layers. Lower learning rate.' },
    { label: 'Large dataset',    freeze: 0, finetune: 4, desc: 'Fine-tune everything. Pretrained weights still give a better starting point than random.' }
  ];

  /* Build layer rects */
  var layerRects = [], layerLabels = [], layerSubs = [], lockIcons = [];

  LAYERS.forEach(function(layer, i) {
    var ly = stackY + (N - 1 - i) * (LAYER_H + LAYER_GAP);

    var rect = el('rect', { x: stackX, y: ly, width: stackW, height: LAYER_H,
      fill: COL_FROZEN.fill, stroke: COL_FROZEN.stroke, 'stroke-width': 1.5, rx: 4 });
    svg.appendChild(rect);
    layerRects.push(rect);

    var lbl = el('text', { x: stackX + stackW / 2, y: ly + LAYER_H / 2 - 4,
      'text-anchor': 'middle', 'font-size': 10, 'font-weight': 'bold', fill: COL_FROZEN.text });
    lbl.textContent = layer.label;
    svg.appendChild(lbl);
    layerLabels.push(lbl);

    var sub = el('text', { x: stackX + stackW / 2, y: ly + LAYER_H / 2 + 9,
      'text-anchor': 'middle', 'font-size': 8, fill: '#888' });
    sub.textContent = layer.sub;
    svg.appendChild(sub);
    layerSubs.push(sub);

    /* Lock icon (🔒 via text) */
    var lock = el('text', { x: stackX + 10, y: ly + LAYER_H / 2 + 4,
      'font-size': 11, fill: '#4a90d9' });
    lock.textContent = '🔒';
    svg.appendChild(lock);
    lockIcons.push(lock);
  });

  /* ── Description text ── */
  var descY = H - 20;
  var descEl = el('text', { x: W / 2, y: descY, 'text-anchor': 'middle',
    'font-size': 10, fill: '#555' });
  svg.appendChild(descEl);

  /* ── Legend ── */
  var legX = stackX + stackW + 24, legY = stackY;
  var legendItems = [
    { col: COL_FROZEN,   label: 'Frozen (locked)' },
    { col: COL_FINETUNE, label: 'Fine-tuned' },
    { col: COL_REPLACE,  label: 'Replaced' }
  ];
  legendItems.forEach(function(item, i) {
    var ly2 = legY + i * 22;
    svg.appendChild(el('rect', { x: legX, y: ly2, width: 14, height: 14,
      fill: item.col.fill, stroke: item.col.stroke, 'stroke-width': 1.5, rx: 2 }));
    var t = el('text', { x: legX + 20, y: ly2 + 11, 'font-size': 10, fill: '#555' });
    t.textContent = item.label;
    svg.appendChild(t);
  });

  /* ── Update function ── */
  function applyRegime(regimeIdx, animated) {
    var r = REGIMES[regimeIdx];
    /* layers bottom→top: index 0 = bottom (low conv) */
    /* freeze applies bottom up, finetune above that, cls always replaced */
    LAYERS.forEach(function(layer, i) {
      var col;
      if (i === N - 1) {
        col = COL_REPLACE; /* classifier always replaced */
      } else if (i < r.freeze) {
        col = COL_FROZEN;
      } else {
        col = COL_FINETUNE;
      }

      var rect = layerRects[i];
      var lbl  = layerLabels[i];
      var lock = lockIcons[i];

      if (animated) {
        setTimeout(function() {
          rect.setAttribute('fill', col.fill);
          rect.setAttribute('stroke', col.stroke);
          lbl.setAttribute('fill', col.text);
          lock.setAttribute('opacity', col === COL_FROZEN ? 1 : 0);
        }, (N - 1 - i) * 80);
      } else {
        rect.setAttribute('fill', col.fill);
        rect.setAttribute('stroke', col.stroke);
        lbl.setAttribute('fill', col.text);
        lock.setAttribute('opacity', col === COL_FROZEN ? 1 : 0);
      }
    });

    /* description — wrap manually since SVG foreignObject is unreliable */
    descEl.textContent = r.desc;
  }

  /* ── Buttons ── */
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'text-align:center;margin-top:.5rem;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;';
  REGIMES.forEach(function(r, i) {
    var btn = document.createElement('button');
    btn.className = 'nn-btn';
    btn.textContent = r.label;
    btn.addEventListener('click', function() {
      applyRegime(i, true);
      document.querySelectorAll('#' + container.id + ' .nn-btn, .nn-btn').forEach(function(b) {
        b.style.fontWeight = '';
      });
      btn.style.fontWeight = 'bold';
    });
    btnRow.appendChild(btn);
  });
  container.appendChild(btnRow);

  /* Initial state */
  applyRegime(0, false);
  descEl.textContent = REGIMES[0].desc;

  /* Auto-cycle on entry */
  if (window.IntersectionObserver) {
    var cycled = false;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !cycled) {
        cycled = true;
        var i = 0;
        function cycle() {
          applyRegime(i, true);
          i++;
          if (i < REGIMES.length) setTimeout(cycle, 900);
        }
        setTimeout(cycle, 400);
      }
    }, { threshold: 0.3 });
    obs.observe(container);
  }

})();
