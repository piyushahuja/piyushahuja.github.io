/* ─────────────────────────────────────────────────────────
   seq2seq-viz.js
   Encoder-decoder animation.
   Encoder LSTM reads tokens one by one, building hidden states.
   On "Encode", a context vector c appears.
   On "Decode", decoder generates output tokens one by one.
   Pure SVG + vanilla JS.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('seq2seq-viz');
  if (!container) return;

  var W = 560, H = 200;
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

  /* Arrowheads */
  var defs = el('defs', {});
  function mkMark(id, col) {
    var m = el('marker', { id: id, markerWidth: 7, markerHeight: 7, refX: 4, refY: 3, orient: 'auto' });
    m.appendChild(el('path', { d: 'M0,1 L6,3 L0,5 Z', fill: col }));
    defs.appendChild(m);
  }
  mkMark('s2s-blue',   '#4a90d9');
  mkMark('s2s-orange', '#e07b2a');
  mkMark('s2s-green',  '#27ae60');
  mkMark('s2s-red',    '#c0392b');
  svg.appendChild(defs);

  /* ── Layout ── */
  var ENC_TOKENS = ['Le', 'chat', 'est', 'assis'];
  var DEC_TOKENS = ['The', 'cat', 'sat', '<end>'];
  var cellW = 54, cellH = 32;
  var encY = 74, decY = 74;
  var encStartX = 18, decStartX = 320;
  var stepX = 64;

  /* ── Encoder cells ── */
  var encCells = [], encLabels = [], encTokenLbls = [], encArrows = [];
  ENC_TOKENS.forEach(function(tok, i) {
    var cx = encStartX + i * stepX;

    /* Token label below */
    var tl = el('text', { x: cx + cellW / 2, y: encY + cellH + 18,
      'text-anchor': 'middle', 'font-size': 9, fill: '#27ae60' });
    tl.textContent = tok;
    svg.appendChild(tl);
    encTokenLbls.push(tl);

    /* Arrow token → cell */
    svg.appendChild(el('line', {
      x1: cx + cellW / 2, y1: encY + cellH + 10,
      x2: cx + cellW / 2, y2: encY + cellH,
      stroke: '#27ae60', 'stroke-width': 1.2, 'marker-end': 'url(#s2s-green)'
    }));

    /* Cell */
    var cell = el('rect', { x: cx, y: encY, width: cellW, height: cellH,
      fill: '#e8f0fb', stroke: '#4a90d9', 'stroke-width': 1.5, rx: 4, opacity: 0.25 });
    svg.appendChild(cell);
    var lbl = el('text', { x: cx + cellW / 2, y: encY + cellH / 2 + 4,
      'text-anchor': 'middle', 'font-size': 8, 'font-weight': 'bold', fill: '#4a90d9', opacity: 0.25 });
    lbl.textContent = 'ENC';
    svg.appendChild(lbl);
    encCells.push(cell);
    encLabels.push(lbl);

    /* Arrow to next cell */
    if (i < ENC_TOKENS.length - 1) {
      var arr = el('line', {
        x1: cx + cellW, y1: encY + cellH / 2,
        x2: cx + stepX, y2: encY + cellH / 2,
        stroke: '#4a90d9', 'stroke-width': 1.5, 'marker-end': 'url(#s2s-blue)', opacity: 0.25
      });
      svg.appendChild(arr);
      encArrows.push(arr);
    }
  });

  /* ── Context vector ── */
  var ctxX = encStartX + ENC_TOKENS.length * stepX - stepX / 2 + cellW / 2 - 20;
  var ctxY = encY - 50;
  var ctxBox = el('rect', { x: ctxX, y: ctxY, width: 44, height: 30,
    fill: '#fff3e0', stroke: '#e07b2a', 'stroke-width': 2, rx: 4, opacity: 0 });
  var ctxLbl = el('text', { x: ctxX + 22, y: ctxY + 19,
    'text-anchor': 'middle', 'font-size': 9, 'font-weight': 'bold', fill: '#e07b2a', opacity: 0 });
  ctxLbl.textContent = 'c';
  var ctxDesc = el('text', { x: ctxX + 22, y: ctxY - 6,
    'text-anchor': 'middle', 'font-size': 8, fill: '#888', opacity: 0 });
  ctxDesc.textContent = 'context vector';
  svg.appendChild(ctxBox);
  svg.appendChild(ctxLbl);
  svg.appendChild(ctxDesc);

  /* Arrow from last enc cell to context */
  var lastEncX = encStartX + (ENC_TOKENS.length - 1) * stepX;
  var ctxArr = el('line', {
    x1: lastEncX + cellW / 2, y1: encY,
    x2: ctxX + 22, y2: ctxY + 30,
    stroke: '#e07b2a', 'stroke-width': 1.5, 'stroke-dasharray': '4,3', 'marker-end': 'url(#s2s-orange)', opacity: 0
  });
  svg.appendChild(ctxArr);

  /* Arrow from context to decoder start */
  var ctxToDecArr = el('line', {
    x1: ctxX + 44, y1: ctxY + 15,
    x2: decStartX, y2: decY + cellH / 2,
    stroke: '#e07b2a', 'stroke-width': 1.5, 'stroke-dasharray': '4,3', 'marker-end': 'url(#s2s-orange)', opacity: 0
  });
  svg.appendChild(ctxToDecArr);

  /* ── Decoder cells ── */
  var decCells = [], decLabels = [], decOutputLbls = [], decArrows = [];
  DEC_TOKENS.forEach(function(tok, i) {
    var cx = decStartX + i * stepX;

    /* Cell */
    var cell = el('rect', { x: cx, y: decY, width: cellW, height: cellH,
      fill: '#eafaf1', stroke: '#27ae60', 'stroke-width': 1.5, rx: 4, opacity: 0 });
    svg.appendChild(cell);
    var lbl = el('text', { x: cx + cellW / 2, y: decY + cellH / 2 + 4,
      'text-anchor': 'middle', 'font-size': 8, 'font-weight': 'bold', fill: '#27ae60', opacity: 0 });
    lbl.textContent = 'DEC';
    svg.appendChild(lbl);
    decCells.push(cell);
    decLabels.push(lbl);

    /* Output label above */
    var ol = el('text', { x: cx + cellW / 2, y: decY - 10,
      'text-anchor': 'middle', 'font-size': 9, fill: '#27ae60', opacity: 0 });
    ol.textContent = tok;
    svg.appendChild(ol);
    decOutputLbls.push(ol);

    /* Arrow cell → output */
    var oa = el('line', {
      x1: cx + cellW / 2, y1: decY,
      x2: cx + cellW / 2, y2: decY - 6,
      stroke: '#27ae60', 'stroke-width': 1.2, 'marker-end': 'url(#s2s-green)', opacity: 0
    });
    svg.appendChild(oa);
    decCells.push(oa); /* animate together */

    /* Arrow to next cell */
    if (i < DEC_TOKENS.length - 1) {
      var arr = el('line', {
        x1: cx + cellW, y1: decY + cellH / 2,
        x2: cx + stepX, y2: decY + cellH / 2,
        stroke: '#27ae60', 'stroke-width': 1.5, 'marker-end': 'url(#s2s-green)', opacity: 0
      });
      svg.appendChild(arr);
      decArrows.push(arr);
    }
  });

  /* ── Bottleneck label ── */
  var bottleneckLbl = el('text', { x: ctxX + 22, y: H - 4,
    'text-anchor': 'middle', 'font-size': 8, fill: '#c0392b', 'font-style': 'italic', opacity: 0 });
  bottleneckLbl.textContent = '← information bottleneck →';
  svg.appendChild(bottleneckLbl);

  /* ── Section labels ── */
  var encTitle = el('text', { x: encStartX + (ENC_TOKENS.length * stepX) / 2, y: encY + cellH + 36,
    'text-anchor': 'middle', 'font-size': 10, fill: '#4a90d9', 'font-weight': 'bold' });
  encTitle.textContent = 'Encoder';
  svg.appendChild(encTitle);
  var decTitle = el('text', { x: decStartX + (DEC_TOKENS.length * stepX) / 2, y: decY + cellH + 18,
    'text-anchor': 'middle', 'font-size': 10, fill: '#27ae60', 'font-weight': 'bold' });
  decTitle.textContent = 'Decoder';
  svg.appendChild(decTitle);

  /* ── Animation state ── */
  var phase = 0; /* 0=idle, 1=encoding, 2=context, 3=decoding */
  var encStep = 0, decStep = 0;

  function setOpacity(els, op) { els.forEach(function(e) { e.setAttribute('opacity', op); }); }

  function encode() {
    if (encStep >= ENC_TOKENS.length) return;
    encCells[encStep].setAttribute('opacity', 1);
    encLabels[encStep].setAttribute('opacity', 1);
    if (encStep < encArrows.length) encArrows[encStep].setAttribute('opacity', 1);
    encStep++;
    if (encStep < ENC_TOKENS.length) setTimeout(encode, 500);
    else {
      /* Show context vector */
      setTimeout(function() {
        ctxBox.setAttribute('opacity', 1);
        ctxLbl.setAttribute('opacity', 1);
        ctxDesc.setAttribute('opacity', 1);
        ctxArr.setAttribute('opacity', 1);
        setTimeout(function() {
          ctxToDecArr.setAttribute('opacity', 1);
          bottleneckLbl.setAttribute('opacity', 1);
          setTimeout(decode, 400);
        }, 500);
      }, 300);
    }
  }

  function decode() {
    if (decStep >= DEC_TOKENS.length) return;
    decCells[decStep * 2].setAttribute('opacity', 1);
    decLabels[decStep].setAttribute('opacity', 1);
    decCells[decStep * 2 + 1].setAttribute('opacity', 1);
    decOutputLbls[decStep].setAttribute('opacity', 1);
    if (decStep < decArrows.length) decArrows[decStep].setAttribute('opacity', 1);
    decStep++;
    if (decStep < DEC_TOKENS.length) setTimeout(decode, 550);
  }

  /* ── Buttons ── */
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'text-align:center;margin-top:.5rem;display:flex;gap:8px;justify-content:center;';

  var btnEncode = document.createElement('button');
  btnEncode.className = 'nn-btn';
  btnEncode.textContent = '▶ Encode';
  btnEncode.addEventListener('click', function() {
    if (encStep === 0) encode();
  });

  var btnReset2 = document.createElement('button');
  btnReset2.className = 'nn-btn';
  btnReset2.textContent = 'Reset';
  btnReset2.addEventListener('click', function() {
    encStep = 0; decStep = 0;
    encCells.forEach(function(c) { c.setAttribute('opacity', 0.25); });
    encLabels.forEach(function(l) { l.setAttribute('opacity', 0.25); });
    encArrows.forEach(function(a) { a.setAttribute('opacity', 0.25); });
    [ctxBox, ctxLbl, ctxDesc, ctxArr, ctxToDecArr, bottleneckLbl].forEach(function(e) { e.setAttribute('opacity', 0); });
    decCells.forEach(function(c) { c.setAttribute('opacity', 0); });
    decLabels.forEach(function(l) { l.setAttribute('opacity', 0); });
    decOutputLbls.forEach(function(l) { l.setAttribute('opacity', 0); });
    decArrows.forEach(function(a) { a.setAttribute('opacity', 0); });
  });

  btnRow.appendChild(btnEncode);
  btnRow.appendChild(btnReset2);
  container.appendChild(btnRow);

  /* Auto-animate on entry */
  if (window.IntersectionObserver) {
    var played = false;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !played) {
        played = true;
        setTimeout(encode, 500);
      }
    }, { threshold: 0.3 });
    obs.observe(container);
  }

})();
