---
layout: post-normal
title: Algorithm Design
date:   2019-08-29 09:00:11
tag:
categories: algo
excerpt:
permalink: /algorithm
comments: false


---

---

**How to think of a recursive solution?**



**What is recursion?**

* Recursion is when a function calls itself.  
> Recursion is the root of computation since it trades description for time.

---

**When to use recursion?**

* Hints that recursion would be useful: 
    * the data has a recursive structure: it can be defined recursively (e.g. trees, linkedlist, natural numbers)
    * the problem is defined recursively.
        * divide and conquer
        * dynamic programming

* If a function calls itself to solve a subproblem, two things had better happen: 
    * The subproblem has to be simpler than the original problem 
    * Some subproblems have to be so simple that you can solve them without recursion (bottoming out)

---

**Why recursion? Why not?**
two common reasons for using recursion:
* The problem is naturally recursive (e.g. Fibonacci)
* The data is naturally recursive (e.g. filesystem)
reason to use recursion is to take more advantage of immutability. In an ideal recursive implementation, all variables are final, all data is immutable, and the recursive methods are all pure functions in the sense that they do not mutate anything. The behavior of a method can be understood simply as a relationship between its parameters and its return value, with no side effects on any other part of the program.
recursive algorithms map very directly to mathematical induction, which he suggests is the only means to intellectually prove our loops correct. (I don't suggest that we must prove our code correct, but that the easier we make it for ourselves to do so, the more likely it is that our code is correct.)


Recursion can lead to stack overflow errors. downside of recursion is that it may take more space than an iterative solution. Building up a stack of recursive calls consumes memory temporarily, and the stack is limited in size, which may become a limit on the size of the problem that your recursive implementation can solve.

-----

**How to build a recursive solutions?**

* **Solve the base case first.** 

    In a base case, we compute the result immediately given the inputs to the function call. The base case corresponds to  the simplest, smallest instance of the problem, that can’t be decomposed any further. 

    Base cases often correspond to emptiness – the empty string, the empty list, the empty set, the empty tree, zero, etc.

    * Example: Given an array of integers, return the set of all permutations. For this problem, there are two such examples:
        * When the array is empty.
        * When the array has one element.


* Think of recursive case:   

    The recursive step decomposes a larger instance of the problem into one or more simpler or smaller instances that can be solved by recursive calls, and then combines the results of those subproblems to produce the solution to the original problem. 

    The key thing to note is that we keep our function specification fluid: the function specification can make the recursive decomposition easier

* **Top-down**

    Assume some magical oracle gives you the answer for all smaller problem instances. (“Assume you have a magical function that will solve the smaller problem for you (which is really just the function you’re writing”).

    This is in a sense a direct recursive implementation, where we are using the existing specification of the recursive method to solve the subproblems. Think of work done during the recursive step, before or after - and let that guide the decision as to what to return: if, for example, you need to do some computation with the result of a recursive call (work done after recursion), then your result should be in that suitable for. 
    
    * E.g. in BST insertion, you need to set the left/right child pointers of the parent to the new node after it is inserted as the leaf. So you might need to return the new node. Similarly, in counting elements of a list of length n, you might be adding the result 1 to the result of the list n-1, so you need to return int. Alternatively, you could be just sending an accumatator as a parameter, in which case the work is done in the recursive step itself (tail recursion).


**Selecting an easier problem (whose solution is given by the orracle)**

* **Solving a smaller problem** 

    

    * Think about several ways to break down the problem, and try to write the recursive steps. You want to find the one that produces the simplest, most natural recursive step. 
    * You have to pick the right subproblem. Sometimes it is a matter of choosing to work done post or pre-recursion. Work done pre-recursion usually corresponds to reframing the problem in some way. 
    * (DP) List all the parameters along which subproblems can be defined. Account for all the parameters as indices in the DP table. 
        * Frequent mistake: Students try to early optimize their solution (e.g. by omitting indices that need not be explicitly stored potentially leading to more memory-efficient solutions). In this case, they get the general solution right, but their recursion doesn't make any sense. A frequent outcome is a really buggy implementation. Also, these students have a harder time generalizing the solution to similar problems.

        * **“Decrease and conquer” algorithmic strategy.** On each pass through the loop, we peel off a value, solve the rest of the problem, and then make a change. This “decrease and conquer” is typical and is known as decrease-by-one. It has the following characteristics:
            * It divides the problem into two parts: a sub-problem of size (n -1) and a single remaining element.
            * It then solves the sub-problem of size (n-1) by a recursive call (or an iterative decreasing process).
            *  Finally, it adds the remaining individual element back into the sub-problem’s solution.
            * Even more so than in divide-and-conquer, the ‘divide’ step is often trivial. Most of the work goes into the third step, incorporating the lone element into the existing sub-solution.
        * Example: Word Wrap
            * Unhelpful subproblem: Remove the first or last character, solve subproblem. Why? Addition of character changes the solution to the subproblem (maybe it makes the previous word so long that it no longer can be fit in the width, and needs to be broken down).
            * Unhelpful subproblem: Remove the first word, solve the subproblem
            * Subproblem with inelegant recursive formulation: break by word: remove the last word, solve the subproblem (recursive step), and then append it (post recursion). To do the work post recursion, you need to know how much space is left, which can be the output of the subproblem.
            * Subproblem supportng elegant decomposition: Break work done by line. Do some work pre-recursion (insert line breaks the first line) and then leave the rest to the recursive step (the rest of the lines). 
        * Example: Coin change
            * Incorrect Decomposition: 
            `coinChange(n-d1,[d1…dk]) + counChange(n-d2, [d1…dk] + ….).` 
            This repeats the counts (e.g. solution with at least 1 d1 and d2 are present in both).

            * Correct Decomposition = `coinChange(n-d1, [d1…dk]) + coinChange(n, [d2…dk])`.
            * A second correct decomposition: `coinChange(n-d1, [d1…dk]) + coinChange(n-d2, [d3.…dk]) + ….`
                * Same as before, but delegate some of the work of recursive step to post-recursion through a loop. Or we can say it unpacks the right half of a binary recursion tree
            * A third correct decomposition: = `coinChange(n -d1, [d2…dk]) + coinChange (n-2d1, [d2….dk]) + ….coinChange(n-cd1, d2….dk])`, where cd1 >=n and (c-1)d1 < n. Or we can say it unpaccks the left half of a binary recursion tree. 
        * Example: Longest Increasing Subsequencce
            * Wrong subproblem:  LIS (A, k): LIS for A[1….k]
            * Right subproblem: LISWithTerminal[A,k]: LIS with the restriction that the A[k] is included.
            * (Another right subproblem): LIS with length 1,2,3,4. 
        * Example:  Permute({1,2,3,4})
            * This can be thought of the problem of choosing n elements from a given set, without replacement. assume you have an oracle which solves the the subproblems. 
            * Before recursion:  Pick an integer which will be in the jth position.
            * Recursion: Solve the subproblem of permuting all the remaining intergers as elements in position j+1…n
            * After recursion: Prepend the fixed integer to the permutations calculated in the recursive step in the place.  This will give all permutations with a particular element as the jth element
            * Run a for loop which allows each distinct remaining element to be the jth element.
        
        * Example: MergeSort
  
* **Solving a problem with some given property/relaxation**
    * Usually this is requires a pre-computation   
    * Example: QuickSort
            
* **Solving a reframed problem**

* Once you've selected a subproblem decomposition, write down what the function computes. Write down a sentence about what you are computing as a way to verify that "what's in the head" actually makes sense. 
    * Example: Zackendorf numbers 
        - z(n,k) is the complete representation of n in fibonacci base excluding the first k-1 fibonacci numbers. 
        - z(n, k) representes whether 1 or 0 is the kth index in the unique fibonacci representation, i.e. whether the kth fibonacci number is used. 
    * Example: "What is the best profit we can get from selling the wines with prices stored in the array p, when the current year is year and the interval of unsold wines spans through [be, en], inclusive?"

* Could we compute the solution to the problem from the subproblems? Figure out the recursion formula. What would need to be done post recursion, or pre-recursion?

* Can you get rid of some parameters? 
* Would brute force be exponential?

*  (Optimal Substructure). Consider if the problem has optimal substructure: an optimal solution uses the optimal solution to a subproblem. 
    * A problem might not have optimal substructure. 
        * This can happen when subproblems are not independent - the use of resources in the solution to one subproblem renders them unavailable for the other subproblem e.g. longest path problem. 
        * The classical travelling salesman problem. Let the DP state domain be (k,l)->D where D is the minimal length of the simple path going through exactly k cities with 0-th city being the first one and l-th city being the last one. The optimal substructure property in such a DP does not hold: given the shortest tour its subpath with fixed last city and overall number of cities is not always the shortest. Therefore the proposed DP would be wrong anyway.
    * The optimal subscructure constraints the problem space. How many subproblems need to be solved now?

* Consider the problem space. How many different subproblems there are?  
* (combinatorial insight). Do we have overlapping subproblems? 
    * [Solve via DP](/dp) 



-------

* Bottom Up: 

    * Start from the base case and solve incrementally harder problems. Figure out how you can use an easier instantiation of the problem to solve the current, harder problem. This might require a stronger (or different) specification for the recursive steps, and might make the recursive decomposition simpler or more elegant.

    * Example: Permutations
        * Base case is the permutation of singletons {1}, {2}, {3}…which are singletons themseleves
        * Using the singleton solution,  generate the the permutations of {1, 2}. 
        *  Using the solution for doubles generate the permutations of triplets.




-----------

# Analyse correctness and performance
    
* Draw the recursion tree.
* Prove using induction
* Prove running time using substitution method


-----


# Common Pitfalls

* Missing basecase
* Recursion does not converge
* Excessive memory requirement
* Excessive computations
* Static variables and aliases to mutable data are very unsafe for recursion, and lead to insidious bugs. When you’re implementing recursion, the safest course is to pass in all variables, and stick to immutable objects or avoid mutation.

References for Recursion:
- [MIT Software Construction Lecture on Recurson](http://web.mit.edu/6.031/www/fa18/classes/14-recursion/)
- [Solving Permutation in Interview Step-by-Step](https://reginaldlong.com/f-recursion-your-guide-to-overcoming-your-worst-interview-related-fear-9/)
- [Recursion, closure and iteration](https://blog.kwyn.io/Recursion-closure-and-iteration/)

Practice Problems:
- [Dijkstra on N Queens](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD03xx/EWD316.9.html)
- [Recursion to generate permutations](https://stackoverflow.com/questions/7537791/understanding-recursion-to-generate-permutations
https://stackoverflow.com/questions/4240080/generating-all-permutations-of-a-given-string)


----------


**What is tail recursion?**
* If there is no computation left to be done in the calling function after the recursive function call, then it is called tail recursion. Some recursions could be rewritten as tail recursions (with the help of accumulator pattern?).

**What are the benefits of tail recursion?**

* The advantage of tail recursion is we don't have to store the value in a stack. So implementation wise, it saves us some memory.  A tail recursive function can be implemented without a stack, but not all programs can be implemented without a stack. "Stackless programs correspond to a finite state machine, and an FSM is capable only of implementing regular grammars. "
* There are reasons other than memory that you might want to convert a function to be tail recursive.  For example, a tail-recursive function can easily be changed to let you store an intermediate state of computation as a value, so that the computation can be suspended and resumed later.  This can be used to implement cooperative multitasking; in some sense this is the theoretical basis for frameworks like node.js and Twisted.

**How to convert a recursive solution to an iterative solution?**



Recursive function execution flow can be represented as a tree.  A recursive logic can be executive by a loop, which uses a data-structure to traverse the recursive tree. Depth-first traversal can be done using a stack, breadth-first traversal can be done using a queue.  Thus, you can convert any recursive function into an iterative function by adding a stack; that's how computers generally implement recursion. 

The stack is used to store the work you can't do right away. For example, the main reason for having a call stack to store information about the active subroutines of a computer program is to keep track of the point to which each active subroutine should return control when it finishes executing. An active subroutine is one that has been called but is yet to complete execution after which control should be handed back to the point of call. Such activations of subroutines may be nested to any level (recursive as a special case), hence the stack structure.

The preorder case is easiest, because there's only one kind work you have to defer -- processing a child node.The stack has to store nodes to visit and nodes to process, but a node to process is always the right child of a node just visited, 

Each time a recursive call is made in the algorithm, push the necessary information onto your stack. ii) When you complete processing at this deeper level, pop the simulated stack frame and continue processing in the higher level at the point dictated by the return address popped from the stack. iii) Use an iterative control structure that loops until there are no return addresses left to pop from the stack.

We can convert any recursive function to tail recursive function with continuation (by construct the closure for continuation lambda function) (But here we still have to spend some memory to construct closures)

- [Stacks and Recursion](https://www.scribd.com/document/40673346/Stacks-and-Recursion-Lab)
- [Stacks and Recursion](https://web.archive.org/web/20120227170843/http://cs.saddleback.edu/rwatkins/CS2B/Lab%20Exercises/Stacks%20and%20Recursion%20Lab.pdf )
- [Recursion to Iteration](https://cs.stackexchange.com/questions/67897/iteration-can-replace-recursion)
- [Recursion to Iteration 2](https://stackoverflow.com/questions/159590/way-to-go-from-recursion-to-iteration)
- [Recursion to Iteration 3](http://blog.moertel.com/tags/recursion-to-iteration%20series.html)



**Are tail recursion and iteration the same?**

Any tail recursive function can be made into a loop (example: [Word Wrap](http://blog.code-cop.org/2011/08/word-wrap-kata-variants.html))

Tail recursion is different  from iteration. They're the same in terms of what the machine is doing, assuming your compiler does tail-call optimization: The difference between tail recursion and iteration is whether or not the target of a jump happens to be the start of a function or not. 

But that's not the same as being "the same" - they present a very different abstraction to the programmer. In a sane language, you expect an error to give you a stack trace of functions that have been called. If you treat recursion as iteration, then either you'll have to omit some function calls from the stack, or your algorithm won't work in constant space anymore. Either violates some expectations of the programmer.


<img src='/recur_iter' title='recur_iter' width='600px' />  

References:
- [How does compiler optimize tail recursion?](https://www.quora.com/How-does-compiler-know-whether-the-recursion-is-a-tail-recursion-or-not-and-how-does-it-optimize-tail-recursion)
- [What is tail recursion](https://cs.stackexchange.com/questions/6230/what-is-tail-recursion)


-------

**How to think of an iterative solution?**

**What is an iterative function?**
- An iterative function is one that loops to repeat some part of the code, as opposed to recursive function is one that calls itself again to repeat the code.

**How to build an iterative solution?**
* Step 1: Form a loop:
    * Each loop repeats a piece of code.
    * the state of the system is the input (S) and there’s an output (S’). When the terminal conditions have been reached, the final state is the desired state.
    * In the loop for iteration, think of starting condition,  terminating condition, and loop invariant.
* Step 2: Find out what to run in the code
    * How to find out what to run in the code?
        * Solve the first few steps (e.g Tower of Hanoi disk movements or the order of visiting nodes in a tree traversal) by yourself. Notice any recurrent patterns (e.g. Every odd move involves the smallest disk. Or Disks always move in the same direction in which they first moved, or in inOrderTraversal, after processing(i), we always process successor(i)) . Prove those patterns exist.
        * Think of which variables store the state of the system (e.g. in tree traversal,  a currentNode whether the current node has been visited e.g.)
        * Think of terminal conditions:  run a loop finite number of times (n) or when a state reaches a certain value (e.g. counter reaching n, current reaching null etc.)
* Step 3: Run your code through test cases: especially terminal conditions


---

**How to verify correctness of an iterative solution?**

* One can prove that this procedure results in a desired state via a loop invariant.
    * Techniques: Mathematical Induction or
    * Reframe the problem into a different representation if possible. The difficulty of a problem can be completely determined by the framing of the problem.
* A loop invariant is a predicate (a statement that is either true or false) with the following properties:
    * It is true upon entering the loop the first time.
    *  If it is true upon starting an iteration of the loop, it remains true upon starting the next iteration.
    * The loop terminates, and the loop invariant plus the reason that the loop terminates gives you the property that you want.

    * Example.  Consider this loop to sum the first n elements of an array a, where n is a positive integer:

```
sum = 0
i = 0
while i < n
    sum = sum + a[i]
    i = i + 1

```

* Here's the loop invariant: 

    Upon entering an iteration of the loop, `sum = a[0] + a[1] + a[2] + ... + a[i-1].`  

    Now let's see how the three properties hold for this loop invariant.
    
* Upon entering the first iteration, i = 0.  The sum a[0] + ... + a[i-1] is empty, since i-1 = -1.  The sum of no terms is the identity 0 for addition.  Check.
* Upon entering an iteration for a value of i, suppose that the loop invariant is true, so that `sum = a[0] + a[1] + a[2] + ... + a[i-1]`.  The iteration adds a[i] into sum and then increments i, so that the loop invariant holds entering the next iteration.  Check. 
* The loop terminates once i = n.  According to the loop invariant, `sum = a[0] + a[1] + a[2] + ... + a[n-1].`  
    Check: sum is indeed the sum of the first n elements of the array.
    
* Now, this example is pretty trivial.  If you were writing this loop, I doubt that you'd formally reason about it in this way.  But this reasoning is exactly what was in the back of your mind, whether or not you realized it.  Loop invariants help you understand and prove correct more complicated loops. If loop invariants remind you of mathematical induction, they should.  The first property maps to the basis of the induction, and the second property is like the inductive hypothesis.  It's the third property that's a bit different, since most inductive proofs don't have a termination condition.


- [Loop invariants by Thomas Cormen](https://www.quora.com/What-can-I-learn-right-now-in-just-10-minutes-that-could-improve-my-algorithmic-thinking/answer/Thomas-Cormen-1?srid=uSJD&share=7af2e616)

--------

    

