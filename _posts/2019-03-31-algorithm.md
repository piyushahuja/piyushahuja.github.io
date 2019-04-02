---
layout: post-journal
title: Design an algorithm
date:   2019-03-31 09:00:11
tag:
categories: guide
excerpt:
permalink: /algorithm
comments: false


---



**How to think of a recursive solution?**



**What is recursion?**

* Recursion is when a function calls itself.  
> Recursion is the root of computation since it trades description for time.

**When to use recursion?**

* Hints that recursion would be useful: 
    * the data has a recursive structure: it can be defined recursively (e.g. trees, linkedlist, natural numbers)
    * the problem is defined recursively.
        * divide and conquer
        * dynammic programming

* If a function calls itself to solve a subproblem, two things had better happen: 
    * The subproblem has to be simpler than the original problem 
    * Some subproblems have to be so simple that you can solve them without recursion (bottoming out)

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

     * Figure out what you are trying to compute. 
        * Most of DP problems can be divided into two types: optimization problems and combinatoric problems.  Write down a sentence about what they are computing as a way to verify that "what's in the head" actually makes sense. 
            * The optimization problems require you to choose some feasible solution so that the value of goal function is minimized (or maximized). You are often trying to either minimize or maximize a decision. You are given two (or more) options at any given point and you have to decide which is more optimal for the problem you're trying to solve. These decisions, however, are based on previous choices you made. . In case of minimization problem the neutral value is positive infinity: since it is greater than any number, all the recurrent formulas would prefer a case with finite value to such a neutral element. In other words, the state with neutral value result can be thought of as an impossible state. Note that for maximization problem negative infinity is a neutral element.
            * Combinatoric problems request the number of ways to do something or the probability of some event.  There is also a neutral value for combinatoric problem. Since combinatoric problem uses summation, the neutral element is zero. The DP results in combinatoric case usually represents number of ways to do smth, so if the result is zero than there is no way to do it. The neutral result value means that the case is impossible. It may be useful to fill DP results array with zero values, though it is usually done automatically. In case of combinatorics it is important that each possible way is counted and that no way is counted more than once. The second condition is sometimes difficult to satisfy. Sometimes it help to keep the base case of counting as 1 (e.g. In coin combinations, this numbers the number of ways to make amount 0 using all the coins is 1, while in minCoins, the minimum coins needed to make zero would be 0.). 
            *  In case of combinatorics it is important that each possible way is counted and that no way is counted more than once. The second condition is sometimes difficult to satisfy.
        * Example: Zackendorf numbers.  z(n,k) is ….. representation of n in fibonacci base excluding the first k-1 fibonacci numbers? Or whether 1 or 0 is used in the nth index in the unique representation?
        * Example: "What is the best profit we can get from selling the wines with prices stored in the array p, when the current year is year and the interval of unsold wines spans through [be, en], inclusive?"

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
    * Usually this is a reframing which requires a pre-computation   
        * Example: QuickSort
        *      


* Once you've selected a subproblem decomposition, write down what the function computes. 
    * Most of DP problems can be divided into two types: optimization problems and combinatoric problems.  Write down a sentence about what they are computing as a way to verify that "what's in the head" actually makes sense. 

        * The optimization problems require you to choose some feasible solution so that the value of goal function is minimized (or maximized). You are often trying to either minimize or maximize a decision. You are given two (or more) options at any given point and you have to decide which is more optimal for the problem you're trying to solve. These decisions, however, are based on previous choices you made. . In case of minimization problem the neutral value is positive infinity: since it is greater than any number, all the recurrent formulas would prefer a case with finite value to such a neutral element. In other words, the state with neutral value result can be thought of as an impossible state. Note that for maximization problem negative infinity is a neutral element.

        * Combinatoric problems request the number of ways to do something or the probability of some event.  There is also a neutral value for combinatoric problem. Since combinatoric problem uses summation, the neutral element is zero. The DP results in combinatoric case usually represents number of ways to do smth, so if the result is zero than there is no way to do it. The neutral result value means that the case is impossible. It may be useful to fill DP results array with zero values, though it is usually done automatically. In case of combinatorics it is important that each possible way is counted and that no way is counted more than once. The second condition is sometimes difficult to satisfy. Sometimes it help to keep the base case of counting as 1 (e.g. In coin combinations, this numbers the number of ways to make amount 0 using all the coins is 1, while in minCoins, the minimum coins needed to make zero would be 0.).  

    * Example: Zackendorf numbers 
        - z(n,k) is the complete representation of n in fibonacci base excluding the first k-1 fibonacci numbers. 
        - z(n, k) representes whether 1 or 0 is the kth index in the unique fibonacci representation, i.e. whether the kth fibonacci number is used. 
    * Example: "What is the best profit we can get from selling the wines with prices stored in the array p, when the current year is year and the interval of unsold wines spans through [be, en], inclusive?"


-------

* Bottom Up: 

    * Start from the base case and solve incrementally harder problems. Figure out how you can use an easier instantiation of the problem to solve the current, harder problem. This might require a stronger (or different) specification for the recursive steps, and might make the recursive decomposition simpler or more elegant.

    * Example: Permutations
        * Base case is the permutation of singletons {1}, {2}, {3}…which are singletons themseleves
        * Using the singleton solution,  generate the the permutations of {1, 2}. 
        *  Using the solution for doubles generate the permutations of triplets.




-----------

# Tools for analysis
    
* Draw the call stack, recursion tree.
* Prove using induction, substitution method


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


**What is tail recursion?**
* If there is no computation left to be done in the calling function after the recursive function call, then it is called tail recursion. Some recursions could be rewritten as tail recursions (with the help of accumulator pattern?).

**What are the benefits of tail recursion?**

* The advantage of tail recursion is we don't have to store the value in a stack. So implementation wise, it saves us some memory.  A tail recursive function can be implemented without a stack, but not all programs can be implemented without a stack. "Stackless programs correspond to a finite state machine, and an FSM is capable only of implementing regular grammars. "
* There are reasons other than memory that you might want to convert a function to be tail recursive.  For example, a tail-recursive function can easily be changed to let you store an intermediate state of computation as a value, so that the computation can be suspended and resumed later.  This can be used to implement cooperative multitasking; in some sense this is the theoretical basis for frameworks like node.js and Twisted.

**How do I convert a recursion to tail recursion?**

We can convert any recursive function to tail recursive function with continuation (by construct the closure for continuation lambda function) (But here we still have to spend some memory to construct closures)

**Are tail recursion and iteration the same?**

Any tail recursive function can be made into a loop (example: [Word Wrap](http://blog.code-cop.org/2011/08/word-wrap-kata-variants.html))

Tail recursion is different  from iteration. They're the same in terms of what the machine is doing, assuming your compiler does tail-call optimization: The difference between tail recursion and iteration is whether or not the target of a jump happens to be the start of a function or not. 

But that's not the same as being "the same" - they present a very different abstraction to the programmer. In a sane language, you expect an error to give you a stack trace of functions that have been called. If you treat recursion as iteration, then either you'll have to omit some function calls from the stack, or your algorithm won't work in constant space anymore. Either violates some expectations of the programmer.

**Why recursion? Why not?**
two common reasons for using recursion:
* The problem is naturally recursive (e.g. Fibonacci)
* The data is naturally recursive (e.g. filesystem)
reason to use recursion is to take more advantage of immutability. In an ideal recursive implementation, all variables are final, all data is immutable, and the recursive methods are all pure functions in the sense that they do not mutate anything. The behavior of a method can be understood simply as a relationship between its parameters and its return value, with no side effects on any other part of the program.
recursive algorithms map very directly to mathematical induction, which he suggests is the only means to intellectually prove our loops correct. (I don't suggest that we must prove our code correct, but that the easier we make it for ourselves to do so, the more likely it is that our code is correct.)


Recursion can lead to stack overflow errors. downside of recursion is that it may take more space than an iterative solution. Building up a stack of recursive calls consumes memory temporarily, and the stack is limited in size, which may become a limit on the size of the problem that your recursive implementation can solve.


References:
- [How does compiler optimize tail recursion?](https://www.quora.com/How-does-compiler-know-whether-the-recursion-is-a-tail-recursion-or-not-and-how-does-it-optimize-tail-recursion)
- [What is tail recursion](https://cs.stackexchange.com/questions/6230/what-is-tail-recursion)


-------

**How to think of an iterative solution?**

**What is an iterative function?**
- An iterative function is one that loops to repeat some part of the code, and a recursive function is one that calls itself again to repeat the code.

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


**How to convert a recursive solution to an iterative solution?**

Recursive function execution flow can be represented as a tree.  A recursive logic can be executive by a loop, which uses a data-structure to traverse the recursive tree. Depth-first traversal can be done using a stack, breadth-first traversal can be done using a queue.  Thus, you can convert any recursive function into an iterative function by adding a stack; that's how computers generally implement recursion. 

The stack is used to store the work you can't do right away. For example, the main reason for having a call stack to store information about the active subroutines of a computer program is to keep track of the point to which each active subroutine should return control when it finishes executing. An active subroutine is one that has been called but is yet to complete execution after which control should be handed back to the point of call. Such activations of subroutines may be nested to any level (recursive as a special case), hence the stack structure.

The preorder case is easiest, because there's only one kind work you have to defer -- processing a child node.The stack has to store nodes to visit and nodes to process, but a node to process is always the right child of a node just visited, 

Each time a recursive call is made in the algorithm, push the necessary information onto your stack. ii) When you complete processing at this deeper level, pop the simulated stack frame and continue processing in the higher level at the point dictated by the return address popped from the stack. iii) Use an iterative control structure that loops until there are no return addresses left to pop from the stack.



- [Stacks and Recursion](https://www.scribd.com/document/40673346/Stacks-and-Recursion-Lab)
- [Stacks and Recursion](https://web.archive.org/web/20120227170843/http://cs.saddleback.edu/rwatkins/CS2B/Lab%20Exercises/Stacks%20and%20Recursion%20Lab.pdf )
- [Recursion to Iteration](https://cs.stackexchange.com/questions/67897/iteration-can-replace-recursion)
- [Recursion to Iteration 2](https://stackoverflow.com/questions/159590/way-to-go-from-recursion-to-iteration)
- [Recursion to Iteration 3](http://blog.moertel.com/tags/recursion-to-iteration%20series.html)

--------------------------


Dynamic Programming


* It is often useful to fill the DP results array with neutral values before calculating anything. The neutral value is a result which does not affect the problem answer for sure
   
* Consider the problem space. How many different subproblems there are? 
* Could we compute the solution to the problem from the subproblems? Can you get rid of some parameters? How do you represent a subproblem?
    * Would brute force be exponential?
    *  (Optimal Substructure). Consider if the problem has optimal substructure: an optimal solution uses the optimal solution to a subproblem. 
        * A problem might not have optimal substructure. 
            * This can happen when subproblems are not independent - the use of resources in the solution to one subproblem renders them unavailable for the other subproblem e.g. longest path problem. 
            * The classical travelling salesman problem. Let the DP state domain be (k,l)->D where D is the minimal length of the simple path going through exactly k cities with 0-th city being the first one and l-th city being the last one. The optimal substructure property in such a DP does not hold: given the shortest tour its subpath with fixed last city and overall number of cities is not always the shortest. Therefore the proposed DP would be wrong anyway.
        * The optimal subscructure constraints the problem space. How many subproblems need to be solved now?
* Could we compute the solution to the problem from the subproblems? What would need to be done post recursion, or pre-recursion?




* Figure out the recursion formula. 
(combinatorial insight). Do we have overlapping subproblems? 

* Then consider an iterative bottom up approach (DP), or a recursive memoized approach (memoization). Make recursion tree to illustrate the difference.   Memoization is an optimization of a top-down, depth-first computation for an answer. DP is an optimization of a bottom-up, breadth-first computation for an answer. (Question: What about bottom-up, depth-first or top-down, breadth first? Where do they fit into the space of techniques for avoiding recomputation by trading off space for time?)

* First write the computation and observe whether it fits the DAG pattern; if it does, use memoization. Only if the space proves to be a problem and a specialized memo strategy won’t help—or, even less likely, the cost of “has it already been computed” is also a problem—should you think about converting to DP. And when you do, do so in a methodical way, retaining structural similarity to the original. 
* It can be easier to think using a forward strategy (i.e. I know the value at a given cell in the DP table and I want to see what other cells depend on it). This approach makes it easier to separately consider the cases that make up the recursion. Otherwise, you might be tempted to prematurely mix all the cases together in some gigantic formula (and there's a good chance that you'll get lost before you find the correct formula). Next, think of how to initialize your solution and how to obtain the desired result from the DP table.
    * We now have an oriented graph of dependencies (value of cache[be][en] depends on cache[be][i]). This graph is directed and acyclic. Terminal vertices (with no outgoing edges) represent the base case entries, which we already calculated. Therefore it is sufficient to topologically sort the graph and process the vertices in the order from the terminal vertices.
    *  If a problem can be solved by dynamic programming, there is a directed acyclic graph of states and dependencies between them. There is a state that interests us. There are also base states for which we know the answer right away.  We can traverse that graph from the vertex that interests us to all its dependencies, from them to all their dependencies in turn, etc., stopping to branch further at the base states. This can be done via recursion.  
        * A directed acyclic graph can be viewed as a partial order on vertices. We can topologically sort that graph and visit the vertices in sorted order. Additionally, you can find some simple total orderwhich is consistent with your partial order.
        * Also note that we can often observe some structure on states. For example, the states can be often expressed as integers or tuples of integers. So, instead of using generic caching techniques (e.g., associative arrays to store state->value pairs), we may be able to preallocate a regular array which is easier and faster to use. https://stackoverflow.com/questions/22918242/is-dynamic-programming-backtracking-with-cache
        *  "Forward DP": When we visit a state u, we look at all states v that depend on it and account for u in each of these states 
for u = 1, 2, 3, ..., n - 1:
    add F[u] to F[u + 1]
    add F[u] to F[u + 2]
the imperative code cannot be readily expressed by a mathematical formula. 
        *  The paradigm of forward DP style is to iterate through all the DP states and from each state perform some transitions leading forward to other states. Each transition modifies the currently stored result for some unprocessed states. When the state is considered, its result is already determined completely. The forward formulation does not use recurrent equations, so it is more complex to prove the correctness of solution strictly mathematically. The recurrent relations used in forward-style DP are obtained by considering one partial solution for the state and trying to continue it to larger states. To perform forward-style DP it is necessary to fill the DP results with neutral values before starting the calculation. One interpretation of the value stores in the state is the “best solution to the subproblem till now"
        * we have to rewrite the computation to express the delta from each computational tree/DAG node to its parents. We need a means for addressing/naming those parents (which we did not need in the top-down case, since this was implicit in the recursive call stack). This leads to inventions like DP tables, but people often fail to understand why they exist: it’s primarily as a naming mechanism (and while we’re at it, why not make it efficient to find a named element, ergo arrays and matrices).  In contrast, in DP it’s easier to save space because you can just look at the delta function to see how far “back” it reaches; beyond there lies garbage, and you can come up with a cleverer representation that stores just the relevant part (the “fringe”). Once you understand this, you realize that the classic textbook linear, iterative computation of the fibonacci is just an extreme example of DP, where the entire “table” has been reduced to two iteration variables.  
    * From practical point of view, you don't want to explicitly create the graph of dependencies and sort it. Instead you want to find a simple invariant between the dependencies and iterate states based on that invariant. For this problem the invariant is: if cache[a][b] depends on cache[x][y], then (b-a) > (y-x).  In other words, it is sufficient to iterate on the values be and en in such a way, that the distance between be and en will increase. In this way we will never try compute the value of cache[a][b] before we computed cache[x][y]. (Another example, incline change: the recursion satisfies the weak ordering isplaystyle R(n,m)<R(x,y)\iff n\leq x,m\leq y,(n,m)\neq (x,y)}.https://www.quora.com/How-do-I-figure-out-how-to-iterate-over-the-parameters-and-write-bottom-up-solutions-to-dynamic-programming-related-problems
* How to reconstruct the optimal solution in optimisation DP problems? 
    * Starting from end state, reconstruct using relation between states to figure out previous state
    * Caching the previous state (e.g. previous amount made with min coins) and any other data (e.g. coin value added) at the time the decision is made to select one state. This is better because:
        * No code repetition
        * Faster. Co computation repetition

- [Dynamic Programming vs Memoization](https://blog.racket-lang.org/2012/08/dynamic-programming-versus-memoization.html)

The DP solution iterates through the states in some particular order set by coder, while memoization iterates through them in order of depth-first search

**Why use Bottom Up DP?**

Pro: 
* Possible to make memory optimisations by freeing up space. (Analyse what subproblem solutions need to be saved at any point). can more easily save space by disposing of unnecessary sub-computation results
* No Cache Checking Overhead. Has no need to check whether a computation has been done before doing it—the computation is rewritten to ensure this isn’t necessary
Cons:
* Difficult to understand and prone to bugs: forces change in desription of the algorithm, which may introduce errors and certainly introduces some maintenance overhead
* Does unnecessary sub-computations (cannot avoid them, and may waste the space associated with storing those results).
* Has a space complexity that depends on picking a smart data storage strategy


**Why use memoization?**

Pros
*  leaves computational description unchanged (black-box)
* avoids unnecessary sub-computations (i.e., saves time, and some space with it).  Only necessary subproblems are solved.

Cons
* Possible Stack Overflow due to recursion
* hard to save space absent a strategy for what sub-computations to dispose of.  Extra space needs to be maintained, since we do not know a priori which subproblems do not need to be solved.
* Cache checking overhead. must alway check whether a sub-computation has already been done before doing it (which incurs a small cost)
* has a time complexity that depends on picking a smart computation name lookup strategy




Running time:

Consider drawing the subproblem graph for bottom up solution. 
Count the number of subproblems using parameters space. Find out running time of each. See if any parameters have stricter bounds. 
Use substitution (guessing) method to solve recurrence. 


References:
- https://dev.to/nikolaotasevic/dynamic-programming--7-steps-to-solve-any-dp-interview-problem-3870


- http://courses.csail.mit.edu/6.01/spring07/lectures/lecture4.pdf

How long do we expect this program to run? Answering that question in detail requires a lot of information about the particular computer we’re going to run it on, what other programs are running at the same time, who implemented the Python interpreter, etc. We’d like to be able to talk about the complexity of programs without getting into quite so much detail.

Thinking about the order of growth of the running time. That is, as we increase something about the problem, how does the time to compute the solution increase?
In actual fact, on some particular computer (with no other processes running), this program would take some time R(n), to run on an input of size n.
For a process that uses resources R(n) for a problem of size n, R(n) has an order of growth Θ(f(n)) if there are positive constants k1 and k2 independent of n such that k1f(n) ≤ R(n) ≤ k2f(n) , for n sufficiently large.

http://www.pgbovine.net/programming-interview-tips.htm


----
