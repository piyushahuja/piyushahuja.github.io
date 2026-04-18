(function () {

/* ══════════════════════════════════════════════
   PERCEPTRON BOUNDARY DEMO
══════════════════════════════════════════════ */
var pCanvas = document.getElementById('perc-canvas');
var pCtx    = pCanvas.getContext('2d');

var pts = [
  {x:.14,y:.22,c:0},{x:.22,y:.52,c:0},{x:.28,y:.14,c:0},
  {x:.34,y:.42,c:0},{x:.10,y:.68,c:0},{x:.18,y:.38,c:0},
  {x:.60,y:.62,c:1},{x:.72,y:.78,c:1},{x:.82,y:.52,c:1},
  {x:.90,y:.70,c:1},{x:.64,y:.36,c:1},{x:.76,y:.88,c:1}
];

function trainPerceptron(epochs) {
  var w = [0,0], b = 0;
  var history = [{w:w.slice(),b:b}];
  for (var e=0; e<epochs; e++) {
    for (var i=0; i<pts.length; i++) {
      var p = pts[i];
      var pred = (w[0]*p.x + w[1]*p.y + b >= 0) ? 1 : 0;
      var err  = p.c - pred;
      w[0] += 0.18*err*p.x;
      w[1] += 0.18*err*p.y;
      b    += 0.18*err;
    }
    history.push({w:w.slice(),b:b});
  }
  return history;
}
var history = trainPerceptron(30);

function drawPerceptron(epochIdx) {
  var W = pCanvas.width, H = pCanvas.height;
  pCtx.clearRect(0,0,W,H);
  var state = history[epochIdx];
  var w = state.w, b = state.b;

  // Tinted background
  var img = pCtx.createImageData(W,H);
  for (var px=0; px<W; px++) {
    for (var py=0; py<H; py++) {
      var nx = px/W, ny = py/H;
      var v  = w[0]*nx + w[1]*ny + b;
      var idx = (py*W+px)*4;
      if (v>=0) { img.data[idx]=74;  img.data[idx+1]=144; img.data[idx+2]=217; img.data[idx+3]=30; }
      else      { img.data[idx]=230; img.data[idx+1]=100; img.data[idx+2]=90;  img.data[idx+3]=30; }
    }
  }
  pCtx.putImageData(img,0,0);

  // Decision boundary
  pCtx.beginPath(); pCtx.strokeStyle='#333'; pCtx.lineWidth=2;
  if (Math.abs(w[1]) > 0.001) {
    var y0 = -(w[0]*0 + b)/w[1];
    var y1 = -(w[0]*1 + b)/w[1];
    pCtx.moveTo(0, y0*H); pCtx.lineTo(W, y1*H);
  } else if (Math.abs(w[0]) > 0.001) {
    var x0 = -b/w[0];
    pCtx.moveTo(x0*W,0); pCtx.lineTo(x0*W,H);
  }
  pCtx.stroke();

  // Points
  for (var j=0; j<pts.length; j++) {
    var p = pts[j];
    pCtx.beginPath();
    pCtx.arc(p.x*W, p.y*H, 8, 0, Math.PI*2);
    pCtx.fillStyle   = p.c===1 ? '#4a90d9' : '#e8604a';
    pCtx.strokeStyle = '#fff'; pCtx.lineWidth=2;
    pCtx.fill(); pCtx.stroke();
  }

  // Epoch label
  pCtx.fillStyle='#333'; pCtx.font='13px Georgia';
  pCtx.fillText('Epoch ' + epochIdx, 10, 20);
}

var epochSlider = document.getElementById('epoch-slider');
var epochVal    = document.getElementById('epoch-val');
epochSlider.addEventListener('input', function() {
  epochVal.textContent = this.value;
  drawPerceptron(+this.value);
});

var animTimer = null;
document.getElementById('btn-animate').addEventListener('click', function() {
  var btn = this;
  if (animTimer) { clearInterval(animTimer); animTimer=null; btn.textContent='▶ Animate'; return; }
  btn.textContent='⏸ Pause';
  var e = +epochSlider.value;
  animTimer = setInterval(function() {
    e = (e+1) % 31;
    epochSlider.value = e; epochVal.textContent = e;
    drawPerceptron(e);
    if (e===30) { clearInterval(animTimer); animTimer=null; btn.textContent='▶ Animate'; }
  }, 300);
});
document.getElementById('btn-reset').addEventListener('click', function() {
  if (animTimer) { clearInterval(animTimer); animTimer=null; document.getElementById('btn-animate').textContent='▶ Animate'; }
  epochSlider.value=0; epochVal.textContent='0'; drawPerceptron(0);
});
drawPerceptron(0);


/* ══════════════════════════════════════════════
   XOR SPACE TRANSFORMATION
══════════════════════════════════════════════ */
var xCanvas = document.getElementById('xor-canvas');
var xCtx    = xCanvas.getContext('2d');

function drawXorTransform() {
  var XW = xCanvas.width, XH = xCanvas.height;
  xCtx.clearRect(0,0,XW,XH);
  var pad = 28, half = XW/2;

  xCtx.fillStyle='#888'; xCtx.font='11px Georgia';
  xCtx.fillText('Input space — not linearly separable', pad, 16);
  xCtx.fillText('Hidden-layer space — separable', half+pad, 16);

  xCtx.beginPath(); xCtx.strokeStyle='#ddd'; xCtx.lineWidth=1;
  xCtx.moveTo(half,0); xCtx.lineTo(half,XH); xCtx.stroke();

  // Points: label 0 = grey, label 1 = blue
  var xorPts = [
    {ix:0.12,iy:0.12,label:0},
    {ix:0.12,iy:0.78,label:1},
    {ix:0.78,iy:0.12,label:1},
    {ix:0.78,iy:0.78,label:0}
  ];
  var tProj = [
    {nx:0.50, ny:0.72},
    {nx:0.18, ny:0.22},
    {nx:0.82, ny:0.22},
    {nx:0.54, ny:0.68}
  ];

  var innerW = half - 2*pad;
  var innerH = XH - 50;
  var topOff = 28;

  function toLeft(nx,ny)  { return {cx: pad    + nx*innerW, cy: topOff + ny*innerH}; }
  function toRight(nx,ny) { return {cx: half+pad + nx*innerW, cy: topOff + ny*innerH}; }

  // Separating line in right panel
  xCtx.beginPath(); xCtx.strokeStyle='#27ae60'; xCtx.lineWidth=2; xCtx.setLineDash([6,3]);
  var r0 = toRight(0,0.48), r1 = toRight(1,0.48);
  xCtx.moveTo(r0.cx,r0.cy); xCtx.lineTo(r1.cx,r1.cy); xCtx.stroke();
  xCtx.setLineDash([]);
  xCtx.fillStyle='#27ae60'; xCtx.font='10px Georgia';
  xCtx.fillText('linear boundary', half+pad+10, topOff + innerH*0.48 - 6);

  for (var i=0; i<4; i++) {
    var p = xorPts[i];
    var fill   = p.label===1 ? '#4a90d9' : '#e9e9e9';
    var stroke = p.label===1 ? '#2a6cb0' : '#aaa';

    var L = toLeft(p.ix, p.iy);
    xCtx.beginPath(); xCtx.arc(L.cx,L.cy,11,0,Math.PI*2);
    xCtx.fillStyle=fill; xCtx.strokeStyle=stroke; xCtx.lineWidth=2;
    xCtx.fill(); xCtx.stroke();

    var R = toRight(tProj[i].nx, tProj[i].ny);
    xCtx.beginPath(); xCtx.arc(R.cx,R.cy,11,0,Math.PI*2);
    xCtx.fillStyle=fill; xCtx.strokeStyle=stroke; xCtx.lineWidth=2;
    xCtx.fill(); xCtx.stroke();
  }
}
drawXorTransform();


/* ══════════════════════════════════════════════
   ACTIVATION FUNCTIONS
══════════════════════════════════════════════ */
var aCanvas = document.getElementById('act-canvas');
var aCtx    = aCanvas.getContext('2d');
var AW = aCanvas.width, AH = aCanvas.height;

var activations = {
  Sigmoid: function(z){ return 1/(1+Math.exp(-z)); },
  ReLU:    function(z){ return Math.max(0,z); },
  Tanh:    function(z){ return Math.tanh(z); }
};
var actColors = { Sigmoid:'#4a90d9', ReLU:'#27ae60', Tanh:'#e67e22' };

function drawActivation(name) {
  aCtx.clearRect(0,0,AW,AH);
  var pad=42, innerW=AW-2*pad, innerH=AH-2*pad;
  var ox=pad, oy=pad+innerH/2;
  var fn = activations[name];
  var col = actColors[name];

  // Grid
  aCtx.strokeStyle='#eee'; aCtx.lineWidth=1;
  for (var xi=-3; xi<=3; xi++) {
    var gx = ox + (xi+3)/6*innerW;
    aCtx.beginPath(); aCtx.moveTo(gx,pad); aCtx.lineTo(gx,pad+innerH); aCtx.stroke();
  }
  for (var yi=-1; yi<=1; yi+=0.5) {
    var gy = oy - yi*(innerH*0.45);
    aCtx.beginPath(); aCtx.moveTo(pad,gy); aCtx.lineTo(pad+innerW,gy); aCtx.stroke();
  }
  // Axes
  aCtx.strokeStyle='#bbb'; aCtx.lineWidth=1.5;
  aCtx.beginPath(); aCtx.moveTo(pad,oy); aCtx.lineTo(pad+innerW,oy); aCtx.stroke();
  aCtx.beginPath(); aCtx.moveTo(ox,pad); aCtx.lineTo(ox,pad+innerH); aCtx.stroke();
  // Labels
  aCtx.fillStyle='#aaa'; aCtx.font='11px Georgia';
  aCtx.fillText('z', pad+innerW+5, oy+4);
  aCtx.fillText('f(z)', ox+5, pad+14);
  for (var n=-3; n<=3; n+=1) {
    var lx = ox + (n+3)/6*innerW;
    if (n!==0) aCtx.fillText(n, lx-4, oy+14);
  }

  // Curve (solid)
  aCtx.beginPath(); aCtx.strokeStyle=col; aCtx.lineWidth=2.5; aCtx.setLineDash([]);
  for (var px=0; px<=innerW; px++) {
    var z  = (px/innerW)*6 - 3;
    var fz = fn(z);
    var cy = oy - fz*(innerH*0.45);
    if (px===0) aCtx.moveTo(ox+px,cy); else aCtx.lineTo(ox+px,cy);
  }
  aCtx.stroke();

  // Derivative (dashed)
  aCtx.beginPath(); aCtx.strokeStyle=col; aCtx.lineWidth=1.2; aCtx.setLineDash([4,3]);
  aCtx.globalAlpha=0.45;
  for (var px2=1; px2<=innerW-1; px2++) {
    var z2  = (px2/innerW)*6 - 3;
    var dz  = (fn(z2+0.01) - fn(z2-0.01)) / 0.02;
    var cy2 = oy - dz*(innerH*0.45);
    if (px2===1) aCtx.moveTo(ox+px2,cy2); else aCtx.lineTo(ox+px2,cy2);
  }
  aCtx.stroke();
  aCtx.setLineDash([]); aCtx.globalAlpha=1;

  // Name label
  aCtx.fillStyle=col; aCtx.font='bold 13px Georgia';
  aCtx.fillText(name, AW-85, 20);
  // Derivative label
  aCtx.fillStyle=col; aCtx.font='10px Georgia'; aCtx.globalAlpha=0.55;
  aCtx.fillText("f'(z) dashed", AW-90, AH-6);
  aCtx.globalAlpha=1;
}

document.getElementById('btn-sigmoid').addEventListener('click', function(){ drawActivation('Sigmoid'); });
document.getElementById('btn-relu').addEventListener('click',    function(){ drawActivation('ReLU');    });
document.getElementById('btn-tanh').addEventListener('click',    function(){ drawActivation('Tanh');    });
drawActivation('Sigmoid');

})();
