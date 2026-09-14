/* relativity-demo.js — special relativity / magnetism canvas */
(function () {
  'use strict';

  var canvas    = document.getElementById('rel-canvas');
  var ctx       = canvas.getContext('2d');
  var box       = document.getElementById('rel-box');
  var captionEl = document.getElementById('rel-caption');

  var currentSl = document.getElementById('current');
  var chargeSl  = document.getElementById('charge-v');
  var currentV  = document.getElementById('current-val');
  var chargeVV  = document.getElementById('chargev-val');
  var playBtn   = document.getElementById('rel-play');

  var state = {
    frame:   'lab',
    current: 0.5,
    chargeV: 0.5,
    playing: true,
    t:       0
  };

  var N = 12; // particles per row

  /* ── Captions ─────────────────────────────────────────── */
  var CAPTIONS = {
    lab:
      '<strong>Lab frame:</strong> The wire is electrically neutral — equal density of ' +
      'positive ions (stationary, <span style="color:#ff8888">+</span>) and electrons ' +
      '(moving left, <span style="color:#88aaff">−</span>). Net charge = 0. ' +
      'The test charge moves right at velocity v. ' +
      'Classical EM: moving charge in B-field → magnetic force toward wire.',
    charge:
      '<strong>Charge\'s frame:</strong> Boosted to move with the test charge — it is now ' +
      'stationary. Electrons are also now stationary. But the ions are moving and are ' +
      '<em>length-contracted</em> — more densely packed. The wire now has a net ' +
      '<span style="color:#ff8888">positive</span> charge → electric field attracts the ' +
      'test charge. Same force magnitude, but now purely electric.',
    explain:
      '<strong>The punchline:</strong> Magnetism is not a separate force. It is what ' +
      'electricity looks like in a different reference frame. The "magnetic" force in the ' +
      'lab frame and the "electric" force in the charge\'s frame are the same 4-force. ' +
      'Special relativity unifies them.'
  };

  /* ── Frame tabs ───────────────────────────────────────── */
  function setFrame(f) {
    state.frame = f;
    ['lab', 'charge', 'explain'].forEach(function (id) {
      document.getElementById('tab-' + id).classList.toggle('active', id === f);
    });
    captionEl.innerHTML = CAPTIONS[f];
  }

  ['lab', 'charge', 'explain'].forEach(function (id) {
    document.getElementById('tab-' + id).addEventListener('click', function () { setFrame(id); });
  });

  /* ── Controls ─────────────────────────────────────────── */
  currentSl.addEventListener('input', function () {
    state.current = parseFloat(this.value);
    currentV.textContent = state.current.toFixed(2);
  });
  chargeSl.addEventListener('input', function () {
    state.chargeV = parseFloat(this.value);
    chargeVV.textContent = state.chargeV.toFixed(2);
  });

  playBtn.addEventListener('click', function () {
    state.playing = !state.playing;
    this.textContent = state.playing ? '⏸ Pause' : '▶ Play';
    this.classList.toggle('active', state.playing);
  });

  document.getElementById('rel-reset').addEventListener('click', function () {
    state.t = 0; state.playing = true;
    playBtn.textContent = '⏸ Pause'; playBtn.classList.add('active');
    currentSl.value = 0.5; chargeSl.value = 0.5;
    state.current = 0.5; state.chargeV = 0.5;
    currentV.textContent = '0.50'; chargeVV.textContent = '0.50';
  });

  /* ── Draw: lab / charge frame ─────────────────────────── */
  function drawWireFrame(W, H) {
    var isCharge = state.frame === 'charge';
    var wireY    = H / 2;
    var wireH    = 38;
    var wireTop  = wireY - wireH / 2;

    /* wire background */
    var wg = ctx.createLinearGradient(0, wireTop, 0, wireTop + wireH);
    wg.addColorStop(0, '#1a1a2e');
    wg.addColorStop(1, '#16213e');
    ctx.fillStyle = wg;
    ctx.fillRect(0, wireTop, W, wireH);
    ctx.strokeStyle = '#2a2a4e'; ctx.lineWidth = 1;
    ctx.strokeRect(0, wireTop, W, wireH);

    ctx.font = '11px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = '#555'; ctx.textAlign = 'left';
    ctx.fillText('wire', 8, wireY + 4);

    /* Lorentz factor for ions in charge frame */
    var gamma = 1.0;
    if (isCharge) {
      var v2 = Math.min(0.99, state.chargeV * state.chargeV);
      gamma = 1 / Math.sqrt(1 - v2);
    }

    /* ions */
    var ionSpacing    = W / (N + 1);
    var ionSpacingAdj = isCharge ? ionSpacing / gamma : ionSpacing;
    var ionOffset     = isCharge ? (state.t * state.chargeV * 60) % ionSpacingAdj : 0;
    var nIons         = Math.ceil(W / ionSpacingAdj) + 2;

    for (var i = 0; i < nIons; i++) {
      var ix = (i * ionSpacingAdj - ionOffset + W * 2) % (W + ionSpacingAdj) - ionSpacingAdj / 2;
      if (ix < -20 || ix > W + 20) continue;
      ctx.beginPath(); ctx.arc(ix, wireY - 6, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#cc4444'; ctx.fill();
      ctx.font = '9px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText('+', ix, wireY - 3);
    }

    /* electrons */
    var eleSpacing = W / (N + 1);
    var eleOffset  = isCharge ? 0 : (state.t * state.current * 80) % eleSpacing;
    var nEle       = Math.ceil(W / eleSpacing) + 2;

    for (var j = 0; j < nEle; j++) {
      var ex = (j * eleSpacing + eleOffset + W * 2) % (W + eleSpacing) - eleSpacing / 2;
      if (ex < -20 || ex > W + 20) continue;
      ctx.beginPath(); ctx.arc(ex, wireY + 6, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#4466cc'; ctx.fill();
      ctx.font = '9px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText('−', ex, wireY + 9);
    }

    /* net charge label */
    ctx.font = '11px Helvetica Neue, Arial, sans-serif'; ctx.textAlign = 'center';
    if (isCharge) {
      ctx.fillStyle = '#ff8888';
      ctx.fillText('Net charge: +  (ions denser by γ = ' + gamma.toFixed(2) + ')', W / 2, wireTop - 8);
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('Net charge: 0  (electrically neutral)', W / 2, wireTop - 8);
    }

    /* test charge */
    var tcY = wireY + 90;
    var tcX = isCharge
      ? W / 2
      : (W * 0.2 + state.t * state.chargeV * 50) % W;

    ctx.beginPath(); ctx.arc(tcX, tcY, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#44cc66'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText('q+', tcX, tcY + 4);

    /* velocity arrow (lab frame only) */
    if (!isCharge && Math.abs(state.chargeV) > 0.02) {
      var vLen = state.chargeV * 55;
      var vd   = vLen > 0 ? 1 : -1;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(tcX, tcY); ctx.lineTo(tcX + vLen, tcY);
      ctx.strokeStyle = '#88ff88'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tcX + vLen, tcY);
      ctx.lineTo(tcX + vLen - vd * 10, tcY - 5);
      ctx.lineTo(tcX + vLen - vd * 10, tcY + 5);
      ctx.closePath();
      ctx.fillStyle = '#88ff88'; ctx.fill();
      ctx.font = '10px Helvetica Neue, Arial, sans-serif';
      ctx.fillStyle = '#88ff88'; ctx.textAlign = 'center';
      ctx.fillText('v', tcX + vLen / 2, tcY - 8);
      ctx.restore();
    }

    /* force arrow */
    var strength  = Math.abs(state.chargeV) * state.current;
    var forceDir  = isCharge ? -1 : (state.chargeV * state.current > 0 ? -1 : 1);
    var wireBot   = wireTop + wireH;

    if (strength > 0.02) {
      var arrowLen = forceDir * strength * 50;
      var ay1 = tcY - 14;
      var ay2 = ay1 + arrowLen;
      if (forceDir < 0) ay2 = Math.max(ay2, wireBot + 6);

      ctx.save();
      ctx.beginPath(); ctx.moveTo(tcX, ay1); ctx.lineTo(tcX, ay2);
      ctx.strokeStyle = isCharge ? '#ff8888' : '#ffe040'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tcX, ay2);
      ctx.lineTo(tcX - 6, ay2 - forceDir * 12);
      ctx.lineTo(tcX + 6, ay2 - forceDir * 12);
      ctx.closePath();
      ctx.fillStyle = isCharge ? '#ff8888' : '#ffe040'; ctx.fill();
      ctx.font = '11px Helvetica Neue, Arial, sans-serif';
      ctx.fillStyle = isCharge ? '#ff8888' : '#ffe040'; ctx.textAlign = 'left';
      ctx.fillText(isCharge ? 'F_elec' : 'F_mag', tcX + 10, (ay1 + ay2) / 2);
      ctx.restore();
    }

    /* frame label */
    ctx.font = 'bold 12px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = isCharge ? '#7eb8f7' : '#aaa'; ctx.textAlign = 'right';
    ctx.fillText(isCharge ? "Charge's frame  (v = 0)" : 'Lab frame', W - 12, 18);
  }

  /* ── Draw: explain panel ──────────────────────────────── */
  function drawExplain(W, H) {
    var cx = W / 2, cy = H / 2 - 30;
    var lx = W * 0.25, rx = W * 0.75;

    /* left: lab frame */
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(lx - 80, cy - 18, 160, 36);
    ctx.font = '10px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = '#aaa'; ctx.textAlign = 'center';
    ctx.fillText('Lab frame', lx, cy - 28);
    for (var i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(lx - 50 + i * 22, cy - 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#cc4444'; ctx.fill();
      ctx.beginPath(); ctx.arc(lx - 50 + i * 22, cy + 7, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4466cc'; ctx.fill();
    }
    ctx.font = '8px sans-serif'; ctx.fillStyle = '#aaa'; ctx.textAlign = 'center';
    ctx.fillText('neutral wire', lx, cy + 22);
    ctx.fillText('B-field → F_mag on q', lx, cy + 35);

    /* right: charge frame */
    ctx.fillStyle = '#1a2e1a'; ctx.fillRect(rx - 80, cy - 18, 160, 36);
    ctx.font = '10px Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = '#aaa'; ctx.textAlign = 'center';
    ctx.fillText("Charge's frame", rx, cy - 28);
    for (var k = 0; k < 5; k++) {
      ctx.beginPath(); ctx.arc(rx - 48 + k * 22, cy - 5, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#cc4444'; ctx.fill();
      ctx.beginPath(); ctx.arc(rx - 50 + k * 26, cy + 7, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4466cc'; ctx.fill();
    }
    ctx.font = '8px sans-serif'; ctx.fillStyle = '#ff8888'; ctx.textAlign = 'center';
    ctx.fillText('net + charge (contracted ions)', rx, cy + 22);
    ctx.fillText('E-field → F_elec on q', rx, cy + 35);

    /* equals */
    ctx.font = 'bold 28px Georgia';
    ctx.fillStyle = '#7eb8f7'; ctx.textAlign = 'center';
    ctx.fillText('=', W / 2, cy + 10);

    /* footer */
    ctx.font = '13px Georgia'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText('Same force. Different name. Same physics.', W / 2, H - 30);
    ctx.font = 'italic 11px Georgia'; ctx.fillStyle = '#555';
    ctx.fillText('F = qv×B  (lab)  =  F = qE  (charge\'s frame)', W / 2, H - 12);
  }

  /* ── Animation loop ───────────────────────────────────── */
  var lastTS = null;

  function loop(ts) {
    if (!lastTS) lastTS = ts;
    var dt = (ts - lastTS) / 1000;
    lastTS = ts;
    if (state.playing) state.t += dt;

    canvas.width  = box.clientWidth;
    canvas.height = 320;

    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (state.frame === 'explain') {
      drawExplain(canvas.width, canvas.height);
    } else {
      drawWireFrame(canvas.width, canvas.height);
    }

    requestAnimationFrame(loop);
  }

  /* ── Init ─────────────────────────────────────────────── */
  setFrame('lab');
  requestAnimationFrame(loop);
})();
