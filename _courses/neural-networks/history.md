---
layout: post-distill
title: "The Birth of Neural Networks"
subtitle: "From the mind–body problem to backpropagation — a history in seven moves"
course: ml
date: 2019-03-23
author: Piyush Ahuja
comments: false
---

> **Central idea:** mental phenomena can be described by interconnected networks of simple and often uniform units — neurons connected by synapses, as in the brain.

---

## The Problem That Started Everything

Before there were neural networks, there was a scandal: **the mind existed, and nobody could explain it.**

For centuries, the dominant view was **dualism** — mind and body are made of different stuff. Descartes put the soul in the pineal gland and moved on. Nobody had a better answer.

Then three separate fields converged on the same problem from different directions:

- **The Biologist's piece:** Cajal established the brain was discrete individual cells — neurons — each separated by a tiny gap (the synapse). But how does a series of electrical sparks become a thought?
- **The Logician's piece:** Whitehead and Russell proved all mathematics could be built from three logical primitives: **AND, OR, NOT**.
- **The Collision:** Walter Pitts saw what nobody had connected: *if logic can represent mathematics, and neurons can represent logic — then neurons can represent everything.* The mind wasn't separate from the body — it was the body's wiring diagram.

This was the generative insight. Everything else is a consequence.

---

## 1943 — McCulloch & Pitts: The Brain as Logic Machine

Warren McCulloch and Walter Pitts formalized the collision in "A Logical Calculus of Ideas Immanent in Nervous Activity."

Their core claim: **a neuron "realizes" a logical sentence if its firing pattern (On/Off) matches the True/False values of that sentence.**

### The Idealization — and Why It Was the Right Trade

Real neurons are messy: they fire in graded potentials, variable thresholds, continuous time, chemical soup. McCulloch and Pitts made a deliberate sacrifice: strip the neuron to a **binary abstraction**. Fire or don't fire. One or zero.

*Why was this the right trade?* Binary firing = Boolean algebra. And Boolean algebra can express any finite logical statement. What you lose: biological realism. What you gain: mathematical power.<span class="sidenote">Boole published <em>Laws of Thought</em> in 1854. Russell and Whitehead built on it directly.</span>

### The Idealized Neuron

<figure class="d-figure">
<svg width="480" height="160" viewBox="0 0 480 160" style="display:block;margin:0 auto;">
  <line x1="30" y1="55"  x2="162" y2="78"  stroke="#888" stroke-width="1.5"/>
  <line x1="30" y1="80"  x2="162" y2="80"  stroke="#888" stroke-width="1.5"/>
  <line x1="30" y1="105" x2="162" y2="82"  stroke="#888" stroke-width="1.5"/>
  <line x1="30" y1="130" x2="162" y2="94"  stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <circle cx="30" cy="55"  r="14" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="30" cy="80"  r="14" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="30" cy="105" r="14" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="30" cy="130" r="14" fill="#fdecea" stroke="#c0392b" stroke-width="1.5"/>
  <text x="30" y="55"  text-anchor="middle" dominant-baseline="middle" font-size="11">x₁</text>
  <text x="30" y="80"  text-anchor="middle" dominant-baseline="middle" font-size="11">x₂</text>
  <text x="30" y="105" text-anchor="middle" dominant-baseline="middle" font-size="11">x₃</text>
  <text x="30" y="130" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#c0392b">inh</text>
  <text x="84" y="60"  font-size="10" fill="#555">w₁</text>
  <text x="84" y="79"  font-size="10" fill="#555">w₂</text>
  <text x="84" y="97"  font-size="10" fill="#555">w₃</text>
  <text x="84" y="114" font-size="10" fill="#c0392b">−</text>
  <circle cx="200" cy="80" r="36" fill="#e8f0fb" stroke="#4a90d9" stroke-width="2"/>
  <text x="200" y="75" text-anchor="middle" font-size="11" fill="#333">Σ ≥ θ</text>
  <text x="200" y="90" text-anchor="middle" font-size="10" fill="#777">(threshold)</text>
  <line x1="236" y1="80" x2="340" y2="80" stroke="#888" stroke-width="1.5"/>
  <polygon points="340,75 352,80 340,85" fill="#888"/>
  <circle cx="382" cy="80" r="24" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
  <text x="382" y="80" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#27ae60">0 / 1</text>
  <text x="244" y="68" font-size="10" fill="#555">fires if</text>
  <text x="244" y="80" font-size="10" fill="#555">Σ ≥ θ and</text>
  <text x="244" y="92" font-size="10" fill="#555">not inhibited</text>
</svg>
<figcaption>The McCulloch–Pitts neuron. Excitatory inputs (blue) sum up; if the total meets threshold θ and no inhibitory input (red dashed) is active, the neuron outputs 1.</figcaption>
</figure>

### Building Logic from Neurons

<div class="gate-row">
<div class="gate-box">
<svg width="165" height="115">
  <line x1="22" y1="42" x2="78" y2="56" stroke="#888" stroke-width="1.5"/>
  <line x1="22" y1="72" x2="78" y2="56" stroke="#888" stroke-width="1.5"/>
  <circle cx="22" cy="42" r="13" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="22" cy="72" r="13" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <text x="22" y="42" text-anchor="middle" dominant-baseline="middle" font-size="11">A</text>
  <text x="22" y="72" text-anchor="middle" dominant-baseline="middle" font-size="11">B</text>
  <circle cx="102" cy="56" r="28" fill="#e8f0fb" stroke="#4a90d9" stroke-width="2"/>
  <text x="102" y="52" text-anchor="middle" font-size="11">θ = 1</text>
  <text x="102" y="65" text-anchor="middle" font-size="9" fill="#777">any fires</text>
  <line x1="130" y1="56" x2="152" y2="56" stroke="#888" stroke-width="1.5"/>
  <polygon points="152,51 160,56 152,61" fill="#888"/>
</svg>
<div class="gate-label"><strong>OR</strong> — threshold = 1<br>fires if A or B fires</div>
</div>
<div class="gate-box">
<svg width="165" height="115">
  <line x1="22" y1="42" x2="78" y2="56" stroke="#888" stroke-width="1.5"/>
  <line x1="22" y1="72" x2="78" y2="56" stroke="#888" stroke-width="1.5"/>
  <circle cx="22" cy="42" r="13" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="22" cy="72" r="13" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <text x="22" y="42" text-anchor="middle" dominant-baseline="middle" font-size="11">A</text>
  <text x="22" y="72" text-anchor="middle" dominant-baseline="middle" font-size="11">B</text>
  <circle cx="102" cy="56" r="28" fill="#e8f0fb" stroke="#4a90d9" stroke-width="2"/>
  <text x="102" y="52" text-anchor="middle" font-size="11">θ = 2</text>
  <text x="102" y="65" text-anchor="middle" font-size="9" fill="#777">both fire</text>
  <line x1="130" y1="56" x2="152" y2="56" stroke="#888" stroke-width="1.5"/>
  <polygon points="152,51 160,56 152,61" fill="#888"/>
</svg>
<div class="gate-label"><strong>AND</strong> — threshold = 2<br>fires only if both fire</div>
</div>
<div class="gate-box">
<svg width="165" height="115">
  <line x1="22" y1="56" x2="74" y2="56" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <circle cx="22" cy="56" r="13" fill="#fdecea" stroke="#c0392b" stroke-width="1.5"/>
  <text x="22" y="56" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#c0392b">A</text>
  <circle cx="102" cy="56" r="28" fill="#fdecea" stroke="#c0392b" stroke-width="2"/>
  <text x="102" y="52" text-anchor="middle" font-size="11">inhibit</text>
  <text x="102" y="65" text-anchor="middle" font-size="9" fill="#c0392b">silences</text>
  <line x1="130" y1="56" x2="152" y2="56" stroke="#888" stroke-width="1.5"/>
  <polygon points="152,51 160,56 152,61" fill="#888"/>
</svg>
<div class="gate-label"><strong>NOT</strong> — inhibitory input<br>fires only when A is off</div>
</div>
</div>

Since AND + OR + NOT can express any logical statement, a network of neurons can calculate **anything a Turing machine can calculate**. The geometry of connections *is* the software.

### What M-P Left Unexplored

The connections were **fixed** — hand-wired by the designer. There was no learning. The open question: *Can the connections be learned from experience?*

---

## 1949 — Hebb: The First Learning Rule

Donald Hebb's 1949 book proposed a simple principle:

> **"Neurons that fire together, wire together."**

Formally: $\Delta w_{ij} \propto x_i \cdot x_j$

<figure class="d-figure">
<svg width="400" height="120" viewBox="0 0 400 120" style="display:block;margin:0 auto;">
  <circle cx="80"  cy="58" r="22" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <circle cx="180" cy="58" r="22" fill="#e8f0fb" stroke="#4a90d9" stroke-width="1.5"/>
  <line x1="102" y1="58" x2="158" y2="58" stroke="#ccc" stroke-width="3"/>
  <text x="130" y="48" font-size="9" fill="#aaa" text-anchor="middle">weak</text>
  <text x="80"  y="58" text-anchor="middle" dominant-baseline="middle" font-size="12">A</text>
  <text x="180" y="58" text-anchor="middle" dominant-baseline="middle" font-size="12">B</text>
  <text x="130" y="100" text-anchor="middle" font-size="10" fill="#999">Before co-activation</text>

  <text x="228" y="63" font-size="22" fill="#4a90d9">→</text>

  <circle cx="290" cy="58" r="22" fill="#d4e8ff" stroke="#4a90d9" stroke-width="2"/>
  <circle cx="382" cy="58" r="22" fill="#d4e8ff" stroke="#4a90d9" stroke-width="2"/>
  <line x1="312" y1="58" x2="360" y2="58" stroke="#4a90d9" stroke-width="4.5"/>
  <text x="336" y="48" font-size="9" fill="#4a90d9" text-anchor="middle">strong</text>
  <text x="290" y="58" text-anchor="middle" dominant-baseline="middle" font-size="12">A</text>
  <text x="382" y="58" text-anchor="middle" dominant-baseline="middle" font-size="12">B</text>
  <text x="336" y="100" text-anchor="middle" font-size="10" fill="#4a90d9">After co-activation</text>
</svg>
<figcaption>Hebbian learning: the synapse from A to B strengthens when both fire simultaneously.</figcaption>
</figure>

**The crack in the foundation:** Hebb's rule has no error signal. It adjusts based on *what fires together*, not *whether the network was right*. It can build associations but cannot correct itself. For correction, you need a signal from the outside world saying *you were wrong.* That gap is what Rosenblatt would fill nine years later.

---

## 1958 — Rosenblatt: The Perceptron Learns

Rosenblatt's perceptron introduced one revolutionary addition: **variable weights** that update based on mistakes.

### The Geometry of a Weight

Each input is a dimension. Two inputs → each training example is a point in 2D space. The weight vector defines a **line** — a knife cutting space in two.

**Learning = rotating that knife until it correctly separates all the data.**

The bias term $b$ lets the boundary slide freely (not forced through the origin). The full computation: $w \cdot x + b \geq 0$.

<figure class="d-figure">
<canvas id="perc-canvas" class="boundary-canvas" width="360" height="280"></canvas>
<div class="slider-row" style="max-width:360px;margin:.5rem auto 0;">
  <label style="min-width:72px">Epoch:</label>
  <input type="range" id="epoch-slider" min="0" max="30" value="0" style="flex:1;">
  <span class="slider-val" id="epoch-val">0</span>
</div>
<div class="btn-row">
  <button class="nn-btn" id="btn-animate">▶ Animate</button>
  <button class="nn-btn" id="btn-reset">Reset</button>
</div>
<figcaption>Drag the slider or press Animate to watch the decision boundary converge. Blue = class 1, red = class 0.</figcaption>
</figure>

The Perceptron Learning Rule:

$$w_{i}^{\text{new}} = w_{i}^{\text{old}} + \alpha\,(y - \hat{y})\,x_i \qquad b^{\text{new}} = b^{\text{old}} + \alpha\,(y - \hat{y})$$

When right, $(y-\hat{y})=0$ and nothing changes. When wrong, weights shift toward the correct orientation.

### The Convergence Theorem

Rosenblatt proved: if a solution exists, the rule will find it in finite steps.

Two forces compete per mistake:
1. **Alignment grows linearly** — $W \cdot W^*$ increases by a fixed amount each mistake.
2. **Size grows slower** — $|W| \sim \sqrt{\text{mistakes}}$.

The cosine $\frac{W \cdot W^*}{|W||W^*|}$ must eventually reach 1. The knife is **guaranteed** to converge.<span class="sidenote">The proof uses the Cauchy-Schwarz inequality. The key insight is that alignment and magnitude grow at different rates.</span>

### What Rosenblatt Left Unexplored

**The linearity constraint.** The knife can only be a straight line. What if the data can't be separated by any straight line? The perceptron can't even represent the solution, let alone find it.

---

## 1969 — Minsky & Papert: The Crisis

Minsky and Papert proved formally:

**A single-layer perceptron can only solve linearly separable problems.**

The diagnostic case is **XOR**: output 1 when inputs differ, 0 when they match.

<figure class="d-figure">
<div style="display:flex;gap:2rem;align-items:flex-start;justify-content:center;flex-wrap:wrap;">
<div>
<p style="font-size:.85rem;color:#555;margin-bottom:.4rem;">The four XOR cases:</p>
<table style="width:auto;font-size:.9rem;">
<thead><tr><th>x₁</th><th>x₂</th><th>output</th></tr></thead>
<tbody>
<tr><td>0</td><td>0</td><td><strong>0</strong></td></tr>
<tr><td>0</td><td>1</td><td style="color:#4a90d9"><strong>1</strong></td></tr>
<tr><td>1</td><td>0</td><td style="color:#4a90d9"><strong>1</strong></td></tr>
<tr><td>1</td><td>1</td><td><strong>0</strong></td></tr>
</tbody>
</table>
</div>
<svg width="200" height="200" viewBox="0 0 200 200">
  <line x1="30" y1="170" x2="185" y2="170" stroke="#ccc" stroke-width="1"/>
  <line x1="30" y1="170" x2="30"  y2="15"  stroke="#ccc" stroke-width="1"/>
  <text x="188" y="173" font-size="10" fill="#aaa">x₁</text>
  <text x="25"  y="13"  font-size="10" fill="#aaa">x₂</text>
  <circle cx="60"  cy="140" r="11" fill="#e9e9e9" stroke="#aaa" stroke-width="1.5"/>
  <circle cx="155" cy="50"  r="11" fill="#e9e9e9" stroke="#aaa" stroke-width="1.5"/>
  <circle cx="60"  cy="50"  r="11" fill="#4a90d9" stroke="#2a6cb0" stroke-width="1.5"/>
  <circle cx="155" cy="140" r="11" fill="#4a90d9" stroke="#2a6cb0" stroke-width="1.5"/>
  <text x="60"  y="140" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="#666">(0,0)</text>
  <text x="60"  y="50"  text-anchor="middle" dominant-baseline="middle" font-size="9" fill="#fff">(0,1)</text>
  <text x="155" y="140" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="#fff">(1,0)</text>
  <text x="155" y="50"  text-anchor="middle" dominant-baseline="middle" font-size="9" fill="#666">(1,1)</text>
  <line x1="30" y1="170" x2="185" y2="15" stroke="#c0392b" stroke-width="1.2" stroke-dasharray="6,3" opacity=".5"/>
  <line x1="30" y1="15"  x2="185" y2="170" stroke="#c0392b" stroke-width="1.2" stroke-dasharray="6,3" opacity=".5"/>
  <text x="100" y="192" text-anchor="middle" font-size="10" fill="#c0392b">No line separates ● from ○</text>
</svg>
</div>
<figcaption>The two 1s sit at diagonally opposite corners. No straight line can separate blue from grey — not hard, <em>geometrically impossible</em>. This killed funding. The AI Winter began.</figcaption>
</figure>

The crucial distinction, easy to miss:
- **M-P proved:** you *can* build XOR with a hand-wired multi-layer circuit.
- **Minsky & Papert proved:** a single-layer network *cannot learn* the weights for XOR.

Multi-layer networks could **represent** anything — but nobody knew how to **train** them. The hidden layers had no learning rule. *How do you propagate an error signal backward through multiple layers to assign blame to hidden weights?* This is the **credit assignment problem**.

---

## The Hidden Layer Insight

The solution was geometrically obvious once seen: **if one layer can only draw straight lines, multiple layers can warp the space itself** before drawing the final line.

<figure class="d-figure">
<canvas id="xor-transform-canvas" width="460" height="200" style="display:block;margin:0 auto;"></canvas>
<figcaption>Left: XOR is not linearly separable in input space. Right: after a hidden layer transforms the space, the same four points <em>are</em> linearly separable. Learning = finding that transformation.</figcaption>
</figure>

Each layer learns a new *representation* of the data, progressively transforming it until the final layer's job is easy. This is what "deep learning" actually means — not just many layers, but many successive representations.

---

## The Three Breakthroughs of the 1980s

### A. Backpropagation — The Chain Rule as Credit Assignment

Training is finding the lowest valley in a loss landscape. **Gradient descent** says: measure the local slope, take a small step downhill, repeat.

The chain rule from calculus decomposes the gradient layer by layer:

$$\frac{\partial L}{\partial w} = \frac{\partial L}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial h} \cdot \frac{\partial h}{\partial w}$$

Each term is a local derivative — easy to compute at each layer. The **backward pass** multiplies them together. The error "flows backward," assigning a proportional share of blame to every weight.

This wasn't a trick. Given the compositional structure of a neural network, the chain rule is the only tool that decomposes the gradient correctly.

<figure class="d-figure">
<div id="gd-viz"></div>
<div class="slider-row" style="margin-top:.75rem;">
  <span style="font-size:.82rem;font-family:sans-serif;width:7rem;">Learning rate α</span>
  <input type="range" id="gd-lr" min="1" max="100" value="20" step="1">
  <span class="slider-val" id="gd-lr-val">0.20</span>
</div>
<div class="slider-row">
  <span style="font-size:.82rem;font-family:sans-serif;width:7rem;">Momentum β</span>
  <input type="range" id="gd-mom" min="0" max="98" value="0" step="1">
  <span class="slider-val" id="gd-mom-val">0.00</span>
</div>
<figcaption><strong>Gradient descent on a loss surface.</strong> Drag the sliders to change learning rate and momentum and watch how the trajectory to the minimum changes. High learning rate → overshooting. Momentum → faster convergence.</figcaption>
</figure>

### B. Non-Linear Activation Functions

If you stack linear layers: $W_2(W_1 x) = (W_2 W_1)x$ — still one big matrix. No matter how many layers, you're still cutting space with a straight line.

Non-linearity introduces "kinks" that allow the network to learn curves and complex boundaries:

<figure class="d-figure">
<canvas id="act-canvas" width="460" height="180" style="display:block;margin:0 auto;"></canvas>
<div class="btn-row" style="margin-top:.4rem;">
  <button class="nn-btn" id="btn-sigmoid">Sigmoid</button>
  <button class="nn-btn" id="btn-relu">ReLU</button>
  <button class="nn-btn" id="btn-tanh">Tanh</button>
</div>
<figcaption>Three activation functions (solid) with their derivatives (dashed). The derivative tells you how gradient signal flows backward. Click to switch.</figcaption>
</figure>

### C. The Vanishing Gradient — Why the 25-Year Gap

Sigmoid's derivative peaks at **0.25**. Chain-multiply through 10 layers:

$$0.25^{10} \approx 10^{-6}$$

Early layers receive nearly zero gradient — they don't learn. Deep networks were theoretically expressive but practically untrainable.<span class="sidenote">Hochreiter identified the vanishing gradient problem in his 1991 diploma thesis, years before the fixes arrived.</span>

| Problem | Fix | Mechanism |
|---|---|---|
| Shrinking gradients | **ReLU** | Derivative = 1 for positive inputs — no compounding decay |
| Unhealthy activations | **Batch Normalization** | Re-centers and rescales at each layer |
| Deep gradient death | **Residual connections** | Skip-connections route gradients directly to earlier layers |

---

## Universal Approximation

**A neural network with one hidden layer and enough neurons, using a non-linear activation, can approximate any continuous function to arbitrary precision.**<span class="sidenote">Proved independently by Cybenko (1989) for sigmoid activations and Hornik (1991) for general activations.</span>

The representational question is settled. But notice what this does *not* guarantee:

- How *big* the network needs to be
- That you can *learn* the right weights (only that they exist)
- That the network will *generalize* to new data

These three gaps — efficiency, learnability, generalization — are what the entire subsequent history of ML is working to close.

---

## History as a Tree of Open Questions

<div class="timeline">
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1943</div>
    <div class="tl-title">McCulloch &amp; Pitts</div>
    <div class="tl-body">Neurons can represent logic. <em>Left open:</em> connections must be hand-wired — can they be learned?</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1949</div>
    <div class="tl-title">Hebb</div>
    <div class="tl-body">Connections strengthen through co-activation. <em>Left open:</em> no error signal — can't do supervised correction.</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1958</div>
    <div class="tl-title">Rosenblatt</div>
    <div class="tl-body">Single-layer networks learn from mistakes. <em>Left open:</em> only linearly separable data; can't train hidden layers.</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1969</div>
    <div class="tl-title">Minsky &amp; Papert</div>
    <div class="tl-body">Precisely bounded single-layer expressiveness. <em>Left open:</em> multi-layer training unsolved. AI Winter begins.</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1986</div>
    <div class="tl-title">Rumelhart, Hinton &amp; Williams</div>
    <div class="tl-body">Backprop solves multi-layer training. <em>Left open:</em> vanishing gradients block deep networks.</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">1989–98</div>
    <div class="tl-title">LeCun — CNNs</div>
    <div class="tl-body">Weight sharing + spatial filters for vision. <em>Left open:</em> still limited by compute and data.</div>
  </div>
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">2012</div>
    <div class="tl-title">AlexNet / GPU Revolution</div>
    <div class="tl-body">Scale unlocks everything. <em>Left open:</em> why do deeper networks generalize? (still open)</div>
  </div>
</div>

Each "left open" is where the next decade's work came from.

---

## The Why-Regress

*Why do neural networks work?* → Universal Approximation: they can represent any function.

*Why can they represent any function?* → Non-linearity lets them warp space; depth lets them compose transformations.

*Why does warping space help?* → Any classification is a geometry question. Transform the space until the classes are linearly separable, then a single cut solves it.

*Why is linear separability the right primitive?* → Because it's what a single threshold unit can compute. The whole architecture is built to make the final cut easy.

*Why does data have structure a network can exploit?* → **The world has regularities.** Without regularity, no learning algorithm works. Neural networks are machines for extracting and encoding that structure.

---

<script src="/js/nn-history.js"></script>
<script src="/js/gd-viz.js"></script>
