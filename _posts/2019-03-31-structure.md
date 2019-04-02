---
layout: post-journal
title: Structure a technical interview 
date:   2019-03-31 09:00:11
tag:
categories: guide
excerpt:
permalink: /strusture
comments: false




---



* Make the three columns: 
    * Approach
    * Implementation
    * Assumptions. 
        * After listing assumptions, discuss the approach, graphically and in pseudocode 
        * Highlight and point to each step in the pseudocode as you write the code. 

* Be proficient.  Don’t be a candidate from whom the answers have to be wrestled out. Quickly recognize the type of problem and give a high-level solution.  Be Fast with trivial problems. 
* For non-trivial problems, **clarify every single thing,  no matter how small.**
    * This is the time to be pedantic. Clarify every ambiguity you can think of. Ask questions even if you’re almost sure you know the answers. 
    * It gives you a chance to come up with edge cases and fully spec the problem (seeing how you handle edge-cases is one of the main things that interviewers look for when evaluating an interview)
    * It gives you a minute to collect your thoughts before you need to start solving the problem.  
    * Rephrase a sentence, say it aloud, and ask for confirmation. (Optional: Validate assumptions of data structure and complexity beforehand)
    * **Work Through Examples.**
        * One way to generate questions is to start working through small examples and asking if the answer you expect agrees with the interviewer. It helps to visualize first what the problem is. Bring up specific examples of input, and make sure you are correct about the expected output. 
            * If it’s a problem related to trees, I would start with the null case, one node, two nodes, three nodes. This can help you generalize a solution.
    * Edge cases:  Ask about edge cases. For example, should adding (Key, null) delete existing key? Should null keys be allowed?
        *  Partition and find test cases. Example: Delete a course named 6.000 from list. Partition:   subjects.size: 0, 1, n * contents: no 6.xx, one 6.xx, all 6.xx. * position: 6.xx at start, 6.xx in middle, 6.xx at end 
    * How would clients call this? How to expose elements of the data structure?  implementing the iterable interface by providing an iterator(). Ask if you should design anticipating future requirements in mind, or just solve the problem? e.g. in Diamond Kata, might the client want to start from a different character than A tomorrow?
    * * here are some examples of questions you might ask:
    *     * Is this in a user or customer facing system?
    *     * How often will this be called?
    *     * What’s the typical size of an input? What’s the largest size of an input?
    *     * How is the process that this will be a part of run? Is it a service? Is it run on a schedule?
    * - **Technical Knowlegde**: 
    *     - If you know more, show it. There were multiple examples where you would answer a question and mention some other knowledge I had but explain that I didn’t have time in an interview to fully implement that solution. 
    *         - Answering a question about strings? Show off your Unicode knowledge with your solution or explain how to support Unicode. 
    *         - Implementing a private method? Talk about the Objective-C conventions for methods. Updating a table view? Talk about the different animations you can support. 
    *         - Don’t bring something up if you can’t talk all about it, but if you can, it allows you to show knowledge outside of the narrow window provided by the question and gives you a leg up on anyone that sticks strictly to the beaten path.
    *     -  For example, if someone asks you to “write the code to reverse a linked list”, what they're looking for is:
    *         -  Can you write actual code in some language? (“write the code”)
    *         - Do you know what a linked list is?
    *         - Do you know how to use pointers and loops? (required elements of the solution)
    *         -  Do they didn’t think about any corner case?
    *         -  Do they make a lot of assumptions about the problem without clarifying details?
    *         -  Do they have any communication issues - both in terms of their communication skills in  general and in terms of simply struggling with English?
    *         -  Do they poorly incorporated  feedback? Were they good at picking my hints?
    *         -  Were they too slow on mentally switching from one idea to the other one and tried to stick to the old idea even after being directly told that this idea is wrong?
    *         -  Comfort with pointer based loops and recursion. The good programmers stand up, write the answer on the board, sometimes adding a clever fillip (Ooh! Unicode compliant! Nice!), and it takes thirty seconds, and now I have to decide if they’re really good, so I bring out the big guns: recursion and pointers. The best programmers all have an easy aptitude for dealing with multiple levels of abstraction simultaneously. In programming, that means specifically that they have no problem with recursion (which involves holding in your head multiple levels of the call stack at the same time) or complex pointer-based algorithms (where the address of an object is sort of like an abstract representation of the object itself).   Being able to reason recursively or inductively is important for many areas of computing, including using heirarchical data representations (e.g. XML), distributed computing, searching, and sorting. 
    *     * Are there any constraints (memory usage, execution time, etc.)?
    *  Input validation is also another question generator. “For this example, can I use a small set of data?” “Can I assume the input array is sorted?”
    * https://web.stanford.edu/class/cs9/sample_probs/Anagrams.pdf
    * I remember one interview solution that relied entirely on all the inputs being positive integers, but I almost failed the interview because I couldn’t figure out what to do when I got zero as an input. If I would have read the problem more carefully, I would have realized that zero was not included in the possible inputs.
    * Should I use Generics or assume int/string etc.?
    * Should I wrap my Node class in another class?
    * Should I quickly get something running, or follow a methodology (say TDD) or optimise for code reuse and elegance (say OOD)? Approaching the problem from a test driven perspective first might seem the logical way, but what about just writing the code to solve the problem, holding back on the test driven approach until you're asked how you could make it better, let the conversation take it. Some places still don't understand what test driven really means, so you might come across as too advanced. If you want to find out about whether they value this skill set, aim your questions to them around finding out about their development process. Do you want me to follow Test Driven Methodology? (I usually do, but given time constraints).
    * For phone screens, I use a piece of paper (mentioning I am doing so to the interviewer). write down thought process on paper, reading aloud as I write it down. What I have on paper is usually just for me so that I don’t lose my train of thought, and before I start coding, I put down what you are going to do briefly as comments in the shared screen referring to the notes.
* Explain Thought Process Explain your thought process before you begin coding. 
    * Explain your thinking out loud as much as possible, but don’t talk too much if it distracts you from finding the solution. Silence can be awkward in an interview, but you can control it. Saying “I’ll take a second to look this over” can help break the silence,, and will allow you to concentrate on solving the problem rather than finding the right words to say. . Be sure to talk to the interviewer about your thinking and intentions. It might slow you down a little at the beginning, but communication is more important than anything and it only helps with the interview. Do not recite the solution as the interviewer would almost certainly see through it. For problems you are solving completely from scratch, documenting the steps while communicating your thought process is not a trivial task. I have found doing this on a whiteboard is a tad bit easier, especially if the problem involves a 2D data structure. Even in cases where you are not stuck, always enunciate your approach, explaining your rationale. If some part of your solution is coming from intuition, mention so. You will leave room for very few questions from the interviewer.
    * If you get stuck finding a solution and if you had communicated your thought process, continue to think aloud and explain the problem with your approach. Thereafter, try to salvage your current approach.
    * If that fails, go back to the drawing board and try to find another solution. If all else fails, solve the problem with a sample input without thinking of an algorithm, and once you have solved the problem, try to automate your approach. Always look out for questions/comments from the interviewer—they may actually be a hint and may prove to be a lifeline.
    * Even if you don’t solve the problem, you can still impress your interviewer with your thinking. Even if they reject you, the feedback in their record can be positive and you may get a chance later down the li
    * Once you think you have a solution, describe it out loud. Analyze the time and space complexity of your potential solution
* Point out the obvious naive solution. While you’re explaining this, you should be thinking of how to improve it. Candidates often skip the brute-force step, assuming that the brute-force solution to the problem is too obvious, or wrong. This is a mistake. Make sure that you always give a solution to the problem you’ve been asked (even if it takes exponential time, or an NSA super computer). When you’ve described a brute-force solution, ask the interviewer if they would like you to implement it, or come up with more efficient solution. Normally they will tell you to come up with a more efficient solution. Next, you should talk through the simplest brute-force solution to the problem that you can think of. You should talk, rather than jump right into coding, because you can move faster when talking, and it’s more engaging for the interviewer. If the interviewer is engaged, they will step in and offer pointers. If you retreat into writing code, however, you'll miss this opportunity.
* Be quick to discern hints and go down a path. Interviewers usually have a series of questions ready to guide the candidate down a particular path in the design of this data structure or block of code, because it’s such a big question, and they can often tell how smart the candidate is by how far they get down that path in a fixed amount of time.    I don’t really mind giving programming problems that are too hard, as long as the candidate has some chance of starting out, and then I’m happy to dole out little hints along the way, little toeholds, so to speak. Example: Project a triangle onto a plane, a typical graphics problem, and I don’t mind helping them with the trig (SOH-CAH-TOA, baby!), and when I ask them how to speed it up, I might drop little hints about look-up tables. Notice that the kinds of hints I’m happy to provide are really just answers to trivia questions—the kinds of things that you find on Google.  They give hints, they respond to ideas, and they generally guide the process. 
* The process for the more efficient solution is the same as for the brute force. Again talk, don’t write code, and bounce ideas off of the interviewer. Hopefully, the question will be similar to something you’ve seen, and you’ll know the answer. If that is not the case, it’s useful to think of what problems you’ve seen that are most similar, and bring these up with the interviewer. Most interview questions are slightly-obscured applications of classic CS algorithms. The interviewer will often guide you to this algorithm, but only if you begin the process. 
    * Get unstuck.
    * Sometimes you'll get stuck. Relax. It doesn't mean you've failed. Keep in mind that the interviewer usually cares more about your ability to cleverly poke the problem from a few different angles than your ability to stumble into the correct answer. When hope seems lost, keep poking.
    * Draw pictures. Don't waste time trying to think in your head—think on the board. Draw a couple different test inputs. Draw how you would get the desired output by hand. Then think about translating your approach into code.
    * Solve a simpler version of the problem. Not sure how to find the 4th largest item in the set? Think about how to find the 1st largest item and see if you can adapt that approach.
    * Think about the bounds on space and runtime. If you're not sure if you can optimize your solution, think about it out loud. For example:
    * * "I have to at least look at all of the items, so I can't do better than O(n)O(n)."
    * * "The brute force approach is to test all possibilities, which is O(n^2)O(n2)."
    * * "The answer will contain n^2n2 items, so I must at least spend that amount of time."
    * Think out loud more. Say what you know. Say what you thought might work and why it won't work. You might realize it actually does work, or a modified version does. Or you might get a hint.
    * Wait for a hint. Don't stare at your interviewer expectantly, but do take a brief second to "think"—your interviewer might have already decided to give you a hint and is just waiting to avoid interrupting.
* Write the pseudocode first. Before you start coding,  put down what you are going to do briefly as comments in the shared screen referring to the notes. 
* List things the algorithm needs to do at the bare minimum. On the whiteboard, write down a list of the things the algorithm needs to do.  Focus on the smallest amount of code that can provide the answer that is being requested.
    * Smaller code is easier for the reviewer to understand (if you're doing something tricky).
    * Employers are looking for developers to solve problems. So, they're keen to know if you can take a requirement, run with it and turn it in to a solution
* Do not do anything that lets your mind wanders away from the problem you've been tasked (e.g. Do not start by building up infrastructure around the problem. Do not start thinking about nugget packages you need for the problem.)
    *  Point out that you’re leaving a code comment for error handling.  (Handling of Exceptions, Try-Catch blocks)
        * Example: Validating arguments: Throw Nullpointer exception, or Illegalargument exception or  IllegalState exception. common validations can be factored out into utility classes. The interviewer might say that you can assume that the parameters you’re getting already passed a validation. However, it is still important to bring this up to show that you are aware of error cases and quality.
        *  The interviwer might say, “That’s a good point. How would you handle it? Would you throw an exception? Or return a specific value?” This can make for a good short discussion about code quality. Mention a few error cases.
    * Mention you’d use final liberally if you were designing an actual software 
        * e.g. classes should be designed for extension (how?) or made final. https://softwareengineering.stackexchange.com/questions/284156/declaring-a-class-final
        * https://ocramius.github.io/blog/when-to-declare-classes-final/
        * It communicates intent to other coders  or self-documenting code. 
            * (1) One wouldn’t have to go through code to see if variable changes. 
            * (2) Helps catch bugs.  
            * Makes the code more secure. 
                *  Final variables are "safer" than non-final variables, because once they are bound there is never a question about what their current state is.
    * Mention you’d Prefer interface to implementations: if we want to change implementations later, it won’t break the functionality.
* Finally, after both you and your interviewer agree that you have a good solution, you should write your code. Depending on the company, this may be on a computer or a whiteboard. But because you’ve already come up with the solution, this should be fairly straightforward. For extra points, ask your interviewer if they would like you to write tests.
* It's better to answer fewer questions in more thorough detail than to get through every question the interviewer may have had on his list to ask you. And it's much more important to be neat, cogent and presentable than to be superfast when writing code. And which again, all gets down to basic psychology -- showing the interviewer that you are capable of seeing things from their perspective -- which in essence is what these "tests" are really about, anyway.
* Re-use the examples from brainstorming to walk through your code and make sure it works. Check for failure modes and possible optimizations (before the interviewer has a chance to give you that annoying "that's nice. but aren't you missing something?" line).
* After you finish this, consider how you would test your code, and what your test cases would be. Use the assumptions section as a place to write clean test code, if you should choose to do so. Organize your test cases in different categories.   Inevitably, you will see a bug . So we come to question five from my interview plan: “Are you satisfied with that code?” You may want to ask, “OK, so where’s the bug?” The quintessential Open Ended Question From Hell. All programmers make mistakes, there’s nothing wrong with that, they just have to be able to find them. With string functions in C, most college kids forget to null-terminate the new string. With almost any function, they are likely to have off-by-one errors. They will forget semicolons sometimes. Their function won’t work correctly on 0 length strings, or it will GPF if malloc fails… Very, very rarely, you will find a candidate that doesn’t have any bugs the first time. In this case, this question is even more fun. When you say, “There’s a bug in that code,” they will review their code carefully, and then you get to see if they can be diplomatic yet firm in asserting that the code is perfect. Interviewers are looking for: How do you know the code works? How do you design a unit test? What kinds of conditions do you assert in the code? How do you debug a crash? What if it’s intermittent? What types of mistakes lead to intermittent bugs?
* Some examples are:
    * Performance
    *  Error cases
    *  Positive expected cases
* Talk about code, to talk about time/space tradeoffs, to talk about performance characteristics of code.
*  Even though the format of the interview is, superficially, just a candidate writing some code on the whiteboard, the real goal here is to have a conversation about it. “Why did I do it that way?” “What are the performance characteristics of my algorithm?” “What did I forget?” “How I find my bug?” For performance, think about extreme quantities. For example, if the problem is about lists, mention that you would have a case with a large list and a really small list. If it’s about numbers, you’ll test the maximum integer number and the smallest. I recommend reading about testing software to get more ideas.   Interviewing is like a show business performance. Not only the final code matters, but also how you produce it: what clarification questions you ask (instead of going on with implicit assumptions), how many test cases you write, how quickly you produce the first correct code, how many mistakes (bugs) you make, and how easily you notice and fix them, how accurately and logically you can reason about the memory usage and speed of your code, how quickly you incorporate feedback and hints from the interviewer, how you consider and reject suboptimal solutions, how you communicate your confidence. A typical way to get rejected with this code is that you produce the code in 40 minutes, but the interviewer expected to spend only 15 minutes on this question, and he had another, more interesting question for you for the remaining 25 minutes
* Thank the interviewer?: Always remember to thank your interviewer via email preferably by the end of the same business day that you interviewed with them. Even if the company isn’t your top choice, someone took time out of their busy schedule to interview you, so it’s important to thank them. And, if you learned something new, a quick thank you email is a great way to reiterate that.

https://blog.pramp.com/how-to-interview-well-as-a-software-engineer-f64c2631158c

HOW TO COME UP WITH AN ALGORITHM

* Find out as many properties of the combinatorial structure as possible. Examples:
    * A graph is bipartite iff it has no odd cycle.
    * A graph is acyclic if it can be topologically sorted. An acyclic graph can be topologically sorted by decreasing DFS finishing times.
    * DFS can be used to classify the edges of a graph and this classification can be a useful abstraction on which other properties can be proved.
        * Atleast one subtree of an articulation point has no back edge etc. 
        * In a DFS information about every subtree (e.g. the deepest back edge or its depth or time etc.) can be stored on the root of that subtree while backtracking.
* Break down step by step in high level steps. Abstract, abstract, abstract.   Write out the high-level logic first, then 
*  Delegate each step to a helper function
    * When coding a data structure or algorithm, write as many as small private helper functions doing simple things as you can think might be useful. They make solving complex problems neater, easier.
    * Create a function to do each subtask. Ask the interviewer if he wants you to implement the functions. Chances are reasonable that he will say no, convinced that you know your stuff, or that he’ll ask you to do just one of the functions, to save time. This is a tremendous win for you in an interview.


How to think of a recursive solution? 

What is recursion?

* Recursion is when a function calls itself.  "Recursion is the root of computation since it trades description for time."

When to use recursion?

* Recursion is useful when the data is defined recursively (e.g. trees, linkedlist), or the problem is is one of divide and conquer/dynammic programming
* If a function calls itself to solve a subproblem, two things had better happen: 
    * The subproblem has to be simpler than the original problem 
    * Some subproblems have to be so simple that you can solve them without recursion (bottoming out)

How to build a recursive solutions?

* Think of base case first. In a base case, we compute the result immediately given the inputs to the function call. The base case corresponds to  the simplest, smallest instance of the problem, that can’t be decomposed any further. Base cases often correspond to emptiness – the empty string, the empty list, the empty set, the empty tree, zero, etc.
    * Example: Given an array of integers, return the set of all permutations. For this problem, there are two such examples:
        * When the array is empty.
        * When the array has one element.
* Think of recursive case:   The recursive step decomposes a larger instance of the problem into one or more simpler or smaller instances that can be solved by recursive calls, and then combines the results of those subproblems to produce the solution to the original problem. The key thing to note is that we keep our function specification fluid: the function specification can make the recursive decomposition easier
    * Approach 1 (Top Down): Assume some magical oracle gives you the answer for all smaller problem instances. (“Assume you have a magical function that will solve the smaller problem for you (which is really just the function you’re writing”)  This is in a sense a direct recursive implementation, where we are using the existing specification of the recursive method to solve the subproblems. Think of work done during the recursive step, before or after - and let that guide the decision as to what to return: if, for example, you need to do some computation with the result of a recursive call (work done after recursion), then your result should be in that suitable for. 
        * E.g. in BST insertion, you need to set the left/right child pointers of the parent to the new node after it is inserted as the leaf. So you might need to return the new node. Similarly, in counting elements of a list of length n, you might be adding the result 1 to the result of the list n-1, so you need to return int. Alternatively, you could be just sending an accumatator as a parameter, in which case the work is done in the recursive step itself (tail recursion).
        * You have to pick the right subproblem. Sometimes it is a matter of choosing to work done post or pre-recursion. Work done pre-recursion usually corresponds to reframing the problem in some way. 
            * Example:   “Decrease and conquer” algorithmic strategy. On each pass through the loop, we peel off a value, solve the rest of the problem, and then make a change. This “decrease and conquer” is typical and is known as decrease-by-one. It has the following characteristics:
                * It divides the problem into two parts: a sub-problem of size (n -1) and a single remaining element.
                * It then solves the sub-problem of size (n-1) by a recursive call (or an iterative decreasing process).
                *  Finally, it adds the remaining individual element back into the sub-problem’s solution.
                * Even more so than in divide-and-conquer, the ‘divide’ step is often trivial. Most of the work goes into the third step, incorporating the lone element into the existing sub-solution.
            * Example: Word Wrap
                * Wrong subproblem: Remove the first or last character, solve subproblem. Why? Addition of character changes the solution to the subproblem (maybe it makes the previous word so long that it no longer can be fit in the width, and needs to be broken down).
                * Wrong subproblem: Remove the first word, solve the subproblem
                * Subproblem with inelegant recursive formulation: break by word: remove the last word, solve the subproblem (recursive step), and then append it (post recursion). To do the work post recursion, you need to know how much space is left, which can be the output of the subproblem
                * Better subproblem: Break work done by line. Do some work pre-recursion (insert line breaks the first line) and then leave the rest to the recursive step (the rest of the lines). 
            * Example: Coin change
                * Wrong Subproblems: coinChange(n-d1,[d1…dk]) + counChange(n-d2, [d1…dk] + ….). This repeats the counts (e.g. solution with at least 1 d1 and d2 are present in both).
                * Right Subproblems = coinChange(n-d1, [d1…dk]) + coinChange(n, [d2…dk]).
                * Same as before, but delegate some of the work of recursive step to post-recursion through a loop. post : coinChange(n-d1, [d1…dk]) + coinChange(n-d2, [d3.…dk]) + ….
                * Right subProblem2 = coinChange(n -d1, [d2…dk]) + coinChange (n-2d1, [d2….dk]) + ….coinChange(n-cd1, d2….dk]). where cd1 >=n and (c-1)d1 < n.
            * Example: LIS
                * Wrong subproblem:  LIS (A, k): LIS for A[1….k]
                * Right subproblem: LISWithTerminal[A,k]: LIS with the restriction that the A[k] is included.
                * (Another right subproblem): LIS with length 1,2,3,4. 
        * Example: 
            * Permute({1,2,3,4})
                * This can be thought of the problem of choosing n elements from a given set, without replacement. assume you have an oracle which solves the the subproblems. 
                * Before recursion:  Pick an integer which will be in the jth position.
                * Recursion: Solve the subproblem of permuting all the remaining intergers as elements in position j+1…n
                * After recursion: Prepend the fixed integer to the permutations calculated in the recursive step in the place.  This will give all permutations with a particular element as the jth element
                * Run a for loop which allows each distinct remaining element to be the jth element. 
    * Approach 2 (Bottom Up): Alternatively,  Start from the base case and solve incrementally harder problems. Figure out how you can use an easier instantiation of the problem to solve the current, harder problem. This might require a stronger (or different) specification for the recursive steps, and might make the recursive decomposition simpler or more elegant.
        * Example: 
            * Base case is the permutation of singletons {1}, {2}, {3}…which are singletons themseleves
            * Using the singleton solution,  generate the the permutations of {1, 2}. 
            *  Using the solution for doubles generate the permutations of triplets.
        * Note: Static variables and aliases to mutable data are very unsafe for recursion, and lead to insidious bugs. When you’re implementing recursion, the safest course is to pass in all variables, and stick to immutable objects or avoid mutation.
    * Think about several ways to break down the problem, and try to write the recursive steps. You want to find the one that produces the simplest, most natural recursive step.
* For analysing:
    * Draw the call stack, recursion tree.
    * Prove using induction, substitution method
* Common Pitfalls:
    * Missing basecase
    * Recursion does not converge
    * Excessive memory requirement
    * Excessive computations

References for Recursion:
http://web.mit.edu/6.031/www/fa18/classes/14-recursion/
https://reginaldlong.com/f-recursion-your-guide-to-overcoming-your-worst-interview-related-fear-9/
https://blog.kwyn.io/Recursion-closure-and-iteration/

Practice Problems:
https://www.cs.utexas.edu/users/EWD/transcriptions/EWD03xx/EWD316.9.html
https://stackoverflow.com/questions/7537791/understanding-recursion-to-generate-permutations
https://stackoverflow.com/questions/4240080/generating-all-permutations-of-a-given-string

Bonus: What is tail recursion?
* If there is no computation left to be done in the calling function after the recursive function call, then it is called tail recursion. Some recursions could be rewritten as tail recursions (with the help of accumulator pattern?).

What are the benefits of tail recursion?
* The advantage of tail recursion is we don't have to store the value in a stack. So implementation wise, it saves us some memory.  A tail recursive function can be implemented without a stack, but not all programs can be implemented without a stack. "Stackless programs correspond to a finite state machine, and an FSM is capable only of implementing regular grammars. "
* There are reasons other than memory that you might want to convert a function to be tail recursive.  For example, a tail-recursive function can easily be changed to let you store an intermediate state of computation as a value, so that the computation can be suspended and resumed later.  This can be used to implement cooperative multitasking; in some sense this is the theoretical basis for frameworks like node.js and Twisted.

How do I convert a recursion to tail recursion?
We can convert any recursive function to tail recursive function with continuation (by construct the closure for continuation lambda function) (But here we still have to spend some memory to construct closures)

Are tail recursion and iteration the same?

Any tail recursive function can be made into a loop (example: http://blog.code-cop.org/2011/08/word-wrap-kata-variants.html)

Tail recursion is different  from iteration. They're the same in terms of what the machine is doing, assuming your compiler does tail-call optimization: The difference between tail recursion and iteration is whether or not the target of a jump happens to be the start of a function or not. 

But that's not the same as being "the same" - they present a very different abstraction to the programmer. In a sane language, you expect an error to give you a stack trace of functions that have been called. If you treat recursion as iteration, then either you'll have to omit some function calls from the stack, or your algorithm won't work in constant space anymore. Either violates some expectations of the programmer.

Why recursion? Why not?
two common reasons for using recursion:
* The problem is naturally recursive (e.g. Fibonacci)
* The data is naturally recursive (e.g. filesystem)
reason to use recursion is to take more advantage of immutability. In an ideal recursive implementation, all variables are final, all data is immutable, and the recursive methods are all pure functions in the sense that they do not mutate anything. The behavior of a method can be understood simply as a relationship between its parameters and its return value, with no side effects on any other part of the program.
recursive algorithms map very directly to mathematical induction, which he suggests is the only means to intellectually prove our loops correct. (I don't suggest that we must prove our code correct, but that the easier we make it for ourselves to do so, the more likely it is that our code is correct.)


Recursion can lead to stack overflow errors. downside of recursion is that it may take more space than an iterative solution. Building up a stack of recursive calls consumes memory temporarily, and the stack is limited in size, which may become a limit on the size of the problem that your recursive implementation can solve.


References:
https://www.quora.com/How-does-compiler-know-whether-the-recursion-is-a-tail-recursion-or-not-and-how-does-it-optimize-tail-recursion
https://cs.stackexchange.com/questions/6230/what-is-tail-recursion

How to think of an iterative solution?

What is an iterative function?
An iterative function is one that loops to repeat some part of the code, and a recursive function is one that calls itself again to repeat the code.

How to build an iterative solution?
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

How to verify correctness of an iterative solution?
    * One can prove that this procedure results in a desired state via a loop invariant.
        * Techniques: Mathematical Induction or
        * Reframe the problem into a different representation if possible. The difficulty of a problem can be completely determined by the framing of the problem.
    * A loop invariant is a predicate (a statement that is either true or false) with the following properties:
        * It is true upon entering the loop the first time.
        *  If it is true upon starting an iteration of the loop, it remains true upon starting the next iteration.
        * The loop terminates, and the loop invariant plus the reason that the loop terminates gives you the property that you want.
        * Example.  Consider this loop to sum the first n elements of an array a, where n is a positive integer:
sum = 0
i = 0
while i < n
    sum = sum + a[i]
    i = i + 1
            * Here's the loop invariant: Upon entering an iteration of the loop, sum = a[0] + a[1] + a[2] + ... + a[i-1].  Now let's see how the three properties hold for this loop invariant.
                * 1. Upon entering the first iteration, i = 0.  The sum a[0] + ... + a[i-1] is empty, since i-1 = -1.  The sum of no terms is the identity 0 for addition.  Check.
                * 2. Upon entering an iteration for a value of i, suppose that the loop invariant is true, so that sum = a[0] + a[1] + a[2] + ... + a[i-1].  The iteration adds a[i] into sum and then increments i, so that the loop invariant holds entering the next iteration.  Check. 
                * 3. The loop terminates once i = n.  According to the loop invariant, sum = a[0] + a[1] + a[2] + ... + a[n-1].  Check: sum is indeed the sum of the first n elements of the array.
            * Now, this example is pretty trivial.  If you were writing this loop, I doubt that you'd formally reason about it in this way.  But this reasoning is exactly what was in the back of your mind, whether or not you realized it.  Loop invariants help you understand and prove correct more complicated loops. If loop invariants remind you of mathematical induction, they should.  The first property maps to the basis of the induction, and the second property is like the inductive hypothesis.  It's the third property that's a bit different, since most inductive proofs don't have a termination condition.


https://www.quora.com/What-can-I-learn-right-now-in-just-10-minutes-that-could-improve-my-algorithmic-thinking/answer/Thomas-Cormen-1?srid=uSJD&share=7af2e616


How to convert a recursive solution to an iterative solution?

Recursive function execution flow can be represented as a tree.  A recursive logic can be executive by a loop, which uses a data-structure to traverse the recursive tree. Depth-first traversal can be done using a stack, breadth-first traversal can be done using a queue.  Thus, you can convert any recursive function into an iterative function by adding a stack; that's how computers generally implement recursion. 

The stack is used to store the work you can't do right away. For example, the main reason for having a call stack to store information about the active subroutines of a computer program is to keep track of the point to which each active subroutine should return control when it finishes executing. An active subroutine is one that has been called but is yet to complete execution after which control should be handed back to the point of call. Such activations of subroutines may be nested to any level (recursive as a special case), hence the stack structure.

The preorder case is easiest, because there's only one kind work you have to defer -- processing a child node.The stack has to store nodes to visit and nodes to process, but a node to process is always the right child of a node just visited, 

Each time a recursive call is made in the algorithm, push the necessary information onto your stack. ii) When you complete processing at this deeper level, pop the simulated stack frame and continue processing in the higher level at the point dictated by the return address popped from the stack. iii) Use an iterative control structure that loops until there are no return addresses left to pop from the stack.



https://www.scribd.com/document/40673346/Stacks-and-Recursion-Lab
https://cs.stackexchange.com/questions/67897/iteration-can-replace-recursion
https://web.archive.org/web/20120227170843/http://cs.saddleback.edu/rwatkins/CS2B/Lab%20Exercises/Stacks%20and%20Recursion%20Lab.pdf or https://stackoverflow.com/questions/159590/way-to-go-from-recursion-to-iteration
http://blog.moertel.com/tags/recursion-to-iteration%20series.html


Dynamic Programming:

* List all the parameters along which subproblems can be defined. Account for all the parameters as indices in the DP table. 
    * Frequent mistake: Students try to early optimize their solution (e.g. by omitting indices that need not be explicitly stored potentially leading to more memory-efficient solutions). In this case, they get the general solution right, but their recursion doesn't make any sense. A frequent outcome is a really buggy implementation. Also, these students have a harder time generalizing the solution to similar problems.
    * It is often useful to fill the DP results array with neutral values before calculating anything. The neutral value is a result which does not affect the problem answer for sure
    * Figure out what you are trying to compute. 
        * Most of DP problems can be divided into two types: optimization problems and combinatoric problems.  Write down a sentence about what they are computing as a way to verify that "what's in the head" actually makes sense. 
            * The optimization problems require you to choose some feasible solution so that the value of goal function is minimized (or maximized). You are often trying to either minimize or maximize a decision. You are given two (or more) options at any given point and you have to decide which is more optimal for the problem you're trying to solve. These decisions, however, are based on previous choices you made. . In case of minimization problem the neutral value is positive infinity: since it is greater than any number, all the recurrent formulas would prefer a case with finite value to such a neutral element. In other words, the state with neutral value result can be thought of as an impossible state. Note that for maximization problem negative infinity is a neutral element.
            * Combinatoric problems request the number of ways to do something or the probability of some event.  There is also a neutral value for combinatoric problem. Since combinatoric problem uses summation, the neutral element is zero. The DP results in combinatoric case usually represents number of ways to do smth, so if the result is zero than there is no way to do it. The neutral result value means that the case is impossible. It may be useful to fill DP results array with zero values, though it is usually done automatically. In case of combinatorics it is important that each possible way is counted and that no way is counted more than once. The second condition is sometimes difficult to satisfy. Sometimes it help to keep the base case of counting as 1 (e.g. In coin combinations, this numbers the number of ways to make amount 0 using all the coins is 1, while in minCoins, the minimum coins needed to make zero would be 0.). 
            *  In case of combinatorics it is important that each possible way is counted and that no way is counted more than once. The second condition is sometimes difficult to satisfy.
        * Example: Zackendorf numbers.  z(n,k) is ….. representation of n in fibonacci base excluding the first k-1 fibonacci numbers? Or whether 1 or 0 is used in the nth index in the unique representation?
        * Example: "What is the best profit we can get from selling the wines with prices stored in the array p, when the current year is year and the interval of unsold wines spans through [be, en], inclusive?"
* Consider the problem space. How many different subproblems there are? 
* Could we compute the solution to the problem from the subproblems? Can you get rid of some parameters? How do you represent a subproblem?
    * Would brute force be exponential?
    *  (Optimal Substructure). Consider if the problem has optimal substructure: an optimal solution uses the optimal solution to a subproblem. 
        * A problem might not have optimal substructure. 
            * This can happen when subproblems are not independent - the use of resources in the solution to one subproblem renders them unavailable for the other subproblem e.g. longest path problem. 
            * The classical travelling salesman problem. Let the DP state domain be (k,l)->D where D is the minimal length of the simple path going through exactly k cities with 0-th city being the first one and l-th city being the last one. The optimal substructure property in such a DP does not hold: given the shortest tour its subpath with fixed last city and overall number of cities is not always the shortest. Therefore the proposed DP would be wrong anyway.
        * The optimal subscructure constraints the problem space. How many subproblems need to be solved now?
* Could we compute the solution to the problem from the subproblems? What would need to be done post recursion, or pre-recursion?
* Figure out the recursion formula. (combinatorial insight). Do we have overlapping subproblems? 
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


    https://blog.racket-lang.org/2012/08/dynamic-programming-versus-memoization.html

The DP solution iterates through the states in some particular order set by coder, while memoization iterates through them in order of depth-first search

Why use Bottom Up DP?

Pro: 
* Possible to make memory optimisations by freeing up space. (Analyse what subproblem solutions need to be saved at any point). can more easily save space by disposing of unnecessary sub-computation results
* No Cache Checking Overhead. Has no need to check whether a computation has been done before doing it—the computation is rewritten to ensure this isn’t necessary
Cons:
* Difficult to understand and prone to bugs: forces change in desription of the algorithm, which may introduce errors and certainly introduces some maintenance overhead
* Does unnecessary sub-computations (cannot avoid them, and may waste the space associated with storing those results).
* Has a space complexity that depends on picking a smart data storage strategy


Why use memoization?

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
https://dev.to/nikolaotasevic/dynamic-programming--7-steps-to-solve-any-dp-interview-problem-3870


http://courses.csail.mit.edu/6.01/spring07/lectures/lecture4.pdf

How long do we expect this program to run? Answering that question in detail requires a lot of information about the particular computer we’re going to run it on, what other programs are running at the same time, who implemented the Python interpreter, etc. We’d like to be able to talk about the complexity of programs without getting into quite so much detail.

Thinking about the order of growth of the running time. That is, as we increase something about the problem, how does the time to compute the solution increase?
In actual fact, on some particular computer (with no other processes running), this program would take some time R(n), to run on an input of size n.
For a process that uses resources R(n) for a problem of size n, R(n) has an order of growth Θ(f(n)) if there are positive constants k1 and k2 independent of n such that k1f(n) ≤ R(n) ≤ k2f(n) , for n sufficiently large.

http://www.pgbovine.net/programming-interview-tips.htm


----
