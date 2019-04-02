---
layout: post-journal
title: Structure a technical interview 
date:   2019-03-31 09:00:11
tag:
categories: guide
excerpt:
permalink: /structure
comments: false




---

# General Do's 


*  Interviewing is like a show business performance. Not only the final code matters, but also how you produce it: what clarification questions you ask (instead of going on with implicit assumptions), how many test cases you write, how quickly you produce the first correct code, how many mistakes (bugs) you make, and how easily you notice and fix them, how accurately and logically you can reason about the memory usage and speed of your code, how quickly you incorporate feedback and hints from the interviewer, how you consider and reject suboptimal solutions, how you communicate your confidence. 

* It's better to answer fewer questions in more thorough detail than to get through every question the interviewer may have had on his list to ask you. And it's much more important to be neat, cogent and presentable than to be superfast when writing code. And which again, all gets down to basic psychology -- showing the interviewer that you are capable of seeing things from their perspective -- which in essence is what these "tests" are really about, anyway.

* Be fast with trivial problems. Don’t be a candidate from whom the answers have to be wrestled out. Quickly recognize the type of problem and give a high-level solution.  A typical way to get rejected is that you produce the code in 40 minutes, but the interviewer expected to spend only 15 minutes on this question, and he had another, more interesting question for you for the remaining 25 minutes

* If you know more, show it. There were multiple examples where you would answer a question and mention some other knowledge I had but explain that I didn’t have time in an interview to fully implement that solution.   
    * Answering a question about strings? Show off your Unicode knowledge with your solution or explain how to support Unicode.
    * Implementing a private method? Talk about the Objective-C conventions for methods. Updating a table view? Talk about the different animations you can support. 
    * Don’t bring something up if you can’t talk all about it, but if you can, it allows you to show knowledge outside of the narrow window provided by the question and gives you a leg up on anyone that sticks strictly to the beaten path.
* Overcommunicate. 
* Incorporate feedback and pick up hints. Be fast at mentally switching from one idea to the other one and don't try to stick to the old idea even after being directly told that this idea is wrong?
*  Be comfortable with pointer based loops and recursion. The good programmers stand up, write the answer on the board, sometimes adding a clever fillip (Ooh! Unicode compliant! Nice!), and it takes thirty seconds, and now I have to decide if they’re really good, so I bring out the big guns: recursion and pointers. The best programmers all have an easy aptitude for dealing with multiple levels of abstraction simultaneously. In programming, that means specifically that they have no problem with recursion (which involves holding in your head multiple levels of the call stack at the same time) or complex pointer-based algorithms (where the address of an object is sort of like an abstract representation of the object itself).   Being able to reason recursively or inductively is important for many areas of computing, including using heirarchical data representations (e.g. XML), distributed computing, searching, and sorting.
* For phone screens, I use a piece of paper (mentioning I am doing so to the interviewer). write down thought process on paper, reading aloud as I write it down. What I have on paper is usually just for me so that I don’t lose my train of thought, and before I start coding, I put down what you are going to do briefly as comments in the shared screen referring to the notes.
    

-----


# Make the three columns 
* Approach
* Implementation
* Assumptions. 
    * After listing assumptions, discuss the approach, graphically and in pseudocode 
    * Highlight and point to each step in the pseudocode as you write the code. 

------------



# Clarify Assumptions

> Example: [Anagrams](https://web.stanford.edu/class/cs9/sample_probs/Anagrams.pdf)

Clarify every single thing,  no matter how small. This is the time to be pedantic. Clarify every ambiguity you can think of. Ask questions even if you’re almost sure you know the answers. 

It gives you a chance to come up with edge cases and fully spec the problem (seeing how you handle edge-cases is one of the main things that interviewers look for when evaluating an interview)

It gives you a minute to collect your thoughts before you need to start solving the problem.  

* **Paraphrase**. Rephrase a sentence, say it aloud, and ask for confirmation.

*  **Partition and verify output for examples.** 
    
    One way to generate questions is to start working through small examples and asking if the answer you expect agrees with the interviewer. It helps to visualize first what the problem is. Bring up specific examples of input, and make sure you are correct about the expected output. 

> Problem: Delete a course named 6.000 from list.

> Partition:     
     subjects.size: 0, 1, n     
     contents: no 6.xx, one 6.xx, all 6.xx.      
     position: 6.xx at start, 6.xx in middle, 6.xx at end      
    
> If it’s a problem related to trees, I would start with the null case, one node, two nodes, three nodes. This can help you generalize a solution.

*  **Suggest what should be done in edge cases.**  
> Should adding (Key, null) delete existing key? Should null keys be allowed?


         
* **Ask about the scope**  
> “Can I use a small set of data?”      
> Is this in a user or customer facing system?   
> How often will this be called?   
> What’s the typical size of an input? What’s the largest size of an input?   
> How is the process that this will be a part of run? Is it a service? Is it run on a schedule?      
> Are there any constraints (memory usage, execution time, etc.)?

* **How would clients call this? Determine Specification and preconditions on the funnction**    

>  “Can I assume the input array is sorted?”   

> I remember one interview solution that relied entirely on all the inputs being positive integers, but I almost failed the interview because I couldn’t figure out what to do when I got zero as an input. If I would have read the problem more carefully, I would have realized that zero was not included in the possible inputs.

    

> How to expose elements of the data structure? Should I implement the the iterable interface by providing an iterator()?
        
> Implement data structure with Generics or assume a type used by the user int/string    




* Should I quickly get something running, or follow a methodology (say TDD) or optimise for code reuse and elegance (say SOLID principles) or design anticipating future requirements in mind. 
> In the Diamond Kata, might the client want to start from a different character than A tomorrow?      
> String reverse: don't repeat yourself (use only one array!). 

    Approaching the problem from a test driven perspective first might seem the logical way, but what about just writing the code to solve the problem, holding back on the test driven approach until you're asked how you could make it better, let the conversation take it. Some places still don't understand what test driven really means, so you might come across as too advanced. If you want to find out about whether they value this skill set, aim your questions to them around finding out about their development process. 

   




* **Optional: Validate assumptions of data structure and complexity beforehand**

------------------

# Discuss Approach 

* **Explain your thought process before you begin coding.** 
    
   
    **Be sure to talk to the interviewer about your thinking and intentions**. Even in cases where you are not stuck, always enunciate your approach, **explaining your rationale.**  It might slow you down a little at the beginning, but communication is more important than anything and it only helps with the interview. 

    Explain your thinking out loud as much as possible, but don’t talk too much if it distracts you from finding the solution.  Silence can be awkward in an interview, but you can control it. **Say “I’ll take a second to look this over” to break the silence** and will allow you to concentrate on solving the problem rather than finding the right words to say.

    

    **If some part of your solution is coming from intuition, mention so.**

    **Document the steps while communicating your thought process**


* **Point out the obvious naive solution.** 

    Make sure that you always give a solution to the problem you’ve been asked (even if it is obvious, or wrong, or even if it takes exponential time, or an NSA super computer).

    While you’re explaining this, think of how to improve it. You should only talk through the simplest brute-force solution to the problem that you can think of. You should talk, rather than jump right into coding, because you can move faster when talking, and it’s more engaging for the interviewer. If the interviewer is engaged, they will step in and offer pointers. If you retreat into writing code, however, you'll miss this opportunity.

    When you’ve described a brute-force solution, ask the interviewer if they would like you to implement it, or come up with more efficient solution.
    
    Normally they will tell you to come up with a more efficient solution. 

 


* **Get to the more efficient solution.** 
   
    * **Talk and bounce ideas off of the interviewer. Don't write code just yet.**

    Hopefully, the question will be similar to something you’ve seen, and you’ll know the answer. 
    

    * **It’s useful to think of what problems you’ve seen that are most similar, and bring these up with the interviewer.** 

    Most interview questions are slightly-obscured applications of classic CS algorithms. The interviewer will often guide you to this algorithm, but only if you begin the process. 

    
* Sometimes you'll get stuck. Relax. It doesn't mean you've failed. Keep in mind that the interviewer usually cares more about your ability to cleverly poke the problem from a few different angles than your ability to stumble into the correct answer. When hope seems lost, keep poking. 

 * If you get stuck finding a solution and if you had communicated your thought process, continue to think aloud and explain the problem with your approach. Thereafter, try to salvage your current approach.  Think out loud more. Say what you know. Say what you thought might work and why .Even if you don’t solve the problem, you can still impress your interviewer with your thinking. Even if they reject you, the feedback in their record can be positive and you may get a chance later down the line. t won't work. You might realize it actually does work, or a modified version does. Or you might get a hint.

* Go back to the drawing board and try to find another solution. 

* **Solve by Hand and Automate.** Draw pictures. Don't waste time trying to think in your head—think on the board.  Draw a couple different test inputs. Draw how you would get the desired output by hand. Then think about automating your approach. 


* **Solve a simpler version of the problem.**

> Not sure how to find the 4th largest item in the set? Think about how to find the 1st largest item and see if you can adapt that approach.

 * **Think about the bounds on space and runtime.** If you're not sure if you can optimize your solution, think about it out loud. For example:
>  "I have to at least look at all of the items, so I can't do better than O(n)O(n)."
> "The brute force approach is to test all possibilities, which is O(n^2)O(n2)."
> "The answer will contain n^2n2 items, so I must at least spend that amount of time."

* **Discern hints and go down a path.** 

    Always look out for questions/comments from the interviewer: they may actually be a hint and may prove to be a lifeline.  * Wait for a hint. Don't stare at your interviewer expectantly, but do take a brief second to "think"—your interviewer might have already decided to give you a hint and is just waiting to avoid interrupting.
      
    Interviewers usually have a series of questions ready to guide the candidate down a particular path in the design of this data structure or block of code, because it’s such a big question, and they can often tell how smart the candidate is by how far they get down that path in a fixed amount of time.    I don’t really mind giving programming problems that are too hard, as long as the candidate has some chance of starting out, and then I’m happy to dole out little hints along the way, little toeholds, so to speak. 

> Example: Project a triangle onto a plane, a typical graphics problem, and I don’t mind helping them with the trig (SOH-CAH-TOA, baby!), and when I ask them how to speed it up, I might drop little hints about look-up tables. Notice that the kinds of hints I’m happy to provide are really just answers to trivia questions—the kinds of things that you find on Google.  

   

-------

* **Write the pseudocode first.** 

    Before you start coding,  put down what you are going to do briefly as comments in the shared screen referring to the notes. 

* **List things the algorithm needs to do at the bare minimum.** 

    On the whiteboard, write down a list of the things the algorithm needs to do.  Focus on the smallest amount of code that can provide the answer that is being requested.
    * Smaller code is easier for the reviewer to understand (if you're doing something tricky).
    * Employers are looking for developers to solve problems. So, they're keen to know if you can take a requirement, run with it and turn it in to a solution

-----

# Write Code

* Finally, after both you and your interviewer agree that you have a good solution, you should write your code. Depending on the company, this may be on a computer or a whiteboard. But because you’ve already come up with the solution, this should be fairly straightforward. 

* Solve the problem first. Mention you'd refactor later.

    * Do not start by building up infrastructure around the problem.         
    * Do not start thinking about nugget packages you need for the problem.
    * Point out that you’re leaving a code comment for error handling.  (Handling of Exceptions, Try-Catch blocks)
        *  Validating arguments: Throw Nullpointer exception, or Illegalargument exception or  IllegalState exception. common validations can be factored out into utility classes. 

        The interviewer might say that you can assume that the parameters you’re getting already passed a validation. However, it is still important to bring this up to show that you are aware of error cases and quality.  or the interviwer might say, “That’s a good point. How would you handle it? Would you throw an exception? Or return a specific value?” This can make for a good short discussion about code quality. Mention a few error cases.

    * Point out SOLID prinncples and OOD best practices
        * Making classes and objects immutable, field variables private etc.
        * Mention you’d use final liberally if you were designing an actual software 
            * e.g. classes should be designed for extension (how?) or made final. [Declaring a class final](https://softwareengineering.stackexchange.com/questions/284156/declaring-a-class-final)
        * [When to declare classes final](https://ocramius.github.io/blog/when-to-declare-classes-final/)
        * It communicates intent to other coders  or self-documenting code. 
            * (1) One wouldn’t have to go through code to see if variable changes. 
            * (2) Helps catch bugs.  
            * Makes the code more secure. 
                *  Final variables are "safer" than non-final variables, because once they are bound there is never a question about what their current state is.
        * Mention you’d Prefer interface to implementations: if we want to change implementations later, it won’t break the functionality.
    * For extra points, ask your interviewer if they would like you to write tests.

------

# Test by walking through examples

How do you know the code works? How do you design a unit test? What kinds of conditions do you assert in the code? How do you debug a crash? What if it’s intermittent? What types of mistakes lead to intermittent bugs?

* Consider how you would test your code, and what your test cases would be. Use the assumptions section as a place to write clean test code, if you should choose to do so.  Organize your test cases in different categories.   


* Re-use the examples from brainstorming to walk through your code and make sure it works. 

* Ask yourself “OK, so where’s the bug?”, “Amy I satisfied with that code?”,  “What did I forget?”. Check for failure modes and possible optimizations.  (before the interviewer has a chance to give you that annoying "that's nice. but aren't you missing something?" line).  All programmers make mistakes, there’s nothing wrong with that, they just have to be able to find them. 
   
Possible sources of bugs:
    
> With string functions in C, most college kids forget to null-terminate the new string.
> likely to have off-by-one errors.         
> forget semicolons sometimes.         
> Won’t work correctly on 0 length strings        
> GPF if malloc fails… 
> Integer Overflow
> Mutable Objects        




------

# Discuss performance
 

* Talk about time/space tradeoffs

* “What are the performance characteristics of my algorithm?”

 Think about extreme quantities. For example, if the problem is about lists, mention that you would have a case with a large list and a really small list. If it’s about numbers, you’ll test the maximum integer number and the smallest. 

  

------

* **Thank the interviewer** 

    Always remember to thank your interviewer via email preferably by the end of the same business day that you interviewed with them. Even if the company isn’t your top choice, someone took time out of their busy schedule to interview you, so it’s important to thank them. And, if you learned something new, a quick thank you email is a great way to reiterate that.

- [How to interview by Pramp](https://blog.pramp.com/how-to-interview-well-as-a-software-engineer-f64c2631158c)

--------
