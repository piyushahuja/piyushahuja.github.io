(function () {
'use strict';

/* ══════════════════════════════════════════════════════════════
   DEMO 1 — EXPLODING LIBRARY (Curse of Dimensionality)
══════════════════════════════════════════════════════════════ */
function initDimDemo() {
  var container = document.getElementById('dim-demo');
  if (!container) return;

  var slider   = document.getElementById('dim-slider');
  var valLabel = document.getElementById('dim-val');

  // Build DOM structure
  container.style.cssText = 'display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;';

  // Grid panel
  var gridPanel = document.createElement('div');
  gridPanel.style.cssText = 'flex-shrink:0;';
  container.appendChild(gridPanel);

  // Thermometer panel
  var thermPanel = document.createElement('div');
  thermPanel.style.cssText = 'flex:1;min-width:80px;display:flex;flex-direction:column;align-items:center;gap:.4rem;';

  var thermLabel = document.createElement('div');
  thermLabel.style.cssText = 'font-size:.78em;font-family:monospace;text-align:center;color:#333;word-break:break-all;max-width:160px;';

  var thermOuter = document.createElement('div');
  thermOuter.style.cssText = 'width:36px;height:180px;background:#eee;border:1px solid #bbb;border-radius:4px;position:relative;overflow:hidden;';

  var thermBar = document.createElement('div');
  thermBar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:#4a90d9;transition:height .35s ease;border-radius:0 0 3px 3px;';
  thermOuter.appendChild(thermBar);

  thermPanel.appendChild(thermLabel);
  thermPanel.appendChild(thermOuter);
  container.appendChild(thermPanel);

  function formatCount(n) {
    if (n <= 16) {
      var val = Math.pow(2, n);
      return val.toLocaleString();
    } else {
      var exp = (n * Math.log10(2));
      var expInt = Math.floor(exp);
      var mantissa = Math.pow(10, exp - expInt);
      return mantissa.toFixed(2) + ' × 10<sup>' + expInt + '</sup>';
    }
  }

  function buildGrid(n) {
    gridPanel.innerHTML = '';
    var cols = Math.min(n, 8);
    var rows = Math.ceil(n / cols);
    var svgNS = 'http://www.w3.org/2000/svg';
    var cellSize = 22;
    var gap = 3;
    var W = cols * (cellSize + gap) - gap;
    var H = rows * (cellSize + gap) - gap;
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.style.display = 'block';

    for (var i = 0; i < n; i++) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var x = col * (cellSize + gap);
      var y = row * (cellSize + gap);
      var rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', cellSize);
      rect.setAttribute('height', cellSize);
      rect.setAttribute('rx', 3);
      rect.setAttribute('fill', '#f0f4ff');
      rect.setAttribute('stroke', '#4a90d9');
      rect.setAttribute('stroke-width', '1.5');
      rect.style.cursor = 'pointer';

      (function(r) {
        var on = false;
        r.addEventListener('click', function() {
          on = !on;
          r.setAttribute('fill', on ? '#4a90d9' : '#f0f4ff');
        });
      })(rect);

      svg.appendChild(rect);
    }
    gridPanel.appendChild(svg);
  }

  function update(n) {
    valLabel.textContent = n;
    buildGrid(n);

    // Thermometer bar: height = min(100%, 2^n / 2^28 * 100%)
    var maxN = 28;
    var frac = Math.min(1, Math.pow(2, n) / Math.pow(2, maxN));
    thermBar.style.height = (frac * 100) + '%';

    if (n >= 28) {
      thermBar.style.background = '#c0392b';
      thermLabel.style.color = '#c0392b';
      thermLabel.innerHTML = '2<sup>' + n + '</sup> = ' + formatCount(n) + '<br><strong>More than atoms in the observable universe</strong>';
    } else {
      thermBar.style.background = '#4a90d9';
      thermLabel.style.color = '#333';
      thermLabel.innerHTML = '2<sup>' + n + '</sup> = ' + formatCount(n);
    }
  }

  slider.addEventListener('input', function() { update(+this.value); });
  update(+slider.value);
}


/* ══════════════════════════════════════════════════════════════
   DEMO 2 — PROBABILITY LANDSCAPE (Three.js 3D surface)
══════════════════════════════════════════════════════════════ */
function initLandscapeDemo() {
  var wrapper = document.getElementById('landscape-canvas-wrapper');
  var canvas  = document.getElementById('landscape-canvas');
  if (!wrapper || !canvas || typeof THREE === 'undefined') return;

  var W = wrapper.clientWidth  || 600;
  var H = wrapper.clientHeight || 338;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene  = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);

  var camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 100);
  camera.position.set(0, 4, 6);
  camera.lookAt(0, 0, 0);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(3, 6, 4);
  scene.add(dirLight);

  // Geometry
  var SEG = 60;
  var geometry = new THREE.PlaneGeometry(4, 4, SEG, SEG);
  geometry.rotateX(-Math.PI / 2);

  // Vertex colors
  var posArr = geometry.attributes.position;
  var count  = posArr.count;
  var colors = new Float32Array(count * 3);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0.1
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // OrbitControls
  var controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 14;
  }

  // Gaussian peaks
  var FIXED_PEAKS = [
    {x: -1.0, z: -0.8}, {x:  0.8, z:  0.6}, {x: -0.5, z:  1.2},
    {x:  1.3, z: -0.4}, {x: -1.4, z:  0.4}, {x:  0.2, z: -1.3}
  ];

  function computeHeights(mode, numPeaks) {
    var heights = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      var px = posArr.getX(i);
      var pz = posArr.getZ(i);
      var h = 0;
      if (mode === 'uniform') {
        h = 0.05;
      } else if (mode === 'gaussian') {
        var r2 = px * px + pz * pz;
        h = Math.exp(-r2 / 0.6);
      } else if (mode === 'mixture') {
        var n = Math.min(numPeaks, FIXED_PEAKS.length);
        for (var k = 0; k < n; k++) {
          var dx = px - FIXED_PEAKS[k].x;
          var dz = pz - FIXED_PEAKS[k].z;
          h += Math.exp(-(dx * dx + dz * dz) / 0.35);
        }
        h /= n;
      }
      heights[i] = h;
    }
    return heights;
  }

  function applyHeights(heights) {
    var maxH = 0;
    for (var i = 0; i < heights.length; i++) maxH = Math.max(maxH, heights[i]);
    if (maxH < 0.001) maxH = 1;
    var pos = posArr;
    var col = geometry.attributes.color;
    for (var i = 0; i < count; i++) {
      var h = heights[i];
      pos.setY(i, h * 1.4);
      // Color: blue (low) → teal → yellow → white (high)
      var t = h / maxH;
      var r, g, b;
      if (t < 0.5) {
        r = t * 2 * 0.2;
        g = t * 2 * 0.6;
        b = 0.5 + t * 2 * 0.2;
      } else {
        var t2 = (t - 0.5) * 2;
        r = 0.2 + t2 * 0.8;
        g = 0.6 + t2 * 0.4;
        b = 0.7 - t2 * 0.7;
      }
      col.setXYZ(i, r, g, b);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  // Smooth interpolation state
  var currentHeights = computeHeights('gaussian', 3);
  var targetHeights  = new Float32Array(currentHeights);
  var lerpHeights    = new Float32Array(currentHeights);
  var lerpProgress   = 1;
  var LERP_FRAMES    = 40;

  applyHeights(currentHeights);

  function setTarget(mode, numPeaks) {
    targetHeights = computeHeights(mode, numPeaks);
    lerpProgress  = 0;
  }

  // Controls
  var btnUniform  = document.getElementById('btn-uniform');
  var btnGaussian = document.getElementById('btn-gaussian');
  var btnMixture  = document.getElementById('btn-mixture');
  var peaksSlider = document.getElementById('peaks-slider');
  var peaksVal    = document.getElementById('peaks-val');

  var currentMode   = 'gaussian';
  var currentPeaks  = 3;

  function activateBtn(btn) {
    [btnUniform, btnGaussian, btnMixture].forEach(function(b) { if(b) b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
  }

  if (btnUniform)  btnUniform.addEventListener('click',  function() { currentMode='uniform';  activateBtn(this); setTarget('uniform', currentPeaks);  });
  if (btnGaussian) btnGaussian.addEventListener('click', function() { currentMode='gaussian'; activateBtn(this); setTarget('gaussian', currentPeaks); });
  if (btnMixture)  btnMixture.addEventListener('click',  function() { currentMode='mixture';  activateBtn(this); setTarget('mixture', currentPeaks);  });
  if (peaksSlider) {
    peaksSlider.addEventListener('input', function() {
      currentPeaks = +this.value;
      if (peaksVal) peaksVal.textContent = currentPeaks;
      if (currentMode === 'mixture') setTarget('mixture', currentPeaks);
    });
  }
  if (btnGaussian) btnGaussian.classList.add('active');

  // Auto-orbit when not interacting
  var autoOrbit    = true;
  var orbitAngle   = 0;
  var lastInteract = 0;
  renderer.domElement.addEventListener('pointerdown', function() { autoOrbit = false; lastInteract = Date.now(); });

  function animate() {
    requestAnimationFrame(animate);

    // Lerp heights
    if (lerpProgress < 1) {
      lerpProgress = Math.min(1, lerpProgress + 1 / LERP_FRAMES);
      var t = lerpProgress < 0.5 ? 2 * lerpProgress * lerpProgress : -1 + (4 - 2 * lerpProgress) * lerpProgress; // ease in-out
      for (var i = 0; i < count; i++) {
        lerpHeights[i] = currentHeights[i] + (targetHeights[i] - currentHeights[i]) * t;
      }
      applyHeights(lerpHeights);
      if (lerpProgress >= 1) {
        currentHeights = new Float32Array(targetHeights);
      }
    }

    // Auto orbit
    if (!autoOrbit && Date.now() - lastInteract > 3000) autoOrbit = true;
    if (autoOrbit) {
      orbitAngle += 0.004;
      camera.position.x = Math.sin(orbitAngle) * 6;
      camera.position.z = Math.cos(orbitAngle) * 6;
      camera.lookAt(0, 0.5, 0);
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', function() {
    var nW = wrapper.clientWidth;
    var nH = Math.round(nW * 9 / 16);
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });
}


/* ══════════════════════════════════════════════════════════════
   DEMO 3 — SNAPPING CONNECTIONS (D3 graph)
══════════════════════════════════════════════════════════════ */
function initGraphDemo() {
  var graphDiv  = document.getElementById('graph-demo');
  var sampleDiv = document.getElementById('graph-sample');
  if (!graphDiv || typeof d3 === 'undefined') return;

  var W = 320, H = 320;
  var N = 12;
  var R = 118; // radius of circle arrangement

  // Pre-compute node positions on a circle
  var nodes = [];
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    nodes.push({ id: i, x: W / 2 + R * Math.cos(angle), y: H / 2 + R * Math.sin(angle) });
  }

  // Edge sets for each mode
  var edgesFull = [];
  for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) edgesFull.push([a, b]);

  var edgesIndep = [];  // no edges

  // Neural net: 4 hidden nodes connected sparsely
  var hiddenNodes = [
    { id: 12, x: W / 2 - 50, y: H / 2 - 30 },
    { id: 13, x: W / 2 + 50, y: H / 2 - 30 },
    { id: 14, x: W / 2 - 50, y: H / 2 + 30 },
    { id: 15, x: W / 2 + 50, y: H / 2 + 30 }
  ];
  var edgesNeural = [
    [0,12],[1,12],[2,13],[3,13],[4,14],[5,14],[6,15],[7,15],
    [8,12],[9,13],[10,14],[11,15],
    [12,13],[12,14],[13,15],[14,15]
  ];

  var svg = d3.select(graphDiv)
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  // Label
  var label = svg.append('text')
    .attr('x', W / 2)
    .attr('y', H - 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', '#555')
    .attr('font-family', 'Georgia, serif');

  // Layer for edges
  var edgeLayer = svg.append('g');
  // Layer for hidden nodes
  var hiddenLayer = svg.append('g');
  // Layer for main nodes
  var nodeLayer = svg.append('g');

  // Draw main nodes
  nodeLayer.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 10)
    .attr('fill', '#e8f0fb')
    .attr('stroke', '#4a90d9')
    .attr('stroke-width', 1.5);

  // Node labels
  nodeLayer.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 9)
    .attr('fill', '#333')
    .attr('font-family', 'Georgia, serif')
    .text(function(d) { return 'x' + (d.id + 1); });

  var currentMode = 'fulljoint';

  function render(mode) {
    currentMode = mode;

    // Update buttons
    ['btn-fulljoint', 'btn-independent', 'btn-structured'].forEach(function(id) {
      var btn = document.getElementById(id);
      if (btn) btn.classList.remove('active');
    });
    var activeId = mode === 'fulljoint' ? 'btn-fulljoint' : mode === 'independent' ? 'btn-independent' : 'btn-structured';
    var activeBtn = document.getElementById(activeId);
    if (activeBtn) activeBtn.classList.add('active');

    // Hidden nodes visibility
    var allNodes = (mode === 'structured') ? nodes.concat(hiddenNodes) : nodes;
    var edges    = (mode === 'fulljoint') ? edgesFull : (mode === 'independent') ? edgesIndep : edgesNeural;

    // Edges
    var allEdgeNodes = (mode === 'structured') ? nodes.concat(hiddenNodes) : nodes;
    var edgeSel = edgeLayer.selectAll('line').data(edges);

    edgeSel.enter()
      .append('line')
      .attr('x1', function(d) { return allEdgeNodes[d[0]].x; })
      .attr('y1', function(d) { return allEdgeNodes[d[0]].y; })
      .attr('x2', function(d) { return allEdgeNodes[d[1]].x; })
      .attr('y2', function(d) { return allEdgeNodes[d[1]].y; })
      .attr('stroke', mode === 'structured' ? '#27ae60' : '#4a90d9')
      .attr('stroke-width', mode === 'fulljoint' ? 0.8 : 1.5)
      .attr('opacity', 0)
      .transition().duration(500)
      .attr('opacity', mode === 'fulljoint' ? 0.3 : 0.7);

    edgeSel
      .attr('x1', function(d) { return allEdgeNodes[d[0]].x; })
      .attr('y1', function(d) { return allEdgeNodes[d[0]].y; })
      .attr('x2', function(d) { return allEdgeNodes[d[1]].x; })
      .attr('y2', function(d) { return allEdgeNodes[d[1]].y; })
      .attr('stroke', mode === 'structured' ? '#27ae60' : '#4a90d9')
      .attr('stroke-width', mode === 'fulljoint' ? 0.8 : 1.5)
      .transition().duration(600)
      .attr('opacity', mode === 'fulljoint' ? 0.3 : (mode === 'independent' ? 0 : 0.7));

    edgeSel.exit()
      .transition().duration(400)
      .attr('opacity', 0)
      .remove();

    // Hidden nodes
    var hidSel = hiddenLayer.selectAll('circle.hidden-node').data(mode === 'structured' ? hiddenNodes : []);
    hidSel.enter()
      .append('circle')
      .attr('class', 'hidden-node')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', 13)
      .attr('fill', '#eafaf1')
      .attr('stroke', '#27ae60')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .transition().duration(600)
      .attr('opacity', 1);
    hidSel.exit()
      .transition().duration(400)
      .attr('opacity', 0)
      .remove();

    var hidTxtSel = hiddenLayer.selectAll('text.hidden-label').data(mode === 'structured' ? hiddenNodes : []);
    hidTxtSel.enter()
      .append('text')
      .attr('class', 'hidden-label')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#27ae60')
      .attr('font-family', 'Georgia, serif')
      .attr('opacity', 0)
      .text('h')
      .transition().duration(600)
      .attr('opacity', 1);
    hidTxtSel.exit()
      .transition().duration(400)
      .attr('opacity', 0)
      .remove();

    // Label
    var labelText = {
      'fulljoint':    '66 edges · 2¹² = 4096 parameters',
      'independent':  '0 edges · 12 parameters · no correlations',
      'structured':   '~50 parameters · learns correlations'
    }[mode];
    label.text(labelText);

    // Sample panel
    renderSample(mode);
  }

  function renderSample(mode) {
    if (!sampleDiv) return;
    sampleDiv.innerHTML = '';

    var title = document.createElement('p');
    title.style.cssText = 'font-size:.78em;color:#555;margin:0 0 .4rem;font-family:Georgia,serif;';
    title.textContent = 'Sample:';
    sampleDiv.appendChild(title);

    var svgNS = 'http://www.w3.org/2000/svg';
    var gridSVG = document.createElementNS(svgNS, 'svg');
    var cellSize = 18;
    var gap = 2;
    var cols = 4, rows = 4;
    gridSVG.setAttribute('width',  cols * (cellSize + gap) - gap);
    gridSVG.setAttribute('height', rows * (cellSize + gap) - gap);

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var x = col * (cellSize + gap);
        var y = row * (cellSize + gap);
        var rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', cellSize);
        rect.setAttribute('height', cellSize);
        rect.setAttribute('rx', 2);

        var fill;
        if (mode === 'independent') {
          // Pure random — TV static
          fill = Math.random() > 0.5 ? '#222' : '#eee';
        } else if (mode === 'fulljoint') {
          // Rich patterns — simulate complex correlated image
          var px = col / cols, py = row / rows;
          var wave = Math.sin(px * 8) * Math.cos(py * 6);
          fill = wave > 0 ? '#4a90d9' : '#f0f4ff';
        } else {
          // Neural net — coherent blobs
          var cx = 0.4, cy = 0.4;
          var dx = (col / cols) - cx, dy = (row / rows) - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          fill = dist < 0.35 ? '#4a90d9' : (col % 2 === row % 2 ? '#c8dcf5' : '#e8f0fb');
        }
        rect.setAttribute('fill', fill);
        gridSVG.appendChild(rect);
      }
    }
    sampleDiv.appendChild(gridSVG);

    var desc = document.createElement('p');
    desc.style.cssText = 'font-size:.75em;color:#777;margin:.4rem 0 0;font-family:Georgia,serif;';
    desc.textContent = {
      'fulljoint':   'Expressive, but needs 4096 params',
      'independent': 'TV static — ignores all correlations',
      'structured':  'Coherent blobs — learned structure'
    }[mode];
    sampleDiv.appendChild(desc);
  }

  var btnFull  = document.getElementById('btn-fulljoint');
  var btnIndep = document.getElementById('btn-independent');
  var btnNet   = document.getElementById('btn-structured');

  if (btnFull)  btnFull.addEventListener('click',  function() { render('fulljoint');   });
  if (btnIndep) btnIndep.addEventListener('click', function() { render('independent'); });
  if (btnNet)   btnNet.addEventListener('click',   function() { render('structured');  });

  render('fulljoint');
}


/* ══════════════════════════════════════════════════════════════
   DEMO 4 — SPAM DETECTIVE (Discriminative vs Generative)
══════════════════════════════════════════════════════════════ */
function initSpamDemo() {
  var scatterCanvas = document.getElementById('spam-scatter');
  var barsCanvas    = document.getElementById('spam-bars');
  if (!scatterCanvas || !barsCanvas) return;

  var sCtx = scatterCanvas.getContext('2d');
  var bCtx = barsCanvas.getContext('2d');
  var SW = scatterCanvas.width, SH = scatterCanvas.height;
  var BW = barsCanvas.width,    BH = barsCanvas.height;

  // Pre-defined scatter data points: [spamScore, hamScore, label] (0=ham,1=spam)
  var scatterPts = [
    {x:.15,y:.72,c:0},{x:.22,y:.60,c:0},{x:.30,y:.55,c:0},{x:.12,y:.80,c:0},
    {x:.25,y:.65,c:0},{x:.18,y:.78,c:0},{x:.35,y:.50,c:0},{x:.28,y:.68,c:0},
    {x:.70,y:.22,c:1},{x:.78,y:.15,c:1},{x:.82,y:.28,c:1},{x:.65,y:.32,c:1},
    {x:.75,y:.18,c:1},{x:.88,y:.12,c:1},{x:.60,y:.40,c:1},{x:.72,y:.25,c:1}
  ];

  // Word data: { spamProb, hamProb } — probability of word given class
  var wordData = {
    'URGENT':  { sp: 0.72, ha: 0.08 },
    'BANK':    { sp: 0.65, ha: 0.12 },
    'ACCOUNT': { sp: 0.60, ha: 0.14 },
    'PRINCE':  { sp: 0.55, ha: 0.04 },
    'MEETING': { sp: 0.10, ha: 0.68 },
    'LUNCH':   { sp: 0.08, ha: 0.55 },
    'PROJECT': { sp: 0.12, ha: 0.62 }
  };

  // Logistic regression weights for scatter (hand-crafted)
  var discWeights = {
    'URGENT':  0.90,
    'BANK':    0.65,
    'ACCOUNT': 0.30,  // reduced — correlated with BANK
    'PRINCE':  0.80,
    'MEETING': -0.75,
    'LUNCH':   -0.65,
    'PROJECT': -0.70
  };

  var activeWords = {};

  // Chip toggle
  document.querySelectorAll('.word-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var w = this.getAttribute('data-word');
      activeWords[w] = !activeWords[w];
      this.style.background  = activeWords[w] ? '#4a90d9' : '';
      this.style.color        = activeWords[w] ? '#fff' : '';
      this.style.borderColor  = activeWords[w] ? '#4a90d9' : '';
      update();
    });
    chip.style.cssText += ';cursor:pointer;padding:.25rem .55rem;border:1.5px solid #ccc;border-radius:4px;background:#f5f5f5;font-size:.8em;font-family:Georgia,serif;';
  });

  var clearBtn = document.getElementById('btn-clear-words');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      activeWords = {};
      document.querySelectorAll('.word-chip').forEach(function(chip) {
        chip.style.background = '';
        chip.style.color = '';
        chip.style.borderColor = '';
      });
      update();
    });
  }

  function computeScores() {
    var words = Object.keys(activeWords).filter(function(w) { return activeWords[w]; });

    // Discriminative: logistic regression — sigmoid of weighted sum
    var logitDisc = 0;
    words.forEach(function(w) { logitDisc += (discWeights[w] || 0); });
    var pSpamDisc = 1 / (1 + Math.exp(-logitDisc));

    // Generative: Naïve Bayes — log-sum of individual log-likelihoods
    var logSpam = Math.log(0.4);  // prior
    var logHam  = Math.log(0.6);
    words.forEach(function(w) {
      var d = wordData[w];
      if (d) {
        logSpam += Math.log(d.sp + 1e-9);
        logHam  += Math.log(d.ha + 1e-9);
      }
    });
    var maxLog   = Math.max(logSpam, logHam);
    var pSpamGen = Math.exp(logSpam - maxLog) / (Math.exp(logSpam - maxLog) + Math.exp(logHam - maxLog));

    return { disc: pSpamDisc, gen: pSpamGen, words: words };
  }

  function drawScatter(pSpam, words) {
    sCtx.clearRect(0, 0, SW, SH);
    var pad = 30;
    var innerW = SW - 2 * pad;
    var innerH = SH - 2 * pad;

    // Background tint based on decision
    sCtx.fillStyle = 'rgba(74,144,217,0.06)';
    sCtx.fillRect(pad, pad, innerW * pSpam, innerH);
    sCtx.fillStyle = 'rgba(230,80,74,0.06)';
    sCtx.fillRect(pad + innerW * pSpam, pad, innerW * (1 - pSpam), innerH);

    // Axes
    sCtx.strokeStyle = '#ccc'; sCtx.lineWidth = 1;
    sCtx.beginPath(); sCtx.moveTo(pad, pad); sCtx.lineTo(pad, pad + innerH); sCtx.lineTo(pad + innerW, pad + innerH); sCtx.stroke();

    sCtx.fillStyle = '#aaa'; sCtx.font = '10px Georgia';
    sCtx.fillText('Spam features →', pad, pad + innerH + 14);
    sCtx.save(); sCtx.translate(pad - 14, pad + innerH / 2);
    sCtx.rotate(-Math.PI / 2); sCtx.fillText('Ham features →', 0, 0); sCtx.restore();

    // Decision boundary
    var bx = pad + innerW * pSpam;
    sCtx.strokeStyle = '#333'; sCtx.lineWidth = 2; sCtx.setLineDash([5, 4]);
    sCtx.beginPath(); sCtx.moveTo(bx, pad); sCtx.lineTo(bx, pad + innerH); sCtx.stroke();
    sCtx.setLineDash([]);

    // Points
    scatterPts.forEach(function(p) {
      var cx = pad + p.x * innerW;
      var cy = pad + (1 - p.y) * innerH;
      sCtx.beginPath();
      sCtx.arc(cx, cy, 6, 0, Math.PI * 2);
      sCtx.fillStyle = p.c === 1 ? '#c0392b' : '#4a90d9';
      sCtx.strokeStyle = '#fff'; sCtx.lineWidth = 1.5;
      sCtx.fill(); sCtx.stroke();
    });

    // Current email point
    if (words.length > 0) {
      var emailX = pad + pSpam * innerW;
      var emailY = pad + innerH * 0.5;
      sCtx.beginPath();
      sCtx.arc(emailX, emailY, 9, 0, Math.PI * 2);
      sCtx.fillStyle = '#f39c12';
      sCtx.strokeStyle = '#333'; sCtx.lineWidth = 2;
      sCtx.fill(); sCtx.stroke();
      sCtx.fillStyle = '#333'; sCtx.font = 'bold 10px Georgia';
      sCtx.fillText('email', emailX + 12, emailY + 4);
    }
  }

  function drawBars(pSpam, words) {
    bCtx.clearRect(0, 0, BW, BH);
    var pad = 30;
    var barH = 18;
    var gap  = 8;
    var maxLabelW = 70;
    var barW = BW - pad - maxLabelW - 10;

    // Title
    bCtx.fillStyle = '#555'; bCtx.font = '10px Georgia';
    bCtx.fillText('Word evidence per class:', pad, 16);

    var y = pad;
    var activeList = Object.keys(wordData);
    activeList.forEach(function(w) {
      var on = activeWords[w];
      var d  = wordData[w];

      bCtx.fillStyle = on ? '#333' : '#bbb';
      bCtx.font = (on ? 'bold ' : '') + '10px Georgia';
      bCtx.fillText(w, pad, y + barH * 0.7);

      // Spam bar (red)
      var spW = d.sp * barW;
      bCtx.fillStyle = on ? 'rgba(192,57,43,0.7)' : 'rgba(192,57,43,0.2)';
      bCtx.fillRect(maxLabelW + pad, y, spW, barH / 2 - 1);

      // Ham bar (blue)
      var haW = d.ha * barW;
      bCtx.fillStyle = on ? 'rgba(74,144,217,0.7)' : 'rgba(74,144,217,0.2)';
      bCtx.fillRect(maxLabelW + pad, y + barH / 2, haW, barH / 2 - 1);

      y += barH + gap;
    });

    // Legend
    bCtx.fillStyle = 'rgba(192,57,43,0.8)'; bCtx.fillRect(pad, BH - 22, 10, 8);
    bCtx.fillStyle = '#555'; bCtx.font = '10px Georgia'; bCtx.fillText('Spam', pad + 13, BH - 15);
    bCtx.fillStyle = 'rgba(74,144,217,0.8)'; bCtx.fillRect(pad + 60, BH - 22, 10, 8);
    bCtx.fillText('Ham', pad + 73, BH - 15);

    // Double-counting warning
    if (activeWords['BANK'] && activeWords['ACCOUNT']) {
      bCtx.fillStyle = 'rgba(192,57,43,0.12)';
      var bankY = pad + (1) * (barH + gap);  // BANK is index 1
      var acctY = pad + (2) * (barH + gap);  // ACCOUNT is index 2
      bCtx.fillRect(pad - 2, bankY - 2, BW - pad + 2, barH + gap + barH + 4);
      bCtx.strokeStyle = '#c0392b'; bCtx.lineWidth = 1.5;
      bCtx.strokeRect(pad - 2, bankY - 2, BW - pad + 2, barH + gap + barH + 4);
      bCtx.fillStyle = '#c0392b'; bCtx.font = 'bold 10px Georgia';
      bCtx.fillText('⚠ double-counting', BW - 115, bankY + barH);
    }
  }

  function updateResultLabels(scores) {
    var discResult = document.getElementById('spam-disc-result');
    var genResult  = document.getElementById('spam-gen-result');

    if (discResult) {
      var pct = Math.round(scores.disc * 100);
      discResult.innerHTML = scores.words.length === 0
        ? '<span style="color:#aaa">Add words to classify</span>'
        : '<strong style="color:' + (scores.disc > 0.5 ? '#c0392b' : '#4a90d9') + '">' + pct + '% spam</strong>';
    }
    if (genResult) {
      var pctG = Math.round(scores.gen * 100);
      var warn  = scores.words.includes && scores.words.includes('BANK') && scores.words.includes('ACCOUNT');
      if (!warn && activeWords['BANK'] && activeWords['ACCOUNT']) warn = true;
      genResult.innerHTML = scores.words.length === 0
        ? '<span style="color:#aaa">Add words to classify</span>'
        : '<strong style="color:' + (scores.gen > 0.5 ? '#c0392b' : '#4a90d9') + '">' + pctG + '% spam</strong>'
          + (warn ? ' <span style="color:#c0392b;font-size:.85em">(overconfident: double-counting)</span>' : '');
    }
  }

  function update() {
    var scores = computeScores();
    drawScatter(scores.disc, scores.words);
    drawBars(scores.gen, scores.words);
    updateResultLabels(scores);
  }

  update();
}


/* ══════════════════════════════════════════════════════════════
   DEMO 5 — NORMALIZING FLOW SHADER (WebGL2)
══════════════════════════════════════════════════════════════ */
function initFlowDemo() {
  var canvas = document.getElementById('flow-canvas');
  if (!canvas) return;

  var gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) {
    canvas.parentElement.innerHTML = '<p style="text-align:center;color:#888;font-size:.85em;padding:2rem;">WebGL not supported in this browser.</p>';
    return;
  }

  var vsSource = [
    '#version 100',
    'attribute vec2 a_position;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var fsSource = [
    '#version 100',
    'precision highp float;',
    'uniform vec2  u_resolution;',
    'uniform float u_strength;',
    'uniform int   u_steps;',

    'float gaussian(vec2 p) {',
    '  float r2 = dot(p, p);',
    '  return exp(-r2 * 1.8);',
    '}',

    'vec3 colormap(float t) {',
    '  t = clamp(t, 0.0, 1.0);',
    '  vec3 dark  = vec3(0.05, 0.08, 0.25);',
    '  vec3 teal  = vec3(0.10, 0.55, 0.65);',
    '  vec3 white = vec3(0.98, 0.97, 0.95);',
    '  if (t < 0.5) return mix(dark, teal, t * 2.0);',
    '  return mix(teal, white, (t - 0.5) * 2.0);',
    '}',

    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution;',
    '  vec2 p  = (uv - 0.5) * 4.0;',

    '  // Inverse flow: trace back to z-space',
    '  float s = u_strength * 0.4;',
    '  for (int i = 0; i < 4; i++) {',
    '    if (i >= u_steps) break;',
    '    p.x = p.x - s * sin(p.y + float(i) * 0.4);',
    '    p.y = p.y - s * sin(p.x + float(i) * 0.4);',
    '  }',

    '  float density = gaussian(p);',

    '  // Grid overlay',
    '  vec2 gridUV = (gl_FragCoord.xy / u_resolution) * 10.0;',
    '  float gx = abs(fract(gridUV.x) - 0.5);',
    '  float gy = abs(fract(gridUV.y) - 0.5);',
    '  float grid = 1.0 - smoothstep(0.0, 0.04, min(gx, gy));',

    '  vec3 col = colormap(density);',
    '  col = mix(col, col * 0.65 + vec3(0.35), grid * 0.25);',

    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compileShader(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  var vs = compileShader(gl.VERTEX_SHADER,   vsSource);
  var fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  // Full-screen quad
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes      = gl.getUniformLocation(prog, 'u_resolution');
  var uStrength = gl.getUniformLocation(prog, 'u_strength');
  var uSteps    = gl.getUniformLocation(prog, 'u_steps');

  var strengthSlider = document.getElementById('flow-strength');
  var strengthVal    = document.getElementById('flow-strength-val');
  var stepsSlider    = document.getElementById('flow-steps');
  var stepsVal       = document.getElementById('flow-steps-val');

  var strength = 0;
  var steps    = 1;

  function draw() {
    var W = canvas.width, H = canvas.height;
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uStrength, strength);
    gl.uniform1i(uSteps, steps);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  if (strengthSlider) {
    strengthSlider.addEventListener('input', function() {
      strength = +this.value / 100;
      if (strengthVal) strengthVal.textContent = strength.toFixed(2);
      draw();
    });
  }
  if (stepsSlider) {
    stepsSlider.addEventListener('input', function() {
      steps = +this.value;
      if (stepsVal) stepsVal.textContent = steps;
      draw();
    });
  }

  draw();
}


/* ══════════════════════════════════════════════════════════════
   INIT ALL DEMOS
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  initDimDemo();
  initLandscapeDemo();
  initGraphDemo();
  initSpamDemo();
  initFlowDemo();
});

})();
