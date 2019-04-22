---
layout: post-journal
title: DP Case Studies
date:   2019-03-28 09:00:11
tag:
categories: interview
excerpt:
permalink: /dp-practice
comments: false


---

# Activity Selection


Three approaches to activity selection:

firstApproach (naive, top-down, recursive, backtracking):

* Assume a particular activity \\(a \\) is part of the optimal solution
* Solve the subproblem of solving for {Activities - allImcompatibleWith(a)}.
* Loop over all a and choose maximum. 

