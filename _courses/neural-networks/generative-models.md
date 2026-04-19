---
layout: post-distill
title: "Generative Models"
subtitle: "Every image you have ever seen is a single point in a space so vast it dwarfs the observable universe. A generative model is a machine for navigating that space. How do you build one?"
course: ml
date: 2026-04-19
author: Piyush Ahuja
comments: false
---

> The fundamental question of generative modelling: given that you have seen some things, what is the shape of the space of all possible things?

---

## The Basic Problem

Before we can generate anything, we need to understand what *generating* means.

Start concrete. You have a dataset of handwritten digits — 60,000 images of the number "7". Each image is 28×28 pixels, each pixel either black or white. You want to build a machine that, when asked, produces *new* digits that look like authentic 7s. Not copies of training examples. Genuinely novel members of the distribution.

This is not the same as memorizing the training set and returning one of them. That's a lookup table. What you want is a *model of the distribution* — a compressed, generalized description of what makes a 7 look like a 7, from which you can sample endlessly.

**The data-generating process.** The deep assumption underneath all of this is: there exists an unknown true distribution $p_{\text{data}}$ over, say, the space of all 28×28 images. When a human writes a 7, they are in some sense *sampling* from $p_{\text{data}}$. Your job is to approximate this distribution with a model $p_\theta$ — a parameterized family of distributions indexed by weights $\theta$.

$$p_\theta \approx p_{\text{data}}$$

This is an extraordinarily compressed statement. Unpacking it fully reveals everything you need to build:

1. **Data** — samples from $p_{\text{data}}$. This is your training set.
2. **A model family** — what distributions can your model represent? Gaussians? Bayesian networks? Neural networks?
3. **A loss / similarity measure** — how do you measure the gap between $p_\theta$ and $p_{\text{data}}$? KL divergence? Maximum likelihood? Adversarial divergences?
4. **Optimization** — how do you move $\theta$ to close that gap?

Once you have $p_\theta$, you can **sample** to generate new data, **evaluate densities** $p_\theta(x)$ for anomaly detection, and use learned representations as features for downstream tasks. The model becomes a *simulator* of the data distribution.[^datagenerating]

### What makes a model *generative*?

The word is doing a lot of work. A generative model, in the probabilistic sense, is one that models the *joint* distribution $p(X, Y)$ or, in the purely unsupervised case, $p(X)$. From the joint, you can generate by sampling. A *discriminative* model, by contrast, only models $p(Y \mid X)$ — the boundary between classes, not the distribution of the data itself. We will return to this distinction at length.

---

## The Curse of Dimensionality

Here is where every student first feels the ground give way.

Consider a single binary pixel. It takes one parameter to specify: $p(\text{pixel}=1) = q$. Two binary pixels: four possible states (00, 01, 10, 11), three free parameters. Three pixels: eight states, seven parameters. For $n$ binary pixels: $2^n$ possible configurations, $2^n - 1$ free parameters.

A 28×28 image has 784 pixels. If binary, it requires $2^{784} - 1$ parameters for the most general joint distribution. To put this in perspective: the observable universe contains roughly $10^{80}$ atoms. That is about $2^{265}$. Even reaching 784 bits — less than a 30×30 pixel image — makes the parameter count incomparably larger than anything physical in the known universe.[^curse]

**The library metaphor.** Imagine a library containing one book for every possible image. For 1 pixel, two books. For 2 pixels, four books. Every time you add a pixel, you don't add a book — you clone the entire library and double it. By pixel 30, you have cloned the library thirty times. The library isn't big. It isn't just astronomical. It exceeds any physical metaphor. The universe itself isn't big enough to hold the index.

<figure class="d-figure">
  <div id="dim-demo"></div>
  <div class="ctrl-row">
    <label>Pixels <input type="range" id="dim-slider" min="1" max="28" value="4"> <span class="ctrl-val" id="dim-val">4</span></label>
  </div>
  <figcaption>Each pixel doubles the number of possible images. Drag right to feel the explosion. The bar shows 2ⁿ relative to 2²⁸. At n≥28, the label turns red.</figcaption>
</figure>

**The chain rule doesn't save you.** One might hope that the chain rule of probability gives a tractable escape route. It does decompose the joint:

$$p(x_1, x_2, \dots, x_n) = p(x_1) \cdot p(x_2 \mid x_1) \cdot p(x_3 \mid x_1, x_2) \cdots p(x_n \mid x_1, \dots, x_{n-1})$$

This is always valid, requiring zero assumptions. But notice: the last conditional $p(x_n \mid x_1, \dots, x_{n-1})$ still conditions on all previous pixels. If you tabulate it naively, it still requires $2^{n-1}$ entries. The exponential hasn't left — it has just moved to the conditionals. We are stuck.

**The only escape: impose structure.** We cannot tabulate the full joint. We cannot tabulate the conditionals. We *must* make assumptions — restrictions on which variables can influence which — that compress the model to something tractable. These restrictions are called *inductive biases*, and choosing the right ones is the central art of generative modelling.

---

## Imposing Structure

The word "structure" in machine learning means: *deciding which connections to cut*. You start from the full joint (everything depends on everything) and snap edges until what remains is tractable. What you keep determines what your model can learn. What you remove determines how much data you need.

### Full Independence: The Baseline That Doesn't Work

The most aggressive cut: assume all pixels are independent.

$$p(x_1, \dots, x_n) = \prod_{i=1}^n p(x_i)$$

Parameter count drops from $2^n$ to $n$. A 784-pixel image needs 784 parameters, not $2^{784}$.

The cost: you've thrown away every correlation in the data. Each pixel is modelled as if it had no relationship to any other. If you sample from this model, each pixel is flipped independently. The result: white noise. TV static.<span class="sidenote">This isn't a failure of fitting — it's a failure of representation. A fully-independent model literally cannot represent "pixel A is more likely to be white when pixel B is white." The correlation is structurally absent.</span>

### Bayesian Networks: Selective Connections

A middle ground: keep some connections, cut others. A **Bayesian network** is a directed acyclic graph where each node (variable) depends only on its *parents* in the graph, not on everything:

$$p(x_1, \dots, x_n) = \prod_{i=1}^n p(x_i \mid \text{parents}(x_i))$$

If node $i$ has $k$ parents, its conditional table has $2^k$ entries — manageable if $k$ is small. The graph structure *is* the independence assumption. Nodes not connected by any path are independent.

**The autoregressive model** is the maximally complex Bayesian network you can build: each variable depends on all *previous* variables under some ordering. This makes no independence assumptions at all — it retains the full expressiveness of the chain rule. The trick is in *how* you parameterize those conditionals, which is where neural networks enter.

**The Markov model** is one of the simplest: each variable depends only on the *immediately preceding* one. Parameter count drops from exponential to linear, but the context is too short for real data — a pixel can't "see" what happened 100 pixels ago.

**Naïve Bayes** is the most aggressively independent Bayesian network: given the class label, all features are independent. Enormously useful in limited-data regimes; we will dissect its failure mode in the discriminative vs. generative section.

<figure class="d-figure">
  <div style="display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;">
    <div id="graph-demo" style="width:320px;height:320px;flex-shrink:0;"></div>
    <div id="graph-sample" style="flex:1;min-width:160px;"></div>
  </div>
  <div class="ctrl-row">
    <button class="nn-btn active" id="btn-fulljoint">Full Joint</button>
    <button class="nn-btn" id="btn-independent">Independent</button>
    <button class="nn-btn" id="btn-structured">Neural Net</button>
  </div>
  <figcaption>Structure = choosing which connections to keep. Fewer connections = stronger assumption = less data needed, lower ceiling. The sample panel shows what a draw from each model looks like.</figcaption>
</figure>

### Neural Networks: Learned Structure

The Bayesian network approach requires you to hand-specify the graph. Neural networks offer a different deal: *learn* the conditional structure from data.

Instead of a lookup table for $p(x_i \mid \text{parents}(x_i))$, you use a neural network:

$$p(x_i \mid x_1, \dots, x_{i-1}) = \sigma\bigl(h_\theta(x_1, \dots, x_{i-1})\bigr)$$

where $h_\theta$ is a neural network. This replaces an exponential-size table with a polynomial-size parameter set. The network learns which dependencies matter.

But neural networks are not free from inductive bias — they are, in fact, full of it. A **CNN** is constrained to look at local spatial patches. This is exactly the right bias for images, where edges are local. An **RNN** shares weights across time positions, encoding the assumption that the same rule applies at every timestep. A **Transformer** uses global attention with learned positional encodings. Each architecture is a different set of bets about what structure exists in the data.[^inductive]

**The fundamental trade-off:** stronger assumptions = less data needed, lower ceiling. Weaker assumptions = more data needed, higher ceiling. The art is matching assumption strength to the amount of data you have and the complexity of the true distribution.

<figure class="d-figure">
  <div id="landscape-canvas-wrapper" style="width:100%;aspect-ratio:16/9;max-height:340px;">
    <canvas id="landscape-canvas"></canvas>
  </div>
  <div class="ctrl-row">
    <button class="nn-btn" id="btn-uniform">Uniform</button>
    <button class="nn-btn" id="btn-gaussian">Single Gaussian</button>
    <button class="nn-btn" id="btn-mixture">Mixture</button>
    <label>Peaks <input type="range" id="peaks-slider" min="2" max="6" value="3"> <span class="ctrl-val" id="peaks-val">3</span></label>
  </div>
  <figcaption>p(x) as a 3D surface over a 2D input space. This is what your model must learn. Drag to orbit. A real image distribution would have thousands of sharp, narrow peaks — one for each coherent image type.</figcaption>
</figure>

---

## Discriminative vs. Generative

The two approaches to modelling $p(Y \mid X)$ reveal a deep philosophical divide.

**The setup.** You have the Enron email dataset: spam and ham, represented as binary word-occurrence vectors. Does the word "BANK" appear? "PRINCE"? "MEETING"? Each email is a high-dimensional binary vector $X$, with label $Y \in \{\text{spam, ham}\}$.

**Path 1: Discriminative.** Learn $p(Y \mid X)$ directly. Logistic regression asks: given this word vector, what's the probability of spam? It draws a boundary in the feature space and assigns probabilities based on which side you land on. It never models *what spam emails look like* — only *where the boundary is*.

**Path 2: Generative.** Model the full joint $p(X, Y) = p(Y) \cdot p(X \mid Y)$. This means learning two things:

- $p(Y)$: the *prior* — roughly 40% of email is spam
- $p(X \mid Y)$: the *likelihood* — what does spam email look like? What does ham email look like?

To classify a new email, apply Bayes' rule:

$$p(Y \mid X) = \frac{p(X \mid Y) \cdot p(Y)}{p(X)}$$

You classify by asking: which class was more likely to have *generated* this email?

### The Naïve Bayes Failure Mode

Naïve Bayes is the simplest generative classifier. It applies the full-independence assumption: *given the class, all words are independent*. Mathematically:

$$p(X \mid Y) = \prod_{i} p(X_i \mid Y)$$

This is almost always wrong. But the question is: how badly does it hurt?

For most word pairs, it doesn't matter much. But consider: your spam corpus contains the word "BANK" and the word "ACCOUNT" in near-perfect correlation — spammers write "bank account" together constantly. Naïve Bayes sees both, treats them as independent, and multiplies the evidence *twice*. An email with both "BANK" and "ACCOUNT" gets flagged with far more confidence than it deserves.

**The detective metaphor.** Imagine two witnesses to a crime. You interview the first witness — they describe the perpetrator clearly. You interview the second witness — they give an identical description. A good detective thinks: *these two are friends; they talked; their descriptions aren't independent*. One is roughly as much evidence as the other. Naïve Bayes thinks: *two independent miracles! Double the evidence!* It becomes catastrophically overconfident.

The discriminative logistic regression *doesn't assume independence*. It can observe that "BANK" and "ACCOUNT" tend to co-occur, and effectively set one coefficient to zero — one witness is redundant, count them once. It has no incentive to double-count because it's directly optimizing for the boundary, not building a full simulator of each class.[^naivebayes]

<figure class="d-figure">
  <div class="ctrl-row" style="flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem;">
    <span style="font-size:.82em;color:#666;">Click words to add to email:</span>
    <button class="word-chip" data-word="URGENT">URGENT</button>
    <button class="word-chip" data-word="BANK">BANK</button>
    <button class="word-chip" data-word="ACCOUNT">ACCOUNT</button>
    <button class="word-chip" data-word="PRINCE">PRINCE</button>
    <button class="word-chip" data-word="MEETING">MEETING</button>
    <button class="word-chip" data-word="LUNCH">LUNCH</button>
    <button class="word-chip" data-word="PROJECT">PROJECT</button>
    <button class="nn-btn" id="btn-clear-words" style="background:#888;margin-left:.5rem;">Clear</button>
  </div>
  <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
    <div style="flex:1;min-width:220px;">
      <p style="font-size:.8em;font-weight:bold;color:#555;margin:0 0 .4rem;">Discriminative (logistic regression)</p>
      <canvas id="spam-scatter" width="260" height="220"></canvas>
      <div id="spam-disc-result" style="font-size:.85em;margin-top:.4rem;"></div>
    </div>
    <div style="flex:1;min-width:220px;">
      <p style="font-size:.8em;font-weight:bold;color:#555;margin:0 0 .4rem;">Generative (Naïve Bayes)</p>
      <canvas id="spam-bars" width="260" height="220"></canvas>
      <div id="spam-gen-result" style="font-size:.85em;margin-top:.4rem;"></div>
    </div>
  </div>
  <figcaption>Add BANK and ACCOUNT together to see the double-counting effect. The discriminative model treats them as partially redundant; Naïve Bayes multiplies their evidence independently.</figcaption>
</figure>

### When Generative Models Win

The discriminative model's boundary is a knife. It's sharp, fast, and excellent at cutting — but it knows nothing about the data itself. The generative model's simulator is a full understanding of each class.

This has consequences:

- **Missing data:** if a feature is missing at test time, a generative model can marginalize over it; a discriminative model can only impute or fail.
- **New tasks:** once you have $p(X, Y)$, you can do anomaly detection, sample new emails, compute $p(Y)$ for priors — things a pure discriminative model cannot do.
- **Small data:** strong generative assumptions (like Naïve Bayes) function as a regularizer. With 10 labeled examples, Naïve Bayes can be more accurate than logistic regression.

Deep discriminative models (neural classifiers) and deep generative models (autoregressive, VAE, flow) have both become the norm. The distinction isn't "old vs. new" — it's *what question you are answering*. If you only need to classify, discriminate. If you need to understand, sample, or detect anomalies, generate.[^gendisc]

---

## Normalization by Construction

Every valid probability distribution must integrate to 1:

$$\int p_\theta(x) \, dx = 1$$

For a neural network parameterized by millions of weights, there is no reason this should hold — and ensuring it naively requires computing an integral over all possible inputs, which is the $2^n$ problem all over again.

The elegance of modern generative model families is that they achieve normalization *for free*, by construction — through architectural choices that guarantee the constraint is satisfied without ever computing the integral.

### Autoregressive Models

The chain rule gives you normalization automatically:

$$p_\theta(x_1, \dots, x_n) = \prod_{i=1}^n p_\theta(x_i \mid x_1, \dots, x_{i-1})$$

Each factor $p_\theta(x_i \mid \cdot)$ is a valid conditional distribution (output of a softmax or sigmoid — normalized by construction). A product of normalized distributions is normalized.[^ar]

The gallon of water: pour it into the first cup. Whatever remains goes to the second cup, conditioned on what went to the first. Continue. No water is created or destroyed. You've sliced the probability mass into an ordered sequence of conditional slices that reassemble perfectly to the original unit.

### Latent Variable Models

Introduce a hidden variable $z$ drawn from a simple prior $p(z)$ (e.g., a standard Gaussian):

$$p_\theta(x) = \int p_\theta(x \mid z) \, p(z) \, dz$$

If $p(z)$ is normalized and $p_\theta(x \mid z)$ is a normalized conditional for every $z$, then the marginal $p_\theta(x)$ is normalized:

$$\int p_\theta(x) \, dx = \int \left(\int p_\theta(x \mid z) \, p(z) \, dz\right) dx = \int p(z) \underbrace{\left(\int p_\theta(x \mid z) \, dx\right)}_{=1} dz = 1$$

The analogy: several 1-gallon buckets weighted by the prior. Each bucket's decoder pours exactly 1 gallon into $x$-space. The weighted average of multiple 1-gallon pours is still exactly 1 gallon.<span class="sidenote">The trick in VAEs: this integral is intractable to compute exactly (you can't enumerate all $z$). Normalization is guaranteed, but computing $p_\theta(x)$ for a specific $x$ requires approximating the integral, which is what the encoder + ELBO framework does.</span>

### Normalizing Flows

A flow starts with a simple distribution $z \sim p_z(z)$ (Gaussian) and applies a learned invertible transformation $f_\theta$:

$$x = f_\theta(z), \quad z = f_\theta^{-1}(x)$$

The change-of-variables formula gives the density in $x$-space:

$$p_\theta(x) = p_z(f_\theta^{-1}(x)) \cdot \left|\det J_{f_\theta^{-1}}(x)\right|$$

Normalization is guaranteed because the Jacobian factor exactly accounts for how the transformation stretches or compresses space. If the transformation doubles the volume in some region, the density is halved — probability mass is conserved.

The physical metaphor: take a block of wet clay (the Gaussian). Twist, stretch, and squash it into a complex sculpture. The clay doesn't gain or lose volume — it is merely redistributed. The shape is wild, but the total mass is exactly what you started with.[^flows]

<figure class="d-figure">
  <canvas id="flow-canvas" width="400" height="400" style="display:block;margin:0 auto;max-width:100%;image-rendering:pixelated;"></canvas>
  <div class="ctrl-row" style="margin-top:.75rem;">
    <label>Flow strength <input type="range" id="flow-strength" min="0" max="100" value="0"> <span class="ctrl-val" id="flow-strength-val">0.00</span></label>
  </div>
  <div class="ctrl-row">
    <label>Flow steps <input type="range" id="flow-steps" min="1" max="4" value="1"> <span class="ctrl-val" id="flow-steps-val">1</span></label>
  </div>
  <div id="flow-guarantee" style="font-size:.82em;font-family:monospace;text-align:center;margin-top:.4rem;color:#27ae60;">By construction: ∫p = 1.000</div>
  <figcaption>A normalizing flow transforms a Gaussian into a complex distribution via invertible warpings. Total probability mass is conserved by the invertibility constraint. Increase strength to see the Gaussian twisted into new shapes.</figcaption>
</figure>

### Energy-Based Models: Breaking the Rule

Energy-based models (EBMs) break the normalization-by-construction principle deliberately, for expressive power:

$$p_\theta(x) = \frac{e^{-E_\theta(x)}}{Z(\theta)}, \quad Z(\theta) = \int e^{-E_\theta(x)} \, dx$$

The energy function $E_\theta(x)$ can be any neural network — completely flexible. But the normalization constant $Z(\theta)$ (the partition function) is an integral over all inputs. Computing it is intractable. Training requires estimating gradients of $\log Z(\theta)$, which typically involves Markov chain sampling. The penalty for maximum expressive freedom is maximum training difficulty.[^ebm]

### The Probability Budget — A Visual Summary

<svg width="100%" viewBox="0 0 660 260" style="display:block;max-width:660px;margin:1.5rem auto;font-family:Georgia,serif;">
  <!-- Column headers -->
  <text x="110" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Autoregressive</text>
  <text x="330" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Latent Variable</text>
  <text x="550" y="22" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Normalizing Flow</text>

  <!-- Autoregressive: stacked slices reassembling to 1×1 -->
  <rect x="60" y="35" width="100" height="190" fill="none" stroke="#bbb" stroke-width="1"/>
  <!-- Slices -->
  <rect x="61" y="36" width="98" height="38" fill="#4a90d9" opacity="0.85"/>
  <text x="110" y="59" text-anchor="middle" font-size="10" fill="#fff">p(x₁) = 0.4</text>
  <rect x="61" y="75" width="98" height="28" fill="#4a90d9" opacity="0.65"/>
  <text x="110" y="93" text-anchor="middle" font-size="10" fill="#fff">p(x₂|x₁)</text>
  <rect x="61" y="104" width="98" height="48" fill="#4a90d9" opacity="0.5"/>
  <text x="110" y="132" text-anchor="middle" font-size="10" fill="#fff">p(x₃|x₁,x₂)</text>
  <rect x="61" y="153" width="98" height="36" fill="#4a90d9" opacity="0.35"/>
  <text x="110" y="175" text-anchor="middle" font-size="10" fill="#fff">p(x₄|…)</text>
  <rect x="61" y="190" width="98" height="35" fill="#4a90d9" opacity="0.2"/>
  <text x="110" y="212" text-anchor="middle" font-size="10" fill="#555">p(xₙ|…)</text>
  <text x="110" y="240" text-anchor="middle" font-size="10" fill="#27ae60">Product = 1.0 ✓</text>

  <!-- Vertical dividers -->
  <line x1="220" y1="30" x2="220" y2="250" stroke="#eee" stroke-width="1"/>
  <line x1="440" y1="30" x2="440" y2="250" stroke="#eee" stroke-width="1"/>

  <!-- Latent variable: prior bell + decoder bells inside -->
  <!-- Prior Gaussian outline -->
  <path d="M260,220 Q280,220 295,180 Q310,100 330,80 Q350,100 365,180 Q380,220 400,220 Z" fill="#e67e22" opacity="0.18" stroke="#e67e22" stroke-width="1.5"/>
  <text x="330" y="238" text-anchor="middle" font-size="10" fill="#e67e22">p(z)  prior</text>
  <!-- Small decoder bells -->
  <path d="M285,195 Q292,195 298,175 Q303,150 310,140 Q317,150 322,175 Q328,195 335,195 Z" fill="#4a90d9" opacity="0.55"/>
  <path d="M320,190 Q327,190 333,175 Q338,155 345,148 Q352,155 357,175 Q362,190 370,190 Z" fill="#4a90d9" opacity="0.55"/>
  <text x="310" y="135" text-anchor="middle" font-size="9" fill="#4a90d9">p(x|z₁)</text>
  <text x="347" y="143" text-anchor="middle" font-size="9" fill="#4a90d9">p(x|z₂)</text>
  <text x="330" y="215" text-anchor="middle" font-size="10" fill="#27ae60">∫ p(x|z)p(z)dz = 1 ✓</text>

  <!-- Normalizing Flow: regular grid warped -->
  <!-- Regular grid on left side of arrow -->
  <g transform="translate(470,38)">
    <!-- Grid cells 4x5 -->
    <rect x="0"  y="0"  width="25" height="25" fill="#27ae60" opacity="0.25" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="25" y="0"  width="25" height="25" fill="#27ae60" opacity="0.30" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="0"  y="25" width="25" height="25" fill="#27ae60" opacity="0.35" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="25" y="25" width="25" height="25" fill="#27ae60" opacity="0.25" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="0"  y="50" width="25" height="25" fill="#27ae60" opacity="0.40" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="25" y="50" width="25" height="25" fill="#27ae60" opacity="0.30" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="0"  y="75" width="25" height="25" fill="#27ae60" opacity="0.28" stroke="#27ae60" stroke-width="0.5"/>
    <rect x="25" y="75" width="25" height="25" fill="#27ae60" opacity="0.35" stroke="#27ae60" stroke-width="0.5"/>
    <text x="25" y="120" text-anchor="middle" font-size="9" fill="#555">z ~ Gaussian</text>
  </g>
  <!-- Arrow -->
  <line x1="535" y1="100" x2="565" y2="100" stroke="#555" stroke-width="1.5"/>
  <polygon points="565,96 572,100 565,104" fill="#555"/>
  <text x="553" y="94" text-anchor="middle" font-size="8" fill="#555">f θ</text>
  <!-- Warped grid -->
  <g transform="translate(570,38)">
    <path d="M0,0 Q15,-5 28,4 L32,28 Q18,22 0,26 Z" fill="#27ae60" opacity="0.25" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M28,4 Q42,-2 55,6 L56,30 Q43,24 32,28 Z" fill="#27ae60" opacity="0.30" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M0,26 Q18,22 32,28 L28,55 Q12,48 0,52 Z" fill="#27ae60" opacity="0.35" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M32,28 Q43,24 56,30 L52,56 Q38,50 28,55 Z" fill="#27ae60" opacity="0.25" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M0,52 Q12,48 28,55 L22,82 Q8,76 0,78 Z" fill="#27ae60" opacity="0.40" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M28,55 Q38,50 52,56 L48,84 Q34,79 22,82 Z" fill="#27ae60" opacity="0.30" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M0,78 Q8,76 22,82 L18,105 Q4,100 0,102 Z" fill="#27ae60" opacity="0.28" stroke="#27ae60" stroke-width="0.5"/>
    <path d="M22,82 Q34,79 48,84 L44,108 Q30,104 18,105 Z" fill="#27ae60" opacity="0.35" stroke="#27ae60" stroke-width="0.5"/>
    <text x="28" y="120" text-anchor="middle" font-size="9" fill="#555">x = f(z)</text>
  </g>
  <text x="550" y="215" text-anchor="middle" font-size="10" fill="#27ae60">|det J| conserves area ✓</text>
</svg>

---

## The Inductive Bias Checklist

Every architectural decision is a bet. Before training, you should be able to articulate *exactly* what bets you are making. Here is a checklist for designing generative models.

### 1. What are you predicting and conditioning on?

Write down the joint distribution you want to model. Explicitly:

- What is $X$? Pixels $X_{i,j}$? Tokens $X_t$? Audio samples $X_t$?
- What structure exists in $X$? Is it a grid? A sequence? An unordered set? A graph?
- Are you conditioning on anything? Captions $Y$ given image $X$? Translations $T$ given source $S$?

This seems trivial. It is not. The formulation determines what architectures are even applicable.

### 2. Local or global?

Where does the *signal* live in your domain?

- **Images:** edges and textures are local. Long-range correlations exist (the sky above matches the sky below) but are softer. CNNs exploit locality; their failure mode is missing long-range structure.
- **Language:** syntax is local (adjacent words constrain each other); but *facts* can span thousands of tokens. A transformer attends globally; an RNN compresses history into a fixed vector and forgets.
- **Translation:** alignment between source and target is often sparse but crucial — one word in English maps to one specific word in the target, and that pairing must be preserved exactly.

### 3. Dense or sparse?

Does every input dimension matter equally, or is there one needle in a massive haystack?

Attention mechanisms are a powerful answer to sparsity: they learn *which* inputs to attend to, rather than weighting all inputs uniformly. For dense signals, convolutions are more efficient — every spatial location matters roughly equally.

### 4. Invariance and equivariance?

Does the meaning change if you rotate the image? Shift the sequence by one token? Reorder a set?

- **Translational invariance** (CNNs): a cat is a cat regardless of where it appears in the image.
- **Sequence translation equivariance** (RNNs, Transformers): the grammar rule for "not" applies regardless of which position it appears at.
- **Permutation invariance** (DeepSets, GNNs): a set of points has no inherent ordering.

Baking these symmetries into the architecture means the model doesn't have to learn them from scratch — it gets them for free, freeing capacity for harder problems.[^symmetry]

### 5. What will fail and why?

Before training, identify the failure mode of your chosen inductive bias:

| Architecture | Bets you're making | How it will fail |
|---|---|---|
| CNN | Local spatial correlations | Misses global structure; long-range dependencies invisible |
| RNN/LSTM | Temporal sequence compressible into fixed state | Blurs precise historical details over long distances |
| Transformer | Global attention sufficient; position encodable | Brute-forces correlations that don't exist; quadratic cost |
| Autoregressive | Chain rule factorization; left-to-right causality | Can't capture bidirectional dependencies in one pass |
| VAE | Posterior approximable by Gaussian | Posterior collapse; blurry samples |

---

## The Why-Regress

*Why do we need generative models?* → To model $p_{\text{data}}$: sample from it, evaluate densities, do unsupervised learning.

*Why is modelling $p_{\text{data}}$ hard?* → The data lives in a space with $2^n$ configurations. No tractable parameterization of the full joint exists.

*Why does the exponential arise?* → Because each variable might depend on every other. The full joint requires one parameter per configuration.

*Why must we impose structure?* → Because we don't have $2^n$ parameters, or $2^n$ data points, or physical storage. We must compress.

*Why does structure help?* → It encodes assumptions about which dependencies are real. If the assumption is right, you need much less data. If wrong, you hit a ceiling.

*Why does the ceiling exist?* → Because structure is a constraint. Constrained models can't represent distributions that violate the constraint, even with infinite data.

*Why do we have normalization-by-construction families?* → Because the alternative — computing the partition function — is the same $2^n$ problem. Clever architecture sidesteps the integration.

*Why does the world have structure at all?* → **Because physics imposes it.** Nearby pixels covary because light reflects coherently from objects. Words co-occur because they encode ideas that cluster in meaning-space. DNA sequences have patterns because molecular constraints prohibit many configurations. Without physical structure in the world, no learning algorithm could work — there would be nothing to compress. **Generative models are machines for finding and exploiting the structure that physics put there.**

---

[^datagenerating]: The framing of machine learning as distribution approximation — $p_\theta \approx p_{\text{data}}$ — now feels like it was always the obvious way to think about the problem. It wasn't. In the 1980s and early 1990s, the dominant paradigm was connectionism: neural networks as loosely brain-inspired function approximators, trained to minimize prediction error, with little probabilistic scaffolding. The clean probabilistic framing crystallised gradually, driven by a specific set of people — Judea Pearl working on Bayesian networks, Geoffrey Hinton and his students pushing maximum likelihood training, Michael Jordan synthesising graphical models and neural networks — each operating partly independently, partly in dialogue, all embedded in an academic culture that was simultaneously fascinated and sceptical of the project. The idea that the right question was "learn $p_{\text{data}}$" rather than "fit a function" was not obvious in advance. It was a sociological and intellectual convergence, not a logical inevitability.

[^curse]: The exact count for an $n$-pixel binary image is $2^n - 1$ free parameters (since probabilities must sum to 1). For a 28×28 image: $2^{784} \approx 10^{236}$. The observable universe has roughly $10^{80}$ atoms. Even specifying one parameter per Planck volume ($\sim 10^{185}$ per observable universe) falls incomparably short of $10^{236}$.

[^inductive]: The choice of inductive bias is arguably the most important design decision in deep learning — more important than the optimization algorithm, the initialization, or even the dataset size within an order of magnitude. LeCun's 1989 insight — that images have local spatial structure, and that parameter sharing across spatial positions (convolution) encodes this — is the direct reason CNNs work as well as they do. The bias wasn't a kludge; it was a hard-won structural insight about the data domain.

[^naivebayes]: Naïve Bayes dominated NLP through the 1990s not purely because it was the best available method, but because it was computationally tractable at a time when the alternative — anything requiring gradient descent over large parameter counts — was prohibitively expensive. The hardware and software infrastructure for training large discriminative models simply didn't exist. What looked, in hindsight, like a principled commitment to the generative paradigm was partly an accident of the compute landscape. When logistic regression became easy to train at scale, and then SVMs arrived with their theoretical guarantees, Naïve Bayes was displaced rapidly. The lesson is not that generative models were wrong — they weren't — but that the sociology of which methods get used depends heavily on what is *tractable right now*, which is as much a function of Moore's law and available libraries as of intellectual merit. Ideas that were genuinely good but computationally premature often wait a decade to be vindicated.

[^gendisc]: Ng and Jordan's 2001 paper "On Discriminative vs. Generative Classifiers: A comparison of logistic regression and naive Bayes" gave a clean theoretical treatment: generative classifiers converge to their asymptotic error faster (in $O(\log n)$ examples), but their asymptotic error is higher because the model is misspecified (the independence assumption is wrong). Discriminative classifiers converge more slowly ($O(n)$ examples) but converge to a lower asymptotic error. In small data regimes, go generative. In large data regimes, go discriminative — or use a deep network that renders the distinction moot.

[^ar]: The original autoregressive language model in modern form traces to Bengio et al.'s 2003 "A Neural Probabilistic Language Model," which replaced discrete lookup tables for conditionals with a feedforward neural network. The chain rule of probability had existed since Kolmogorov, but pairing it with neural network conditionals was the insight that eventually led to GPT. Everything in large language models is, at its core, an application of the autoregressive factorization with a very large neural network estimating each conditional.

[^flows]: Normalizing flows feel, in retrospect, like an obvious tool: if you can invert a transformation and compute its Jacobian, you get exact likelihoods for free. The change-of-variables formula is nineteenth-century calculus. And yet the modern normalizing flow — as a practical deep learning method — was not seriously developed until Rezende & Mohamed's *Variational Inference with Normalizing Flows* (2015) and Dinh et al.'s *NICE* (2014), nearly a decade after VAEs and a quarter-century after backpropagation. Why the delay? Partly because designing architectures with tractable Jacobians is non-trivial and required specific insights (coupling layers, autoregressive transforms). Partly because the research community's attention was elsewhere — on discriminative models, then on VAEs and GANs. The path from the change-of-variables formula to RealNVP to Glow to the eventual influence on diffusion models is not a straight line of logical development. It is a story of particular researchers (Laurent Dinh, Jascha Sohl-Dickstein, Durk Kingma) pursuing threads that seemed marginal or esoteric to most of the field, until suddenly they didn't. At the time of writing, diffusion models — which can be understood as infinitely deep normalizing flows — are the dominant paradigm for image generation. Nothing about this was obvious in 2013.

[^ebm]: EBMs have fallen in and out of fashion. Hinton's restricted Boltzmann machines (2006) used Gibbs sampling to estimate the partition function gradient, which worked but was slow. The resurgence of EBMs in the 2010s used Langevin dynamics and contrastive divergence. Modern score-based models (Song & Ermon, 2019) approximate the gradient of the log-density without ever computing the partition function — a clever escape from the normalization problem that EBMs usually face. The boundary between score-based models and diffusion models is thin; diffusion models (Ho et al., 2020) are essentially EBMs trained with a particular noise schedule that makes the score tractable.

[^symmetry]: The mathematical framework for symmetries in neural networks is equivariance theory, developed rigorously by Kondor and Trivedi (2018) and Cohen & Welling (2016). The core theorem: if the data distribution is invariant under a group $G$, then the optimal function is equivariant under $G$. This means symmetry-exploiting architectures are not just computationally efficient — they are, in a precise sense, optimal for structured data. The practical implication: when you know your data has a symmetry, baking it in is strictly better than letting the network discover it from data.

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js"></script>
<script src="/js/nn-generative.js"></script>
