---
layout: page-home
title: Research 
permalink: /research/
section: Home
---

<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>

<div class="section" markdown="1">



Theoretical CS
=====

[Approximation Algorithms in Network Design]()

:  Many real-world networks face a fundamental tension: should you invest upfront in shared infrastructure, or pay as you go? An oil company routing pipelines from remote wells to a refinery faces exactly this choice: install high-capacity pipes (expensive but reusable) or lease smaller capacity (cheap per unit, but costs accumulate with usage). The same structure appears in telecommunications infrastructure, VLSI design, and fiber-optic network planning.  *Connected Facility Location (CFL)* problem formalizes this tension. CFL is NP-hard, so the question is: how close to optimal can a polynomial-time algorithm get?
We studied this question by analyzing a clever but natural primal dual formulation for the *Single-Sink Rent-or-Buy (SRoB)*special case of CFL. The LP relaxation produces a polynomial time moat-growing algorithm that produces optimal solution for many cases.  Our central contribution was two classes of pathological examples where this algorithm fails arbitrarily badly. In both cases, a large group of clients merges early and collectively "buys" edges that are only useful to other clients: overpaying on their behalf. A bidirected cut relaxation fixes the first class, but a subtler general graph example defeats even that.


_[Approximation Algorithms in Network Design][thesis]{:.pdf :}_

Maths 
=====

[Redimensioning of Euclidean Spaces]()

:   A vector space over a field $$\mathbb{F}$$ is a set $$V$$ together with two binary operations, called vector addition and scalar multiplication. It is standard practice to think of a Euclidean space $$\mathbb{R}^n$$ as an $$n$$-dimensional real coordinate space i.e. the space of all $$n$$-tuples of real numbers $$R^n$$, with vector operations defined using real addition and multiplication coordinate-wise. A natural question which arises is if it is possible to redefine vector operations on the space in such a way that it acquires some other dimension, say $$k$$ (over the same field, i.e., $$\mathbb{R}$$). In this paper, we answer the question in the affirmative, for all $$k\in\mathbb{N}$$. We achieve the required dimension by 'dragging' the structure of a standard $$k$$-dimensional Euclidean space $$\mathbb{R}^k$$ on the $$n$$-tuple of real numbers $$R^n$$. At the heart of the argument is Cantor's counterintuitive result that $$\mathbb{R}$$ is numerically equivalent to $$\mathbb{R}^n$$ for all $$n\in\mathbb{N}$$, which can be proved through an elegant construction. Finally, we generalize the result to all finite dimensional vector spaces.


_[Redimensioning of Euclidean Spaces][lapaper]{:.pdf :}_. _Preprint_ at [Arxiv](http://arxiv.org/abs/1307.7010)


AI and Society
=====

[Man and Machine: Questions of Risk, Trust and Accountability]()

:   Artificial Intelligence began as a field probing some of the most fundamental questions of science - the nature of intelligence and the design of intelligent artifacts. But it has grown into a discipline that is deeply entwined with commerce and society. Today's AI technology, such as expert systems and intelligent assistants, raise difficult questions of risk, trust and accountability. In this paper, we present these concerns, examining them in the context of historical developments that have shaped the nature and direction of AI research. We also suggest the exploration and further development of two paradigms - human intelligence-machine cooperation and a sociological view of intelligence - which will help address these concerns.

_[Man and Machine: Questions of Risk, Trust and Accountability in Today's AI Technology][aipaper]{:.pdf :}_. _Preprint_ at [Arxiv](http://arxiv.org/abs/1307.7010)




Economics 
=====

[Market Mechanisms And Financial Derivatives For Internet Congestion]() 

:   Could market mechanisms be employed to tackle or relieve Internet congestion? We look at three market mechanisms: consumer-side congestion pricing, content-side paid prioritization, and bilateral risk sharing agree- ments. While the former two have been heavily studied in economic literature, the risk sharing approach towards congestion is a novel addition of this thesis. We treat the uncertainty in broadband congestion levels as an economic risk that consumers and Internet businesses are forced to bear. We design congestion-based financial instruments, similar to derivatives in a stock market, that efficiently allocate risk borne out of congestion.


_[Congestion Based Financial Instruments for the Internet Economy][ppethesis]{:.pdf :}_ 



Behavioral Economics
=====

[The Rational Altruist: Challenging Von Neumann-Morgenstern Rationality ]()

:   Is our instinct for altruism fatal to the assumptions of strict rationality in mainstream economics? Or is the utility function in expected utility theory flexible enough to accomodate altruistic preferences? Rationality in expected utility theory (specifically Von Neumann­-Morgenstern rationality) requires the satisfaction of four axioms: completeness, transitivity, continuity, independence. These are quite reasonable requirements of rational behavior. We argue, however, that the human altruistic instinct can lead to violations of transitivity and independence axioms, and propose experiments to demonstrate it. We also explain these departures from VNM rationality in light of the recent literature on behavioral economics. Lastly, we hypothesize that the psychological value of money depends on ownership, and propose further experiments to test it. 

_[Essays in Economics and Morality][rbn]{:.pdf :}_


<!-- 
[Financial Theory and Functional Analysis]()
:   We study how concepts from measure theory can be used to capture information flow in financial markets. We show that the existence of the conditional expectation of a given random variable follows from the structure of \mathcal{L}_2 Hilbert Spaces. Interpreted this way, the conditional expectation is the orthogonal projection of the random variable on a sub − σ – algebra - the unique a.e best approximation of the random variable on the closed subspace of the space of all random variables with finite variance.

_[Capturing Information Flow: Introduction](/files/research/mad1.pdf){:.pdf :}_. _[Conditional Expectation through Hilbert Spaces](/files/research/mad2.pdf){:.pdf :}_. _[Hilbert Spaces and Conditional Expectation (Slides)](/files/research/mad.pdf){:.pdf :}_.     


</div>

***

<div class="section" markdown="1">

Others
=====================


 _[Yields Falsehood When Preceded by its Own Quotation][yields]{:.pdf :}_. On The Problem of Consciousness 

 _[Game Theory and The Dark Knight][knight]{:.pdf :}_. Published in _Infinite Epsilons_ (Maths Department Magazine) 
 -->
<!-- _[A God's Workshop in an Idle Mind][god]{:.pdf :}_. Conversations with God

_[Jurassic Whispers][thesaurus]{:.pdf :}_. A short poem

_[What's in a Name?][name]{:.pdf :}_. An essay in Philosophy of Language. -->

</div>


<div class="section" markdown="1">
<!-- 
Presentations
=====================

_[Othello and Omkara: Reading Shakespeare in Modern Times][othello]{:.pdf :}_. In _Introduction to Drama_.


_[The Problem of Consciousness][yields2]{:.pdf :}_. In _Mind, Machine and Language_. -->


[ppethesis]: ../files/research/ppethesis.pdf
[thesis]: ../files/research/thesis.pdf
[rbn]: ../files/research/economicsandmorality.pdf
[nus]: ../files/research/congestionoption.pdf
[aiims]: ../files/research/aiims.pdf
[aipaper]: ../files/research/ais.pdf
[lapaper]: ../files/research/redimensioning.pdf
[yields]: ../files/essays/yields.pdf
[name]: ../files/essays/name.pdf
[knight]: ../files/writings/knight.pdf
[god]: ../files/writings/god.pdf
[thesaurus]: ../files/writings/jurrasicwhispers.pdf
[othello]: ../files/presentations/othello.pdf
[yields2]: ../files/presentations/yields.pdf


