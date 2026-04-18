/* social-energy.js — interactive visualizations for social-energy.html */

/* ── Utility ──────────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function resizeCanvas(id) {
  var c = document.getElementById(id);
  if (!c) return;
  var w = c.parentElement.clientWidth - 48;
  if (w > 0) { c.width = w; }
}

function resizeAll() {
  resizeCanvas('hrv-canvas');
  resizeCanvas('sync-canvas');
  resizeCanvas('wearable-canvas');
}

window.addEventListener('load', resizeAll);
window.addEventListener('resize', resizeAll);


/* ── HRV Co-regulation Demo ──────────────────────────────── */
(function() {
  var canvas, ctx, slider, btn, valSpan;
  var animId = null;
  var t = 0;
  var simRunning = false;
  var currentRegA = 0.5;   // 0–1
  var bHRV = 0.3;           // person B's current HRV level (0–1)
  var DURATION = 120;       // seconds of simulated interaction
  var simT = 0;

  function init() {
    canvas  = document.getElementById('hrv-canvas');
    if (!canvas) return;
    ctx     = canvas.getContext('2d');
    slider  = document.getElementById('hrv-slider');
    btn     = document.getElementById('hrv-btn');
    valSpan = document.getElementById('hrv-val');
    slider.addEventListener('input', function() {
      currentRegA = slider.value / 100;
      valSpan.textContent = slider.value + '%';
      if (!simRunning) draw(0, currentRegA, bHRV);
    });
    btn.addEventListener('click', function() {
      if (simRunning) { simRunning = false; btn.textContent = 'Simulate interaction'; return; }
      simRunning = true;
      bHRV = 0.3;
      simT = 0;
      btn.textContent = '■ Stop';
      animate();
    });
    draw(0, currentRegA, bHRV);
  }

  function draw(progress, regA, regB) {
    if (!canvas) return;
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, W, H);

    var pad = 40;
    var plotW = W - pad * 2;
    var midH = H / 2;

    // axis labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('High', 4, pad + 6);
    ctx.fillText('Low', 4, H - pad + 6);
    ctx.fillText('Time (2 min interaction)', pad, H - 6);

    // axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad);
    ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad);
    ctx.stroke();

    // Person A flat line (stable high or low)
    var aY = H - pad - regA * (H - pad * 2);
    ctx.strokeStyle = '#4a90d9';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(pad, aY);
    ctx.lineTo(W - pad, aY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label A
    ctx.fillStyle = '#4a90d9';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Person A (HRV)', pad + 4, aY - 6);

    // Person B curve — starts at 0.3, pulls toward regA over time
    var steps = Math.floor(progress * plotW);
    if (steps < 1) steps = 1;
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (var i = 0; i <= steps; i++) {
      var pct = i / plotW;
      var target = regA;
      var pullSpeed = 0.4 + regA * 0.4;  // stronger pull when A is more regulated
      var bVal = lerp(0.3, target, 1 - Math.exp(-pullSpeed * pct * 4));
      // add gentle HRV oscillation
      bVal += 0.04 * Math.sin(i * 0.08) * (1 - pct * 0.5);
      bVal = clamp(bVal, 0.05, 0.95);
      var x = pad + i;
      var y = H - pad - bVal * (H - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#e67e22';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Person B (HRV, co-regulated)', pad + 4, H - pad - 0.3 * (H - pad * 2) + 14);
  }

  function animate() {
    if (!simRunning) return;
    simT += 0.8;
    var progress = clamp(simT / 300, 0, 1);
    draw(progress, currentRegA, bHRV);
    if (progress < 1) {
      animId = requestAnimationFrame(animate);
    } else {
      simRunning = false;
      btn.textContent = 'Simulate interaction';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
})();


/* ── Neural Synchrony Demo ───────────────────────────────── */
(function() {
  var canvas, ctx;
  var mode = 'solo';   // 'coop' | 'conv' | 'solo'
  var animId2 = null;
  var phase = 0;

  var modeParams = {
    coop: { syncStrength: 0.85, baseFreq: 0.06,  color1: '#4a90d9', color2: '#1a56c4', label: 'Cooperative task — high theta synchrony' },
    conv: { syncStrength: 0.55, baseFreq: 0.05,  color1: '#27ae60', color2: '#1e7e34', label: 'Conversation — moderate synchrony' },
    solo: { syncStrength: 0.08, baseFreq: 0.045, color1: '#888',    color2: '#bbb',    label: 'No interaction — minimal synchrony' }
  };

  function init() {
    canvas = document.getElementById('sync-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    document.getElementById('sync-coop').addEventListener('click', function() { mode = 'coop'; });
    document.getElementById('sync-conv').addEventListener('click', function() { mode = 'conv'; });
    document.getElementById('sync-solo').addEventListener('click', function() { mode = 'solo'; });
    loop();
  }

  function drawWave(startX, endX, midY, freq, phaseOff, amp, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var x = startX; x <= endX; x++) {
      var t = (x - startX) / (endX - startX);
      var y = midY - amp * Math.sin(freq * x + phaseOff);
      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function loop() {
    if (!canvas) return;
    var W = canvas.width, H = canvas.height;
    var p = modeParams[mode];
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, W, H);

    var pad = 36;
    var halfH = (H - pad * 2) / 2;

    // Labels
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = p.color1;
    ctx.fillText('Brain A (theta 6 Hz)', pad, pad - 8);
    ctx.fillStyle = p.color2;
    ctx.fillText('Brain B (theta 6 Hz)', pad, pad + halfH + 24);

    // Synchrony meter
    var meterX = W - 120, meterY = 14, meterW = 100, meterH = 14;
    ctx.fillStyle = '#eee';
    ctx.fillRect(meterX, meterY, meterW, meterH);
    ctx.fillStyle = p.color1;
    ctx.fillRect(meterX, meterY, meterW * p.syncStrength, meterH);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(meterX, meterY, meterW, meterH);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText('IBS: ' + Math.round(p.syncStrength * 100) + '%', meterX, meterY + meterH + 11);

    // Brain A wave
    var noiseA = (Math.random() - 0.5) * (1 - p.syncStrength) * 12;
    var mid1 = pad + halfH * 0.5;
    drawWave(pad, W - pad, mid1, p.baseFreq, phase, 28 + noiseA, p.color1);

    // Brain B wave — synchronized or not
    var phaseOffset = (1 - p.syncStrength) * 2.0;
    var noiseB = (Math.random() - 0.5) * (1 - p.syncStrength) * 12;
    var mid2 = pad + halfH * 1.6;
    drawWave(pad, W - pad, mid2, p.baseFreq, phase + phaseOffset, 28 + noiseB, p.color2);

    // Divider
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad + halfH + 10);
    ctx.lineTo(W - pad, pad + halfH + 10);
    ctx.stroke();

    // Mode label
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(p.label, pad, H - 8);

    phase += 0.06;
    animId2 = requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
})();


/* ── Wearable Form Factor Diagram ────────────────────────── */
(function() {
  function init() {
    var canvas = document.getElementById('wearable-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    draw(ctx, canvas.width, canvas.height);
    window.addEventListener('resize', function() {
      resizeCanvas('wearable-canvas');
      draw(ctx, canvas.width, canvas.height);
    });
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }

  function draw(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, W, H);

    var cx = W / 2;

    // ── Glasses ──────────────────────────────────────────
    var gY = 40, gW = Math.min(280, W * 0.55), gH = 50;
    var gX = cx - gW / 2;

    // frame
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(gX, gY + gH / 2);
    ctx.lineTo(gX + gW, gY + gH / 2);
    ctx.stroke();

    // left lens
    roundRect(ctx, gX + 4, gY + 4, gW * 0.43, gH - 8, 8, '#e8f0fb', '#4a90d9');
    // right lens
    roundRect(ctx, gX + gW * 0.53, gY + 4, gW * 0.43, gH - 8, 8, '#e8f0fb', '#4a90d9');

    // ear pieces
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gX + 4, gY + gH / 2); ctx.lineTo(gX - 24, gY + gH * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gX + gW - 4, gY + gH / 2); ctx.lineTo(gX + gW + 24, gY + gH * 0.7);
    ctx.stroke();

    // VOC sensor dot on nose bridge
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(cx, gY + gH / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // In-ear EEG dots at ear tips
    ctx.fillStyle = '#1a56c4';
    ctx.beginPath(); ctx.arc(gX - 24, gY + gH * 0.7, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(gX + gW + 24, gY + gH * 0.7, 5, 0, Math.PI * 2); ctx.fill();

    // Camera dot on frame
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.arc(gX + gW * 0.25, gY + 4, 4, 0, Math.PI * 2); ctx.fill();

    // Glasses label
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Smart Glasses', cx, gY + gH + 18);
    ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
    ctx.fillText('VOC sensor · In-ear EEG · Outward camera', cx, gY + gH + 32);

    // ── Wristband ─────────────────────────────────────────
    var wY = H - 110, wW = 130, wH = 52, wX = cx - wW - 30;
    roundRect(ctx, wX, wY, wW, wH, 10, '#eafaf1', '#27ae60');
    ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#1e7e34';
    ctx.textAlign = 'center';
    ctx.fillText('Wristband', wX + wW / 2, wY + 18);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#555';
    ctx.fillText('HRV · EDA · Temp', wX + wW / 2, wY + 32);
    ctx.fillText('Sweat patch (cortisol)', wX + wW / 2, wY + 44);

    // ── AI Earpiece ───────────────────────────────────────
    var eW = 110, eH = 52, eX = cx + 30, eY = H - 110;
    roundRect(ctx, eX, eY, eW, eH, 10, '#fdecea', '#c0392b');
    ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#a93226';
    ctx.textAlign = 'center';
    ctx.fillText('AI Earpiece', eX + eW / 2, eY + 18);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#555';
    ctx.fillText('Prosody · Haptic', eX + eW / 2, eY + 32);
    ctx.fillText('Real-time feedback', eX + eW / 2, eY + 44);

    // ── Connection lines ──────────────────────────────────
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    // glasses to wristband
    ctx.beginPath();
    ctx.moveTo(gX + gW * 0.2, gY + gH + 2);
    ctx.lineTo(wX + wW / 2, wY);
    ctx.stroke();
    // glasses to earpiece
    ctx.beginPath();
    ctx.moveTo(gX + gW * 0.8, gY + gH + 2);
    ctx.lineTo(eX + eW / 2, eY);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── ML Core label ─────────────────────────────────────
    var mlX = cx - 50, mlY = H / 2 - 18, mlW = 100, mlH = 36;
    roundRect(ctx, mlX, mlY, mlW, mlH, 6, '#f0f4ff', '#1a56c4');
    ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#1a56c4';
    ctx.textAlign = 'center';
    ctx.fillText('ML Core', cx, mlY + 14);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#555';
    ctx.fillText('Dyadic fusion model', cx, mlY + 28);

    // lines to ML core
    ctx.strokeStyle = '#b0c4ff'; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(cx, gY + gH + 2); ctx.lineTo(cx, mlY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wX + wW, wY + wH / 2); ctx.lineTo(mlX, mlY + mlH / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(eX, eY + eH / 2); ctx.lineTo(mlX + mlW, mlY + mlH / 2); ctx.stroke();

    ctx.textAlign = 'left';
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
})();
