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
Dropout randomly “turns off” neurons during training with probability 
𝑝
p = DROPOUT

Each forward pass uses a different subnetwork

Effect:

Prevents the network from over-relying on specific neurons

Improves generalization

Acts as a regularizer like L2 weight decay

Dropout is applied in the hidden layers only (not on output layer, because you need a valid probability distribution)


====

L2 regularization is a technique to prevent overfitting in neural networks (and other models) by discouraging the weights from becoming too large.

Penalizing  discourages large weights. Smaller weights → network is less sensitive to small input changes. Reduces the risk of memorizing noise. Encourages smoother, more generalizable decision boundaries.

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

Allows a small gradient for negative inputs (
𝛼
𝑥
αx), so neurons can recover even if they go negative.

Reduces the chance of “dead” neurons.

