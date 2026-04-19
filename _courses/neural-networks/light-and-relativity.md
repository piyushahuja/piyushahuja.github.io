---
layout: post-normal
title: "Light, Refraction & Special Relativity"
date: 2024-01-01 09:00:00
tag:
course: 
excerpt: "Interactive explorations of Snell's law, refraction, and how special relativity explains magnetism."
comments: false
---

<link rel="stylesheet" href="/css/demos.css">

## Snell's Law & Refraction

When light crosses the boundary between two materials, it bends — simply because light travels at different speeds in different materials. The **index of refraction** $n$ is defined as:

$$n = \frac{c}{v}$$

where $c$ is the speed of light in vacuum and $v$ is the speed in the material. Glass has $n \approx 1.5$, meaning light travels 50% slower inside it than in air.

**Snell's law** relates the incoming angle $\theta_1$ to the outgoing angle $\theta_2$:

$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$

Both angles are measured from the **normal** — the line perpendicular to the surface. When light enters a denser medium ($n_2 > n_1$), it bends *toward* the normal. When it enters a less dense medium, it bends *away*.

Drag the incoming ray to change the angle. Adjust $n_1$ and $n_2$ with the sliders.

<!-- ── Demo 1: Snell's Law ─────────────────────────────── -->
<div class="demo-box" id="snell-box">
  <canvas id="snell-canvas" height="400"></canvas>
  <div class="demo-controls">
    <label>n₁ (top)
      <input type="range" id="n1" min="1.0" max="2.5" step="0.05" value="1.0">
      <span class="val" id="n1-val">1.00</span>
    </label>
    <label>n₂ (bottom)
      <input type="range" id="n2" min="1.0" max="2.5" step="0.05" value="1.5">
      <span class="val" id="n2-val">1.50</span>
    </label>
    <label>Angle
      <input type="range" id="angle-in" min="1" max="89" step="1" value="45">
      <span class="val" id="angle-val">45°</span>
    </label>
    <button id="snell-reset">Reset</button>
  </div>
  <div class="demo-caption">
    Drag the incoming ray or use the sliders. Set n₁ &gt; n₂ and push the angle past the critical angle to trigger total internal reflection.
  </div>
</div>

### Total Internal Reflection

When light tries to exit a denser medium at a steep enough angle, there is no valid solution to Snell's law — $n_1 \sin\theta_1 / n_2 > 1$, which has no arcsine. The light cannot escape. It is entirely reflected back.

The critical angle is:

$$\theta_c = \arcsin\!\left(\frac{n_2}{n_1}\right) \qquad \text{(only when } n_1 > n_2\text{)}$$

This is the phenomenon behind optical fibres: light bounces along the glass core indefinitely because it can never escape into the lower-index cladding.

---

## Special Relativity & Magnetism

Here is a stunning fact: **magnetism is not a separate force from electricity.** It is what electricity looks like in a moving reference frame.

The standard story: charges moving in a wire create a magnetic field, which exerts a force on an external test charge. But there is a deeper explanation requiring no magnetic field at all — only electric fields and special relativity.

<!-- ── Demo 2: Relativity & Magnetism ─────────────────── -->
<div class="frame-tabs">
  <button class="active" id="tab-lab">Lab Frame</button>
  <button id="tab-charge">Charge's Frame</button>
  <button id="tab-explain">What's happening</button>
</div>
<div class="demo-box" id="rel-box" style="border-radius: 0 0 8px 8px; border-top: none;">
  <canvas id="rel-canvas" height="320"></canvas>
  <div class="demo-controls">
    <label>Wire current
      <input type="range" id="current" min="0" max="1" step="0.01" value="0.5">
      <span class="val" id="current-val">0.50</span>
    </label>
    <label>Test charge velocity
      <input type="range" id="charge-v" min="-1" max="1" step="0.01" value="0.5">
      <span class="val" id="chargev-val">0.50</span>
    </label>
    <button class="active" id="rel-play">⏸ Pause</button>
    <button id="rel-reset">Reset</button>
  </div>
  <div class="demo-caption" id="rel-caption"></div>
</div>

### The Relativistic Explanation

In the **lab frame**: the wire has equal densities of positive ions (stationary) and electrons (moving). Net charge = 0. The test charge moves at velocity $v$ and feels a magnetic force $F = qv \times B$.

Now jump to the **charge's frame**. The test charge is stationary — a stationary charge cannot feel a magnetic force. Yet the force is real and must exist in all frames. What explains it?

**Length contraction.** In the charge's frame the ions are now moving (we boosted away from them). Moving objects are length-contracted — squished in the direction of motion — so the ions are *more densely packed* than the electrons. The wire acquires a net positive charge. This produces an **electric** field that attracts the test charge.

$$F_{\text{magnetic}}^{\text{lab}} = F_{\text{electric}}^{\text{charge's frame}}$$

Same force. Different name. Same physics. *Magnetism is relativistic electricity.*

<script src="/js/snell-demo.js"></script>
<script src="/js/relativity-demo.js"></script>
