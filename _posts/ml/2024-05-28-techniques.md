---
layout: post-normal
title: Techniques
date:   2024-05-28 09:00:11
tag:
categories: rl
excerpt:
permalink: /techniques
comments: false


---

<!-- 
abstraction and generalization are fundamental mathematical activities.
allow abstraction as one of the proof-finding methods which allows the proof finder to search for general techniques for proving a wide class of statements, as opposed to results that are more tailored to the specific target and hypotheses in the given problem state.


Bayesianism in mathematics

Learning from Errors


motivations: formal statements of heuristic principles, and the purpose of having them in the library would be to model the know-how of an experienced human mathematician, providing a bridge between a problem state where a library result can be applied in a non-obvious way, and the library result itself


----


Combinator is a function without free variables. 

Calculus is a method of computation or calculation in a special notation -->


In RL or NLP, gradients are often sparse or very noisy. Vanilla SGD uses a single learning rate for all parameters. Different parameters can have very different gradient magnitudes (e.g., early layers vs. late layers in CNNs). Choosing a good fixed learning rate is hard and often unstable.


ADAM: Computes an adaptive learning rate per parameter using the moving average of squared gradients. Large-gradient parameters → smaller steps; small-gradient parameters → bigger steps


Moving Average Trick:




Dropout:
. What Dropout Does
Dropout randomly "turns off" neurons during training with probability $$p$$.

Each forward pass uses a different subnetwork

Effect:

Prevents the network from over-relying on specific neurons

Improves generalization

Acts as a regularizer like L2 weight decay

Dropout is applied in the hidden layers only (not on output layer, because you need a valid probability distribution)


====

L2 regularization is a technique to prevent overfitting in neural networks (and other models) by discouraging the weights from becoming too large.

Penalizing large weights discourages them from becoming too large. Smaller weights → network is less sensitive to small input changes. Reduces the risk of memorizing noise. Encourages smoother, more generalizable decision boundaries.

Dropout: randomly zeroes some activations during training to prevent co-adaptation.

L2: continuously shrinks weights to avoid large, overfit parameters.

Both are regularizers, but they work in different ways and are often used together.


----
 if you insist on trying out Policy Gradients for your problem make sure you pay close attention to the tricks section in papers, start simple first, and use a variation of PG called TRPO, which almost always works better and more consistently than vanilla PG in practice. The core idea is to avoid parameter updates that change your policy too much, as enforced by a constraint on the KL divergence between the distributions predicted by the old and the new policy on a batch of data (instead of conjugate gradients the simplest instantiation of this idea could be implemented by doing a line search and checking the KL along the way).


 ----
 In the case of Reinforcement Learning for example, one strong baseline that should always be tried first is the cross-entropy method (CEM), a simple stochastic hill-climbing “guess and check” approach inspired loosely by evolution.


 ---

 : Dying ReLU problem — neurons output zero for all inputs if weights drive them into the negative region permanently (gradient becomes 0, so they never update).

 Leaky ReLU:

Allows a small gradient for negative inputs ($$\alpha x$$), so neurons can recover even if they go negative.

Reduces the chance of “dead” neurons.


---
There’s a uniqueness theorem in information theory:

If you want a measure of “information content” that is additive for independent events and monotonic in probability (rare events = more information), then the measure must be proportional to $$-\log p$$.

The functional equation

$$
I(pq) = I(p) + I(q)
$$

has a unique solution (up to a constant factor):

$$
I(p) = -k \log p
$$

where $$k$$ is a constant (just a choice of log base: bits if base 2, nats if base $$e$$).

The negative sign makes sense: smaller $$p$$ means larger $$I(p)$$. Rarer events should carry more information. The information from two independent events should be the sum of their individual information contents.

This is why the only additive way to measure information is with a logarithm.

Now, if $$I(p) = -\log p$$ is the information content of one outcome, then the expected information across the distribution $$P$$ is the entropy:

$$
H(P) = \mathbb{E}_{x \sim P}[-\log P(x)] = -\sum_x P(x) \log P(x)
$$

That’s Shannon entropy.

Suppose instead of coding using the true distribution $$P$$, you code using some wrong distribution $$Q$$. The extra cost you pay per symbol is the difference in information content:

$$
-\log Q(x) - \left(-\log P(x)\right) = \log \frac{P(x)}{Q(x)}
$$

Take the expectation under the true distribution $$P$$:

$$
D_{\mathrm{KL}}(P \| Q) = \mathbb{E}_{x \sim P} \left[ \log \frac{P(x)}{Q(x)} \right] = \sum_x P(x) \log \frac{P(x)}{Q(x)}
$$

So:

- **Entropy**: average self-information.
- **KL**: average excess information when using $$Q$$ instead of $$P$$.

---

At the beginning, coding theory is about symbols: H, T, A, B, C, etc. Each symbol needs to be represented by a sequence of bits (like 0, 10, 11). So we care about the average number of bits per symbol.

Not all symbols occur equally often. If you always send H, why waste a whole bit? You could assign H $$\to$$ 0 and never need to code T at all. So the distribution of symbols matters: frequent ones should get shorter codes. We don’t care about the symbol itself, but its probability.

Shannon asked: If outcomes occur with probabilities $$P(x)$$, what is the best possible expected code length?

$$
\text{Expected length} = \sum_x P(x) \cdot \ell(x)
$$

where $$\ell(x)$$ is the code length for symbol $$x$$.

For an optimal code,

$$
\ell(x) \approx -\log_2 P(x)
$$

Why? Because if you assign code lengths proportional to $$-\log P(x)$$, the Kraft inequality (prefix-free constraint) is satisfied, and no other assignment can beat it.


Kraft's inequality


Setup: prefix-free codes

Suppose you have a set of symbols $$X = \{x_1, x_2, \ldots, x_n\}$$.

Each symbol $$x_i$$ is assigned a binary codeword of length $$\ell_i$$.

A prefix-free code means no codeword is a prefix of another.

Example: if “0” is a code, you cannot also have “01” or “001”.

We want a condition on the lengths $$\ell_1, \ldots, \ell_n$$ that guarantees a prefix-free code exists.

2. Key idea: codewords as a tree

Think of all possible binary strings as nodes in a full binary tree:

Root = empty string.

Left edge = append “0”, right edge = append “1”.

Each codeword is a leaf node.

Prefix-free ⇨ codewords occupy distinct leaves (no codeword is ancestor of another).

3. Counting leaves

A binary tree of depth $$L$$ has $$2^L$$ possible leaves at level $$L$$.

If a codeword has length $$\ell_i$$, it "consumes" $$2^{L-\ell_i}$$ leaves at level $$L$$ for any $$L \geq \ell_i$$.

Normalized at level 1 (root): each codeword "occupies" $$2^{-\ell_i}$$ of the unit interval $$[0,1]$$.

This is intuitive: a length-1 code splits [0,1] into halves → $$2^{-1}$$

A length-2 code splits it into quarters → $$2^{-2}$$, etc.



----
Suppose you want to predict a binary outcome:

Example: Will a student pass the exam? Yes (1) or No (0).

Or: Is this email spam (1) or not spam (0)?

We want a model that takes input features $$x$$ (study hours, word frequencies, etc.) and predicts the probability of outcome $$y \in \{0,1\}$$.

If we tried ordinary linear regression:

$$y \approx w^\top x + b$$,

it could predict values outside $$[0,1]$$, which is not valid for probabilities.

We map the linear score $$z = w^\top x + b$$ through a sigmoid function:

$$p(y=1|x) = \sigma(z) = \frac{1}{1 + e^{-z}}$$.

This ensures predictions are always between 0 and 1.

If $$z$$ is very positive → $$p \approx 1$$.

If $$z$$ is very negative → $$p \approx 0$$.

If $$z = 0$$ → $$p = 0.5$$.

Given a dataset $$\{(x_i, y_i)\}$$, we maximize the likelihood of the observed labels:

$$L(w) = \prod_i p(y_i|x_i)$$.

Equivalently, minimize the log-loss (cross-entropy):


Linear regression: predicts a real number (anywhere on the line).

Logistic regression: predicts the log-odds of the binary event as a linear function of $$x$$.

Formally:

$$\log \frac{p(y=1|x)}{p(y=0|x)} = w^\top x + b$$.

That’s why it’s called logistic regression: the linear function models the log-odds

Logistic regression is a method for modeling binary outcomes. It assumes the log-odds of the event is a linear function of the inputs, and it trains parameters by maximizing the probability of the observed labels.

----

The log-ratio $$\log \frac{\pi_\theta}{\pi_{\text{ref}}}$$ measures surprise or information gain when moving from the reference distribution to the new policy.

 Its expectation is KL divergence = "how many extra nats/bits you need if you code samples from $$\pi_\theta$$ with a code designed for $$\pi_{\text{ref}}$$."

reward learning, coding theory, and policy optimization are different views of the same principle: to optimize behavior, you are always tilting one distribution against another in log-space.



importance sampling is fundamentally about probability ratios.

Suppose you want to estimate an expectation under distribution $$P$$, but can only sample from $$Q$$.

The trick:

$$\mathbb{E}_{x \sim P}[f(x)] = \mathbb{E}_{x \sim Q}\left[f(x) \cdot \frac{P(x)}{Q(x)}\right]$$
E
x∼P
	​

[f(x)]=E
x∼Q
	​

[f(x)⋅
Q(x)
P(x)
	​

].

👉 That ratio $$P(x)/Q(x)$$ is exactly the same structure as the KL log-ratio — except KL uses the log of it and takes an expectation.

So in RLHF / PPO:

You generate samples under your current policy.

But you need to evaluate them under the old or reference policy.

That requires exactly these probability ratios.

PPO even clips these ratios to stabilize training — another importance sampling trick.

Shannon defined the information content (or "surprisal") of an event $$x$$ with probability $$p$$:

$$I(x) = -\log p(x)$$.

So the log is fundamental:

It turns probabilities into additive information (two independent events → sum of their surprises).

It makes entropy $$H(P) = -\mathbb{E}_P[\log P(x)]$$.

It makes KL divergence a natural measure of “extra surprise” when coding with 
𝑄
Q instead of 
𝑃
P.


---


KL Divergence is 


In DPO (Direct Preference Optimization), the reward and the KL divergence are related.

The standard RL objective is:
$$
J(\theta) = \mathbb{E}_{y \sim \pi_\theta} \left[ r_\phi(y) \right] - \beta D_{\mathrm{KL}}(\pi_\theta \| \pi_{\text{ref}})
$$

where:
- \( r_\phi(y) \): learned reward model (from human preferences)
- KL term: a regularizer, keeping the new policy close to the reference LM

The pointwise contribution to the KL divergence is:
$$
\hat{r}_\theta(y) = \beta \log \frac{\pi_\theta(y|x)}{\pi_{\text{ref}}(y|x)}
$$

The KL divergence itself is:
$$
D_{\mathrm{KL}}(\pi_\theta \| \pi_{\text{ref}}) = \mathbb{E}_{y \sim \pi_\theta} \left[ \log \frac{\pi_\theta(y|x)}{\pi_{\text{ref}}(y|x)} \right]
$$

So the implicit DPO reward is the log-ratio inside the KL. But DPO doesn’t take the expectation — it uses these log-ratios directly in the Bradley–Terry logistic regression loss.

In DPO, we define the implicit reward as:
$$
r_\theta(y|x) = \beta \log \frac{\pi_\theta(y|x)}{\pi_{\text{ref}}(y|x)}
$$

Then:
$$
\mathbb{E}_{y \sim \pi_\theta} [r_\theta(y|x)] = \beta D_{\mathrm{KL}}(\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x))
$$

So the KL is just the expected log-ratio reward

-----

When Shannon asked: “What is the entropy of English text?” he was asking:

👉 On average, how many bits of information does one letter (or word) of English carry?

If letters were independent and uniform (26 letters equally likely), entropy = $$\log_2(26) \approx 4.7$$ bits/letter.

But English is not uniform:

“e” is much more common than “z”

letters are correlated (“q” is almost always followed by “u”)

words and grammar add further predictability.

Shannon ran clever experiments:

He asked humans to guess the next character in text (like autocomplete).

The better they could guess, the lower the entropy.

Findings:

He estimated English entropy to be between 0.6 and 1.3 bits per character (after accounting for long-range structure).

That’s far lower than the maximum 4.7 bits/letter.

🔹 What it means

English is highly redundant — maybe 75–85% redundant.

That’s why spelling mistakes or missing words don’t always stop us from understanding.

Compression limit:

Entropy gives a lower bound on how much you could compress English without losing information.

E.g., if it’s ~1 bit/character, then in principle you could compress English text 4–5× smaller than raw ASCII (8 bits/char).

Predictability of language:

Entropy quantifies how much “choice” the writer has at each step, on average.

Low entropy = the next symbol is quite constrained by context.

With large text corpora, modern estimates also put English entropy around 1–1.5 bits per character.

LLMs are basically entropy estimators + predictors: they model the probability distribution of the next token in order to minimize surprise (cross-entropy).