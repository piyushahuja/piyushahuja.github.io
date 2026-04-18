/* snell-demo.js — interactive Snell's law / refraction canvas */
(function () {
  'use strict';

  var canvas = document.getElementById('snell-canvas');
  var ctx    = canvas.getContext('2d');
  var box    = document.getElementById('snell-box');

  var n1Sl  = document.getElementById('n1');
  var n2Sl  = document.getElementById('n2');
  var angSl = document.getElementById('angle-in');
  var n1V   = document.getElementById('n1-val');
  var n2V   = document.getElementById('n2-val');
  var angV  = document.getElementById('angle-val');

  var state    = { n1: 1.0, n2: 1.5, angle: 45 };
  var dragging = false;

  /* ── Helpers ──────────────────────────────────────────── */
  function toRad(d) { return d * Math.PI / 180; }
  function toDeg(r) { return r * 180 / Math.PI; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  /* ── Sync sliders → state ─────────────────────────────── */
  function syncSliders() {
    state.n1    = parseFloat(n1Sl.value);
    state.n2    = parseFloat(n2Sl.value);
    state.angle = parseInt(angSl.value, 10);
    n1V.textContent  = state.n1.toFixed(2);
    n2V.textContent  = state.n2.toFixed(2);
    angV.textContent = state.angle + '°';
  }

  [n1Sl, n2Sl, angSl].forEach(function (el) {
    el.addEventListener('input', function () { syncSliders(); draw(); });
  });

  document.getElementById('snell-reset').addEventListener('click', function () {
    n1Sl.value = 1.0; n2Sl.value = 1.5; angSl.value = 45;
    syncSliders(); draw();
  });

  /* ── Drag on canvas to aim incoming ray ───────────────── */
  function angleFromPointer(e) {
    var r  = canvas.getBoundingClientRect();
    var cx = canvas.width / 2;
    var iy = canvas.height / 2;
    var mx = (e.clientX - r.left) * (canvas.width  / r.width);
    var my = (e.clientY - r.top)  * (canvas.height / r.height);
    var dy = iy - my;
    if (dy < 5) return;
    var ang = clamp(toDeg(Math.atan2(Math.abs(mx - cx), dy)), 1, 89);
    state.angle      = ang;
    angSl.value      = Math.round(ang);
    angV.textContent = Math.round(ang) + '°';
    draw();
  }

  canvas.addEventListener('mousedown', function (e) {
    var r  = canvas.getBoundingClientRect();
    var my = (e.clientY - r.top) * (canvas.height / r.height);
    if (my < canvas.height / 2) { dragging = true; angleFromPointer(e); }
  });
  canvas.addEventListener('mousemove',  function (e) { if (dragging) angleFromPointer(e); });
  canvas.addEventListener('mouseup',    function ()  { dragging = false; });
  canvas.addEventListener('mouseleave', function ()  { dragging = false; });
  canvas.addEventListener('touchstart', function (e) { e.preventDefault(); angleFromPointer(e.touches[0]); }, { passive: false });
  canvas.addEventListener('touchmove',  function (e) { e.preventDefault(); angleFromPointer(e.touches[0]); }, { passive: false });

  /* ── Draw helpers ─────────────────────────────────────── */
  function drawArrow(x1, y1, x2, y2, color) {
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;
    var ax = x2 - ux * 14, ay = y2 - uy * 14;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(ax - uy * 5, ay + ux * 5);
    ctx.lineTo(ax + uy * 5, ay - ux * 5);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawAngleArc(cx, cy, startA, endA, r, color, label, align) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, endA);
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    var mid = (startA + endA) / 2;
    ctx.font      = '11px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(label, cx + Math.cos(mid) * (r + 14), cy + Math.sin(mid) * (r + 14));
    ctx.restore();
  }

  function drawWavefronts(cx, iy, theta1, theta2, n1, n2) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    var spacing = 28;
    var p1x = Math.cos(theta1), p1y = -Math.sin(theta1);

    for (var i = 1; i <= 4; i++) {
      var d  = i * spacing;
      var ox = cx - Math.sin(theta1) * d, oy = iy - Math.cos(theta1) * d;
      ctx.beginPath();
      ctx.moveTo(ox - p1x * 80, oy - p1y * 80);
      ctx.lineTo(ox + p1x * 80, oy + p1y * 80);
      ctx.strokeStyle = '#ffe040';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    if (theta2 !== null) {
      var p2x     = Math.cos(theta2), p2y = Math.sin(theta2);
      var spacingB = spacing * (n1 / n2);
      for (var j = 1; j <= 4; j++) {
        var db  = j * spacingB;
        var ox2 = cx + Math.sin(theta2) * db, oy2 = iy + Math.cos(theta2) * db;
        ctx.beginPath();
        ctx.moveTo(ox2 - p2x * 80, oy2 - p2y * 80);
        ctx.lineTo(ox2 + p2x * 80, oy2 + p2y * 80);
        ctx.strokeStyle = '#64c8ff';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ── Main draw ────────────────────────────────────────── */
  function draw() {
    var W  = canvas.width, H = canvas.height;
    var cx = W / 2, iy = H / 2;
    ctx.clearRect(0, 0, W, H);

    var n1 = state.n1, n2 = state.n2;
    var theta1 = toRad(state.angle);

    /* backgrounds */
    var topA = Math.min(0.55, (n1 - 1) / 1.5 * 0.55 + 0.05);
    var botA = Math.min(0.65, (n2 - 1) / 1.5 * 0.65 + 0.08);

    var tg = ctx.createLinearGradient(0, 0, 0, iy);
    tg.addColorStop(0, 'rgba(30,80,160,' + topA.toFixed(2) + ')');
    tg.addColorStop(1, 'rgba(10,30,80,0.15)');
    ctx.fillStyle = tg; ctx.fillRect(0, 0, W, iy);

    var bg = ctx.createLinearGradient(0, iy, 0, H);
    bg.addColorStop(0, 'rgba(10,30,80,0.15)');
    bg.addColorStop(1, 'rgba(30,80,160,' + botA.toFixed(2) + ')');
    ctx.fillStyle = bg; ctx.fillRect(0, iy, W, H - iy);

    /* index labels */
    ctx.font      = '13px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = 'rgba(130,180,255,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('n₁ = ' + n1.toFixed(2), 14, 22);
    ctx.fillText('n₂ = ' + n2.toFixed(2), 14, iy + 20);

    /* interface */
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.moveTo(0, iy); ctx.lineTo(W, iy);
    ctx.stroke();

    /* normal */
    ctx.beginPath();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth   = 1;
    ctx.moveTo(cx, iy - 130); ctx.lineTo(cx, iy + 130);
    ctx.stroke();
    ctx.setLineDash([]);

    /* Snell */
    var sinT2 = (n1 / n2) * Math.sin(theta1);
    var tir   = sinT2 > 1.0;
    var theta2 = tir ? null : Math.asin(sinT2);
    var rayLen = 160;

    /* incoming ray */
    var ix0 = cx - Math.sin(theta1) * rayLen;
    var iy0 = iy - Math.cos(theta1) * rayLen;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(ix0, iy0); ctx.lineTo(cx, iy);
    ctx.strokeStyle = 'rgba(255,230,80,0.12)'; ctx.lineWidth = 10; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ix0, iy0); ctx.lineTo(cx, iy);
    ctx.strokeStyle = '#ffe040'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    drawArrow(ix0, iy0, cx, iy, '#ffe040');

    /* reflected ray */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, iy);
    ctx.lineTo(cx + Math.sin(theta1) * rayLen, iy - Math.cos(theta1) * rayLen);
    ctx.strokeStyle = 'rgba(255,230,80,0.35)';
    ctx.lineWidth   = tir ? 2 : 1;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* refracted ray or TIR label */
    if (!tir) {
      var tx1 = cx + Math.sin(theta2) * rayLen * 1.1;
      var ty1 = iy + Math.cos(theta2) * rayLen * 1.1;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(cx, iy); ctx.lineTo(tx1, ty1);
      ctx.strokeStyle = 'rgba(100,200,255,0.15)'; ctx.lineWidth = 10; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, iy); ctx.lineTo(tx1, ty1);
      ctx.strokeStyle = '#64c8ff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      drawArrow(cx, iy, tx1, ty1, '#64c8ff');
      drawAngleArc(cx, iy, -Math.PI / 2, -Math.PI / 2 + theta1, 46, '#ffe040', '  θ₁=' + Math.round(toDeg(theta1)) + '°', 'right');
      drawAngleArc(cx, iy,  Math.PI / 2 - theta2,  Math.PI / 2, 60, '#64c8ff', 'θ₂=' + Math.round(toDeg(theta2)) + '°  ', 'left');
    } else {
      ctx.save();
      ctx.font      = 'bold 14px Helvetica Neue, Arial, sans-serif';
      ctx.fillStyle = '#ff8c42';
      ctx.textAlign = 'center';
      ctx.fillText('Total Internal Reflection', cx, iy + 50);
      if (n1 > n2) {
        var tc = toDeg(Math.asin(n2 / n1));
        ctx.font      = '11px Helvetica Neue, Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,140,66,0.7)';
        ctx.fillText('θ_c = ' + tc.toFixed(1) + '°', cx, iy + 70);
      }
      ctx.restore();
    }

    drawWavefronts(cx, iy, theta1, theta2, n1, n2);
  }

  /* ── Resize + init ────────────────────────────────────── */
  function resize() {
    canvas.width  = box.clientWidth;
    canvas.height = 400;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
