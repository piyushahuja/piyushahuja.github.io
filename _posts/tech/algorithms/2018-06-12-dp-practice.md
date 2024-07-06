---
layout: post-normal
title: Activity Selection
date:   2018-06-12 09:00:11
tag:
categories: algo
excerpt:
permalink: /dp-practice
comments: false


---

Tips: For an algorithm that just needs min or max value to work at eachs step, and node the whole sorted order, one can reduce time complexity from O(nlogn) to (O(n)) by working with the kth smallest (or largest) element instead of min or max. Here k should be a linear function of n. For example, k can be the median (k = n/2). Median can be found in O(n) times

It is frequently the case that preprocessing the data or using a priority queue, one can make the greedy choice quickly (O(1)), making the algorithm efficient. 

------

>  Given a set of activities A with start and end times, find a maximum subset of mutually compatible activities.


----


**First Approach** *Iterative, Exhaustive Search*

* Iterate over each possible subset of activities
* Checking for comptability
* Out of all subsets which are compatble, take the maximum length subset 

Number of problems solved: \\( 2^n \\)         
Time to solve each subproblem : \\( O(n) \\)

----

**Second approach** *Top-down, decrease-by-one recursion*



Strategy: Solve an easier problem (aka subproblem).      
Why? Maybe the problem has an optimal substructure: an optimal solution cae constructed from optimal solutions to its subproblems. 
Which easier problem should we try? Let's try decrease-by-one and conquer.
Given an optimal substucture, if we knew which \\(a_k \\) to choose, we could construct an optimal solution by selecting  \\(a_k \\) alongwitht he all actvities in optimal soluton to subproblems. 


* Assume a particular activity \\(a_k \\) is part of the optimal solution
* Solve the subproblem: select a maximal subset of compatible activies from the activities which are compatible with \\(a_k \\).
* Loop over all possible activities \\(a_k \\) and choose maximum. 

Let \\( A = [a_0, a_1.....a_k...a_{n-1}] \\) be the set of all activities.

Let  \\(A_k \\) denote the set of all activities which are compatible with \\(a_k \\). This set will be smaller that \\(A \\), since it doesn't contain \\(a_k \\). Then, 

\\[  Opt(\it{A}) = \max_{k=0}^{n-1} Opt(\it{A_k} ) + 1  \\]


Recursion Tree:


Number of subproblems: \\( 2^n \\)

Number of function calls:  

\\[ T(n) = n + nT(n-1) \\]

\\[ 1 + n + n(n-1) + n(n-1)(n-2)...+ n! \\] 
 \\[ = n!(1 + 1/2! + 1/3! + .... + 1/n!) =   \Theta (en!) \\]

Clearly, this is even worse than the brute force approach!

---


**Third Approach** *Top-down, divide-and-conquer recursion*
  
For the easier subprobelm to solve, let's try better than the decrease-by-one and conquer strategy: divide-and-conquer. 

Here we partition the problem into non-overlapping problems. If the optimal solution to the overall problem can be calculated from the optimal solution to these problems, we'd have optimal substructure. 


* Assume a particular activity \\(a_k \\) is part of optimal solution
* Define the easier problems: 
    * The set activities that finish before \\(a_k \\) starts: \\(Before(a_k) \\)
    * The set of activities that start after \\(a_k \\) finishes: \\(After(a_k) \\)
* Solve the easier problems. If the optimal solution contains \\(a_k \\), then the optimal solution should contain the optimal solutions to \\(Before(a_k) \\) and \\(After(a_k) \\)
* Loop over all possible \\(a_k \\) and choose maximum. 



\\[  Opt(\it{A}) = \max_{k=0}^{n-1} Opt(Before(a_k)) + Opt(After(a_k)) +  1  \\]

Recursion Tree:

Number of subproblems:  \\(n^2\\)

Number of function calls (worst case):  

\\[ T(n) = \sum_{k=0}^{k=n-1} T(k) + T(n-k) \\]



----


Note        

\\( {A_k} = Before(a_k) \cup After(a_k))    \\)

Without memoization, the two approaches do the same computations at each step. However, if we memoize, then the two approaches are wildly different. The first is still exponential, while the latter is polynomial time.

Why?

Consider \\(  = B \cup C  \\), where  \\(B \\) and \\( C \\) correspond to two dijoint intervals. As \\(B \\) and \\( C \\) vary over  \\(m \\) and \\( n \\) values, they make up \\( mn \\) unique values of \\(  B \cup C  \\), whose solutions we need to store. If we  use \\(B \\) and \\( C \\) directly instead of \\(  B \cup C  \\), then we need only store \\( m + n \\) values. 


----

**Fourth Approach** *Iterative, Bottom Up*

Note the recursion.

\\[  Opt(\it{A}) = \max_{k=0}^{n-1} Opt(Before(a_k)) + Opt(After(a_k)) +  1  \\]

Rotate the recursion tree by 90 degrees and see the dependency graph. Observation: The solution to higher cases depend only on solution to base cases. If we solve the bases cases and iterate in the right order, we can solve the problem.

Represent it by a table or a Map.  Let \\(c(i,j) \\) denote the solution for the set of activities that lie between activity \\( i \\)  and \\( j \\), \\(S(i,j)\\). 

If  \\(S(i,j) = \Phi \\), then \\(c[i,j] = 0\\) (base case)
Otherwise, let \\(k \\) be the index of the activity which lies between  activity \\( i \\)  and \\( j \\).

From the recursion,

\\[  c(i,j) = \max_{k=i+1}^{j-1} (c(i,k) + c(k,j)) +  1  \\]

Not all indices \\( k \\)  between \\( i \\)  and \\( j \\)  correspond to such activities: some of them might start before \\( i \\)  finish, or finish after \\( j \\)  starts, but we can be certain that hose which do satisfy the constraint are a subset of those whosee indices lie. So all we need to do is loop over these values and check. 

We can represent this in the DP table.


Running Time: O(n^3)

Note: We can easily motify this approach to solve the generalization "max total value of activities selected where each activity has a value". This special case has each activity valued equally (or equal to 1.)

------

**Fifth Approach** *A combinatorial insight based on trying various greedy choices*


Observation: There exist an optimal solution that will have an activity with the earliest finishing time. So this simplifies our choice: Instead of assuming the choice, seeing which subproblems result, finding ther opt, and then making the choice by comparing their results, we can make the choice first. 

The optimal substructure varies in how many subproblems we have and how many choices we have in determining which subproblems which subprobems to use. With the insight that greedy choice would work, we could just make that choice! This reducces our subproblems to use from 2 to just 1, and the choice from j-i-1  to just 1 as well.  

In the dp approach, we needed to solve the subproblems to help us make the choice. So we proceeded in a bottom up manner. But once we get the greedy insight, we need not solve the subproblem before making the choice. 


Intuition: Choosing this activity leavus us the maximum room to bucket other activities in, with the least disturbance to other activities. 
Not that this intuition isn't enough: you still need to prove it. For example: choosing the activity with least duration doesn't give us the right solution (counter example), and choosing the activity with least disurbance doesn't either.

Not that *any* optimal solutions is not guaranteed to contain this activity: which means it is useless to search for an intuition for why "it is true that optimal solution contains the activity with ear*lies finishing time", because that statement is false. 

Running Time: O(n)

----

**Sixth Approach** *Inspired by LIS*

Which easier problem? The maximum number of compatible activities from start to a particular activity which includes the particular activity.
Once we know the solutions to these, we can choose the maximum over all such subproblems. Running Time: O(n^2)


-------

0 - 1 Knapsack




----

# Coin Change

Strategy: Solve an easier problem (aka subproblem).      
Why? Maybe the problem has an optimal substructure: an optimal solution cae constructed from optimal solutions to its subproblems. 


**Which easier problem should we try?**

There can be multiple ways to answer this, and sometimes more than one approaches might be correct.

For example, in Coin change, we can frame our choice or decision as either of these:

* For a particular coin, choose whether this is part of optimal or not. This gives us two choices and two subproblems
* Which coin should we choose as the last one? We have n choices, and n subproblems. 
* How many of the first coin should we have? 






----


# LIS






