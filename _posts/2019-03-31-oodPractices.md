---
layout: post-journal
title: Best Practices for Designing Objects
date:   2019-03-21 09:00:11
tag: 
categories: guide
excerpt: 
permalink: /ood-practices
comments: false

---



The essential idea is that an abstract data type is defined by its operations. The set of operations for a type T, along with their specifications, fully characterize what we mean by T. when we talk about the List type, what we mean is not a linked list or an array or any other specific data structure for representing a list. Instead we mean a set of opaque values – the possible objects that can have List type – that satisfy the specifications of all the operations of List: get(), size(), etc.

The key idea of data abstraction is that a type is characterized by the operations you can perform on it. A number is something you can add and multiply; a string is something you can concatenate and take substrings of; a boolean is something you can negate, and so on. In a sense, users could already define their own types in early programming languages: you could create a record type date, for example, with integer fields for day, month, and year. But what made abstract types new and different was the focus on operations: the user of the type would not need to worry about how its values were actually stored, in the same way that a programmer can ignore how the compiler actually stores integers. All that matters is the operations.

[What are the design principles that promote testable code?](https://softwareengineering.stackexchange.com/questions/153410/what-are-the-design-principles-that-promote-testable-code-designing-testable-c?PrinciplesOfObjectOrientedDesign)

-------

**Fail Fast**. Throw exceptions as the first step if an illegal argument is passed.  We can make a bug easier to find and fix by failing fast, even though we are not obligated to do so. "Careless use of null can cause a staggering variety of bugs. Studying the Google code base, we found that something like 95% of collections weren’t supposed to have any null values in them, and having those fail fast * rather than silently accept null would have been helpful to developers.”

**KISS (Keep it simple (and) stupid.)**

**Law of demeter ("Don't talk to strangers!”)** An object should be as much unaware of other objects as possibble, so that it is only loosely coupled with any other object.

**Principle of Least Privilege**

**DRY (Don't repeat yourself.)** "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system".


**Abstraction**
Omitting or hiding low-level details with a simpler, higher-level idea. A spec is an abstraction in that the client only has to understand its preconditions and postconditions to use it, not the full internal behavior of the implementation. * Make classes and objects immutable, field variables private etc.
    

*  I could define new abstractions (work on a higher level vs low level)
        *  Pro: would make the code more readable, safer form bugs and easier to debug
        *  Con: Overhead e.g. Overiding equals and hashCode if they are to be used in a collection. More memory usage in the heap space allocated to objects (as opposed to pointers to existing concepts). Possibly more computation in creating those objects.

**Modularity.** Dividing a system into components or modules, each of which can be designed, implemented, tested, reasoned about, and reused separately from the rest of the system.

**Encapsulation.** Building a wall around a module (a hard shell or capsule) so that the module is responsible for its own internal behavior, and bugs in other parts of the system can’t damage its integrity. The local variables of a method are encapsulated, since only the method itself can use or modify them. Contrast with global variables, which are quite the opposite, or local variables pointing to mutable objects that have aliases, which also threaten encapsulation.(related to representation exposure, meaning that code outside the class can modify the representation directly. Rep exposure (breaking encapsulation) threatens  invariants (whether the representation is well formed) and representation independence - the other parts of the system can come to be dependent on a particular , rather than ADT  )

**Information hiding.** Hiding details of a module’s implementation from the rest of the system, so that those details can be changed later without changing the rest of the system. A spec uses information-hiding to leave the implementer some freedom in how the method is implemented.

**Representation Independence** Critically, a good abstract data type should be representation independent. This means that the use of an abstract type is independent of its representation (the actual data structure or data fields used to implement it), so that changes in representation have no effect on code outside the abstract type itself. For example, the operations offered by List are independent of whether the list is represented as a linked list or as an array.

**Polymorphism**  Polymorphic dispatch replaces if blocks. Instead of `if (thing is Car) thing.drive() else if (thing is Boat) thing.swim()` its just thing.move(). https://en.wikipedia.org/wiki/Dynamic_dispatch

**Separation of concerns** 
Making a feature (or “concern”) the responsibility of a single module, rather than spreading it across multiple modules. [OOD of a card deck](https://codereview.stackexchange.com/questions/161773/object-oriented-design-of-card-deck) 

[Tell, don't ask](https://pragprog.com/articles/tell-dont-ask
https://martinfowler.com/bliki/TellDontAsk.html)
You organise your objects so that all your commands are of the form: thing.doSomething() , i.e. a subject-verb syntax instead of a function call. Objects should be instructed (by other objects) to perform a specific task.
Procedural code gets information then makes decisions. Object-oriented code tells objects to do things. 
You should endeavor to tell objects what you want them to do; do not ask them questions about their state, make a decision, and then tell them what to do.  It’s very easy to get lulled into examining some referenced object and then calling different methods based on the results. But that may not be the best way to go about doing it. Tell the object what you want. Let it figure out how to do it. Think declaratively instead of procedurally!
As the caller, you should not be making decisions based on the state of the called object that result in you then changing the state of the object. The logic you are implementing is probably the called object’s responsibility, not yours. For you to make decisions outside the object violates its encapsulation.  
It is easier to stay out of this trap if you start by designing classes based on their responsibilities, you can then progress naturally to specifying commands that the class may execute, as opposed to queries that inform you as to the state of the object.

Person bob = new Person();
bob.setHairColour( Colour.RED );

Bob has complete control over what colour his hair will become because no other object in the system is allowed to change that colour without Bob's permission.

Instead of:
Person bob = new Person();
Colour hair = bob.getHairColour();
hair.setRed( 255 );

which is same as 

Person bob = new Person();
Colour hair = bob.hairColour;
hair.red = 255;

Both code snippets expose the idea that a Person is tightly coupled to Hair.  it becomes difficult to change how a Person's hair is stored.
Bob has no control over what colour his hair would become. Great for a hair stylist with a penchant for redheads, not so great for Bob who despises that colour. Another way to avoid this problem is to return a copy of Bob's hair colour (as a new instance), which is no longer coupled to Bob. I find that to be an inelegant solution because it means there is behaviour that another class desires, using a Person's hair, that is no longer associated with the Person itself. That reduces the ability to reuse code, which leads to duplicated code.


**Single Responsibility Principle** An object should do exactly one thing, and should be the only object in the codebase that does that one thing. For instance, take a domain class, say an Invoice. The Invoice class should represent the data structure and business rules of an invoice as used in the system. It should be the only class that represents an invoice in the codebase. This can be further broken down to say that a method should have one purpose and should be the only method in the codebase that meets this need.
By following this principle, you increase the testability of your design by decreasing the number of tests you have to write that test the same functionality on different objects, and you also typically end up with smaller pieces of functionality that are easier to test in isolation.

**Open/Closed Principle** A class should be open to extension, but closed to change. Once an object exists and works correctly, ideally there should be no need to go back into that object to make changes that add new functionality. Instead, the object should be extended, either by deriving it or by plugging new or different dependency implementations into it, to provide that new functionality. This avoids regression; you can introduce the new functionality when and where it is needed, without changing the behavior of the object as it is already used elsewhere.
By adhering to this principle, you generally increase the code's ability to tolerate "mocks", and you also avoid having to rewrite tests to anticipate new behavior; all existing tests for an object should still work on the un-extended implementation, while new tests for new functionality using the extended implementation should also work.
One way to make the class opened for extensions is to create a constructor that receives all dependencies, rather than to make the class instantiate all of them by itself.

**Liskov Substitution Principle** 

A class A, dependent upon class B, should be able to use any X:B without knowing the difference. This basically means that anything you use as a dependency should have similar behavior as seen by the dependent class. 
This is huge for writing testable code, because a design that conforms to the LSP can have a "mocked" object substituted for the real thing at any point without changing expected behavior, allowing for small pieces of code to be tested in isolation with the confidence that the system will then work with the real objects plugged in.

> Mutable Square is not a rectangle, and [Mutable Rectangle is not a Mutable Parallelogram](https://softwareengineering.stackexchange.com/questions/238176/why-would-square-inheriting-from-rectangle-be-problematic-if-we-override-the-set)

> say you have an IWriter interface that exposes Write(string), which is implemented by ConsoleWriter. Now you have to write to a file instead, so you create FileWriter. In doing so, you must make sure that FileWriter can be used the same way ConsoleWriter did (meaning that the only way the dependent can interact with it is by calling Write(string)), and so additional information that FileWriter may need to do that job (like the path and file to write to) must be provided from somewhere else than the dependent.


------


**Polymorphism**

**Polymorphism** is the ability (in programming) to present the same interface for differing underlying forms (data types). Polymorphism describes a pattern in object oriented programming in which classes have different functionality while sharing a common interface.


> A real world analogy for polymorphism is a button. Everyone knows how to use a button: you simply apply pressure to it. What a button “does,” however, depends on what it is connected to and the context in which it is used — but the result does not affect how it is used. If your boss tells you to press a button, you already have all the information needed to perform the task.

> The classic example is the Shape class and all the classes that can inherit from it (square, circle, dodecahedron, irregular polygon, splat and so on). With polymorphism, each of these classes will have different underlying data. A point shape needs only two co-ordinates (assuming it's in a two-dimensional space of course). A circle needs a center and radius. A square or rectangle needs two co-ordinates for the top left and bottom right corners and (possibly) a rotation. An irregular polygon needs a series of lines.

Why is it useful?

polymorphism is used to make applications more 
*  Modular:  Instead of messy conditional statements describing different courses of action, you create interchangeable objects that you select based on your needs. when you have different types of objects and can write classes that can work with all those different types because they all adhere to the same API (e.g. List of objects sharing a base class/interface). By making the class responsible for its code as well as its data, you can achieve polymorphism. This is in contrast to the old way of doing things in which the code was separate from the data, shape.Draw() vs drawSquare() and drawCircle().

* extensible.  you can add new FlyingMachines to your application without changing any of the existing logic.

Polymorphism helps implement the [Open Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle#Polymorphic_open/closed_principle)
[What is polymorphism and how is it used?](https://stackoverflow.com/questions/1031273/what-is-polymorphism-what-is-it-for-and-how-is-it-used)


-----

**Interface Segregation Principle** 

An interface should have as few methods as is feasible to provide the functionality of the role defined by the interface. Simply put, more smaller interfaces are better than fewer larger interfaces. This is because a large interface has more reasons to change, and causes more changes elsewhere in the codebase that may not be necessary.

Adherence to ISP improves testability.  By reducing the complexity of systems under test and of dependencies of those SUTs. If the object you are testing depends on an interface IDoThreeThings which exposes DoOne(), DoTwo() and DoThree(), you must mock an object that implements all three methods even if the object only uses the DoTwo method. But, if the object depends only on IDoTwo (which exposes only DoTwo), you can more easily mock an object that has that one method. 



Generally speaking you'll want your interfaces to be well-segregated and more specific. The current Animals interface doesn't really communicate what the interface is used for. If I were making an application for example that only showed pictures of various animals, it is unclear whether or not I should use your interface on my new class. Rather, it is better to split interfaces (usually) based on the behavior they add. This forces them to be very targeted and succint, which in turn produces code that is more stable and typically easier to maintain since changes are very isolated.

For example, instead of:

```java
interface Animals { 
    void callSound(); 
    int run();
}

```

You might have:

```java

interface IMakesSound {
    void callSound();
} 

interface ICanMove { 
    int move(); 
}

interface IWarmBlooded {
    int currentBodyTemperature();  
    bool isOverheated();
}

abstract class Animal implements IMakesSound, ICanMove {   
    abstract void callSound(); abstract int move();
}

abstract class Mammal extends Animal implements IWarmBlooded { 
    private int _bodyTemp; 
    abstract void callSound(); 
    // We don't know what ALL mammals sound like 
    abstract int move(); 
    // Some mammals run, others walk, some swim, and some do all of the above.
    public int currentBodyTemperature() { 
        return _bodyTemp;
    }
    public bool isOverheated() {
        return _bodyTemp > 98; 
    // This can be overridden based on the child class if needed 
    }   
}

// Other classes here that inherit either from `Animal` or `Mammal`.
```

In the above example, I have separated out your interface into two separate interfaces and an abstract base type that combines them. Using this structure, I can create something that makes a sound but isn't an animal (for example, a robot toy dog) that can still have all of the attributes of a "real" dog, but none of the inherited animal features. This allows your code to be more flexible and more loosely coupled (which is the point of using an interface). By having code dependent on these loosely typed constructs, it allows for more flexibility. [Animal Inheriteance and Interfaces](https://codereview.stackexchange.com/questions/144468/animals-inheritance-and-interfaces)

Possibly the parent Card class should be rather empty, and allow for subclasses to specify the criteria of that card. Like ordinary playing cards, or a Uno deck, or Pokemon deck, and so on.

```java
interface Suitable<T> {
    booleanIsSameSuit(T other);
}
interface Rankable<T> {
    booleanIsConsecutive(T other);
}
FrenchPlayingCard implements Suitable<Card>, Rankable<Card>{
    //,,,
}

```
------

**Dependency Inversion Principle** 

Concretions and abstractions should never depend on other concretions, but on abstractions. This principle directly enforces the tenet of loose coupling. An object should never have to know what an object IS; it should instead care what an object DOES. So, the use of interfaces and/or abstract base classes is always to be preferred over the use of concrete implementations when defining properties and parameters of an object or method. That allows you to swap one implementation for another without having to change the usage (if you also follow LSP, which goes hand in hand with DIP).
Again, this is huge for testability, as it allows you, once again, to inject a mock implementation of a dependency instead of a "production" implementation into your object being tested, while still testing the object in the exact form it will have while in production. This is key to unit testing "in isolation".


Prefer interface to implementations: if we want to change implementations later, it won’t break the functionality.

----------


**What do mention in specs and comments?**


* Specs: 
    * PreConditions on Client
    * Post conditions
    * Exceptions thrown.
    * What the function does. Especially mention any mutations to input.
* Comments: 
    * Abstraction Function
    * Rep Invariant
    * Loop Invariant if iterative method

[Why don't people use formal methods?](https://www.hillelwayne.com/post/why-dont-people-use-formal-methods/)

----



**When and how to use interfaces?**

A class defines who you are, and an interface tells what roles you could play. The key point about interfaces is not so much that they say what a class does, but allow objects that can Wizzle to make themselves useful to code that needs a Wizzler.
An interface is a contract: The person writing the interface says, "hey, I accept things looking that way", and the person using the interface says "OK, the class I write looks that way”. 
Interfaces should be uses if you plan to create multiple classes sharing the same methods.  Also used to pass functions as parameters: one wraps a function as a method of the interface, then passes an object which implements that method. Interface should have preferably adjective names (e.g. Comparable, Serializable etc.).  

[MIT Lecture on Interfaces](http://web.mit.edu/6.031/www/fa18/classes/12-interfaces-enums/)

----

**When to use abstract class over interface?**
Abstract classes can have private state, but interfaces cannot. When you need an access to an object’s state in default method implementations.
When and how to use Enums

----

**When to use Enums?**
Enums  when a parameter or a variable can only take a handful of values. Or should be used to implement strategy pattern (e.g. different  compare functions), singleton pattern. 
Enums should be separated out in their ownlass, unless they follow a recurrent pattern in their relation to a class that you want to emphasis.

[What are enums and why are they useful?](https://stackoverflow.com/questions/4709175/what-are-enums-and-why-are-they-useful)

----

**When to use Java Modifiers (static, final) in a  class, method, variable?** 

* Static methods and fields are useful when they conceptually don't belong to an instance of something. 

    This generally means that they hold valuable metadata or perform a useful operation that's related to their class instance, but would not require direct instantiation of that class.
 
> Integer. It has the static [final] fields MAX_VALUE and MIN_VALUE. Since both of these fields contain fixed information that would not change between instantiations, it would not make sense to have to instantiate an Integer to get this information. Integer also has the useful operation parseInt, which takes a String and turns it into an int. We shouldn't require an instance of Integer to convert from String to int, especially if we're not placing it into an instance of Integer

* Static methods cannot be overridden. Instance methods can be overridden. 
    * Static methods are resolvable at compile time. Dynamic dispatch makes sense for instance methods, where the compiler can't determine the concrete type of the object, and, thus, can't resolve the method to invoke. But invoking a static method requires a class, and since that class is known statically—at compile time—dynamic dispatch is unnecessary.

* For making a method static, ask thyself: does it make sense to call this method without having an object instance?

* For making a nested class static, ask thyself: does this class need access to an instance, or instance specific fields and methods of the enclosing class?

**Should you separate out nested classes?**

* **When to use a nested static class?** As a public helper class, useful only in conjunction with its outer class (If it makes sense to use the class without its outer class, you may as well promote it to a top level class). A static nested class interacts with the instance members of its outer class (and other classes) just like any other top-level class. In effect, a static nested class is behaviorally a top-level class that has been nested in another top-level class for packaging convenience.
> consider an enum describing the operations supported by a calculator. The Operation enum should be a public static member class of the Calculator class. Clients of Calculator could then refer to operations using names like Calculator.Operation.PLUS and Calculator.Operation.MINUS. (Nested classes should not necessarily be private)

* [Why should we declare an interface inside a class?](https://stackoverflow.com/questions/16648642/why-should-we-declare-an-interface-inside-a-class)

* **How to use nested inner  (non-static) class?** One common use of a nonstatic member class is to define an Adapter that allows an instance of the outer class to be viewed as an instance of some unrelated class. For example, implementations of the Map interface typically use nonstatic member classes (e.g. Map.Entry) to implement their collection views, which are returned by Map’s keySet, entrySet, and values methods. Similarly, implementations of the collection interfaces, such as Set and List, typically use nonstatic member classes to implement their iterators. Another example of an inner private class is the Node class in a BST. 

* When to use a class which has all members static and a private constructor?    
    * A good use of a static class is in defining one-off, utility and/or library classes where instantiation would not make sense. A great example is the Math class that contains some mathematical constants such as PI and E and simply provides mathematical calculations https://stackoverflow.com/questions/7486012/static-classes-in-java
    * Singleton class  has a single instance. Enums have few, fixed multiple instances. These classes have private constructor. share the instances as static member variables. 

* When to use a class which has all members static and a public constructor?  This would be strange, as all instances would look the same. But such a class can be extended and new methods added. 


* What is method overloading? What is method overriding?
    * Methods are overriden during compile time, but overloaded only on runtime.

* [What is the point of getters and setters?](https://stackoverflow.com/questions/1461598/what-is-the-point-of-setters-and-getters-in-java/1462424#1462424 )
* [Why use getters and setters?](https://stackoverflow.com/questions/1568091/why-use-getters-and-setters-accessors)

* All private methods are implicitly final. All methods of a final class are final. A field that is both static and final has only one piece of storage that cannot be changed. When using final with object handles rather than primitives the meaning gets a bit confusing. With a primitive, final makes the value a constant, but with an object handle, final makes the handle a constant. The handle must be initialized to an object at the point of declaration, and the handle can never be changed to point to another object. However, the object can be modified; Java does not provide a way to make any arbitrary object a constant.  This restriction includes arrays, which are also objects. Just because something is final doesn’t mean that its value is known at compile-time. This is demonstrated by initializing final variables at run-time using randomly generated numbers. Making object handles final seems less useful than making primitives final.[]( https://www.codeguru.com/java/tij/tij0071.shtml )

* Check rep invariants after every method. You should certainly call checkRep() to assert the rep invariant at the end of every operation that creates or mutates the rep – in other words, creators, producers, and mutators. Look back at the RatNum code above, and you’ll see that it calls checkRep() at the end of both constructors. Observer methods don’t normally need to call checkRep(), but it’s good defensive practice to do so anyway. Why? Calling checkRep() in every method, including observers, means you’ll be more likely to catch rep invariant violations caused by rep exposure.


* Use final liberally. 
    * Classes should be designed for extension or forbidden to extend. One way to forbid extension is [declaring a class final](https://softwareengineering.stackexchange.com/questions/284156/declaring-a-class-final)
        * [When to declare classes final](https://ocramius.github.io/blog/when-to-declare-classes-final/)
    * It communicates intent to other coders and leads self-documenting code. 
        * One wouldn’t have to go through code to see if variable changes. 
    *  Makes the code more safer from bugs.   
        * Final variables are "safer" than non-final variables, because once they are bound there is never a question about what their current state is.


------

# Anti-Patterns or Code Smells

* **Using a class purely as a container of Constants.** This creates a high coupling where every other class depends on this class. 

* **Class Constructor doing a lot of work.** 

    When I write unit tests, I need the ability to inject test data, and to provide test implementations to mock out dependencies and operations that have external side effects. I can't do that when you instantiate any classes within your constructor. Unless the responsibility of your class is the creation of other objects, it shouldn't instantiate any non-trivial classes. This goes hand in hand with the single responsibility problem. The more focussed the responsibility of a class, the easier it is to test (and often easier to use). [Constructor with tons of parameters vs builder pattern](https://softwareengineering.stackexchange.com/questions/311297/constructor-with-tons-of-parameters-vs-builder-pattern)
    
     The easiest and often best approach is for the constructor to take fully-constructed dependencies as parameter, though this shoves the responsibility of managing dependencies to the caller – not ideal either, unless the dependencies are independent entities in your domain model.

* **Using deeply nested if-else blocks.**  

    Use [Early Exit](https://www.quora.com/What-s-the-coolest-coding-pattern-you-ve-seen/answer/James-Liu-20?ch=10&share=2f4c64d2&srid=3HW0) or Switch.

* **Missing thread-safety** 

    You also need to think about "Do I care about threads?". If 2 Threads share a Deck, They could potentially Duplicate or Drop cards. Making Deck Thread-safe also adds overhead though, so you should only accommodate it as much as you think it matters.

* **Function call with many parameters**

    When the language does not offer named parameters, a function call is not self-documenting. Reading a function call with many arguments is quite difficult because you have no idea what the 7th parameter is supposed to do. You wouldn't even notice if the 5th and 6th argument were swapped accidentally, especially if you're in a dynamically typed language or everything happens to be a string, or when the last parameter is true for some reason. Also, They indicate your class might be doing too much.Use Bloch’s builder pattern

*  **Use of null**

    Careless use of null can cause a staggering variety of bugs. For example, if your collection has null elements, then an iterator in a forEach loop can accidentally call methods on them at runtime. And null is unpleasantly ambiguous. It’s rarely obvious what a null return value is supposed to mean — for example, Map.get(key) can return null either because the value in the map is null, or the value is not in the map. A null value can mean failure, can mean success, can mean almost anything. Using something other than null makes your meaning clear. Ideally, null values should be disallowed as parameters and return values. But that is not always possible (sometimes it makes coding easier, e.g. BST algorithms). It is better to validate null and have the algorithm fail fast than silently accept null. it might be tempting to get rid of the Empty class and just use null instead. Resist that temptation. Keep null values out of your data structures, and your life will be happier. Using an object, rather than a null reference, to signal the base case or endpoint of a data structure is an example of a design pattern called sentinel objects. The enormous advantage that a sentinel object provides is that it acts like an object in the datatype, so you can call methods on it. So we can call the size() method even on an empty list. If empty lists were represented by null, then we wouldn’t be able to do that, and as a consequence our code would be full of tests like:


    Every method implicitly ought to have a precondition on its object and array parameters that they be non-null. Every method that returns an object or an array should have a postcondition that its return value is non-null. [MIT Lecture on Null](http://web.mit.edu/6.031/www/fa18/classes/06-specifications/#null_references)

* Use of continue, break or while(true) in loops
    
    Use of continue and break in loops is similar to use of early return instead of storing the result of nested if- else conditionals  returning only at the end.

    while(true} is only good when of the form while(true) { do something, if () break, do something else}. Here, you have to execute some piece of code at least once, and some piece of code based on conditional. Otherwise there’s some code duplication: do something (while condition) (do something else, do something  )

    [Whle true and loop breaking anti-pattern](https://softwareengineering.stackexchange.com/questions/142144/whiletrue-and-loop-breaking-anti-pattern) 
    [Continue and break in loops](https://softwareengineering.stackexchange.com/questions/250706/is-continue-and-break-in-loops-antipattern-bad-practice-in-java)

-------

# Mutable and Immutable Objects

[MIT Course: Immutability](http://web.mit.edu/6.005/www/fa15/classes/09-immutability/)

Objects as Functions

> Are Mutable Objects anti OOD?  They key to OOD is encapsulated objects (with beneficent or other types of mutation possible) which pass messages to each other.  


* **Memory Sharing**

* If there is memory sharing, immutable objects are more memory efficient. (e.g. Immutable Lists). Can be useful in backtracking algorithms. 
* The good thing about mutable objects is they allow sharing. Objects can communicate with each other via a common mutable object. Example: A common counter or shared clock. 
* Copies don’t need to be made: the same object can be used. 

> Consider a string manipulation in a loop. lots of extra copying work and extra objects created. So mutable objects are good as state machines. (think f a counter or a clock) 


**Encapsulation and Rep Exposure**

* By introducing coupling between clients and implementers, Mutable objects make programs harder to change. 

* The object state is set when it is created, and the object never changes after that. Pointer sharing of immutable objects never causes problems, since the objects never change -- eliminates a whole category of bugs. If you can count on the fact that Strings never change, you can rule out that possibility when you’re debugging code that uses Strings – or when you’re trying to establish an invariant for another ADT that uses Strings. Contrast that with a mutable string type, which can be mutated by any code that has access to it. To reason about a bug or invariant involving a mutable string, you’d have to check all the places in the code where the string might be used.

* Multiple references to a mutable objects results in bugs.  This happens, for example, we return a reference to a mutable object to a client or pass it to a server (function) whence to another reference). With aliasing, two different programmers (client and server, or two clients) have two different references to the same object. This means multiple places in your program — possibly widely separated — are relying on that object to remain consistent. To put it in terms of specifications, contracts can’t be enforced in just one place anymore, e.g. between the client of a class and the implementer of a class. Contracts involving mutable objects now depend on the good behavior of everyone who has a reference to the mutable object.

 > Example: An object (client) receives  a mutable date object (e.g. startOfSpring) from a shared space and stores it as a separate reference (myPartyDate). Then the client is free to do whatever to it as it pleases (myPartyDate.setMonth(December). It can change it for everyone using that space (now start of spring has changed to December for everyone!). Worse, it is not the person introducing the bug who faces, but some innocent victim!
    
* Similarly, if we pass a mutable value as a parameter to a server, then other clients using it would not know that it has been changed, and so might break. (e.g. a server working with the  input givendirectly for efficiency reasons, but in the process mutating the client data, like a sorting server sorting the list in-place or a maze-finder changing the grid given )

* Mutation undermines iterators. e.g. if position changes during the iteration, some elements might be skipped.

* So when passed around, we might need to make a lot of defensive copies, But defensive copying forces us to to do extra work and use extra space for every client — even if 99% of the clients never mutate the object. o put it in terms of specifications, contracts can’t be enforced in just one place anymore, e.g. between the client of a class and the implementer of a class. Contracts involving mutable objects now depend on the good behavior of everyone who has a reference to the mutable object. We may end up with lots of copies of the first day of spring throughout memory. If we used an immutable type instead, then different parts of the program could safely share the same values in memory, so less copying and less memory space is required.


> As a symptom of this non-local contract phenomenon, consider the Java collections classes, which are normally documented with very clear contracts on the client and implementer of a class. Try to find where it documents the crucial requirement on the client that we’ve just discovered — that you can’t modify a collection while you’re iterating over it. Who takes responsibility for it? Iterator? List?Collection? Can you find it? The need for global reasoning is a negative consequence of mutability, because contracts expand to cover more parts of the program over more time. Immutability allows us to reason locally, instead of globally 


* [Beneficient Mutation](http://web.mit.edu/6.031/www/fa18/classes/11-abstraction-functions-rep-invariants/#beneficent_mutation): often permits performance improvements like caching (e.g. computing  size  the first time you call size() and caching it as a field variable , data structure rebalancing, and lazy cleanup. (or e.g. reducing the field variables num, den to to their lowest form when a toString() is called).


- [Why don't people use immutable objects](https://softwareengineering.stackexchange.com/questions/151733/if-immutable-objects-are-good-why-do-people-keep-creating-mutable-objects)

[How to create immutable objects in java?](https://stackoverflow.com/questions/6305752/how-to-create-immutable-objects-in-java)

* Don't add any setter method
* Declare all fields final and private. [Example](https://stackoverflow.com/questions/16062274/how-can-an-immutable-object-with-non-final-fields-be-thread-unsafe https://stackoverflow.com/questions/16061030/must-all-properties-of-an-immutable-object-be-final)
* If a field is a mutable object create defensive copies of it for getter methods. [Example](https://stackoverflow.com/questions/34109363/how-can-we-maintain-immutability-of-a-class-with-a-mutable-reference)
* If a mutable object passed to the constructor must be assigned to a field create a defensive copy of it [Example](https://stackoverflow.com/questions/50257305/java-making-a-class-immutable)

* Don't allow subclasses to override methods. This can be done in two ways:
    * Forbid subclasses/inheritence. Ths can be done in two ways:
        * Declaring it final [Why would one declare an immurable class final in Java?](https://stackoverflow.com/questions/12306651/why-would-one-declare-an-immutable-class-final-in-java) 
        * Create a private constructor and a factory to create instances of the immutable class because a class with private constructors can't be extended
    * Declare all methods of the immutable class final so they can't be overriden
    


--------



**Design and document for inheritence or forbid it. Prefer Composition Over Inheritence**

Why?

* If you declare a subtype in Java,  then you must ensure that the subtype’s spec is at least as strong as the supertype’s. The compiler doesn't check it.

    That means B is only a subtype of A if B’s specification is at least as strong as A’s specification. When we declare a class that implements an interface, the Java compiler enforces part of this requirement automatically: for example, it ensures that every method in A appears in B, with a compatible type signature. Class B cannot implement interface A without implementing all of the methods declared in A. But the compiler cannot check that we haven’t weakened the specification in other ways: strengthening the precondition on some inputs to a method, weakening a postcondition, weakening a guarantee that the interface abstract type advertises to clients. If you declare a subtype in Java — implementing an interface is our current focus — then you must ensure that the subtype’s spec is at least as strong as the supertype’s. Mutable Square with a setDimensions (width, height) method from Mutable Rectangle, for example, breaks clients: it masquerades as a Mutable Rectangle, but clients might depend on it as behaving like a general rectangle, but suddenly it might break because not all squares behave like rectangles. For example,  setDimensions (width, height) might break when width is not equal to rectangles. (Immutable Square is a subType of immutable Rectangle.) [MIT Lecture on Interface and Enums](http://web.mit.edu/6.031/www/fa18/classes/12-interfaces-enums/)

* [Fragile Base Class problem](https://en.wikipedia.org/wiki/Fragile_base_class). Child extends Father extends Grandfather. Father implements foo. Grandfather class implements foo(), unaware of Father class’s foo() method. Now Child needs foo. Which foo will it get access to? 


* **Inheritance breaks encapsulation.**


    In contrast to inheritance, in composition/delegation our class has a simple client relationship with the delegate -- we are not exposed to how it is implemented. Writing client code is a simpler task than writing subclass code. Requires writing the trivial sort of one-line "pass-back" methods that re-send messages to the delegate.

    Composition is a "has-a" relationship, while inheritence is an is-a relationship.Can also think of delegation as a "wrapper" strategy (aka "Adapter" pattern). HashMap values() returns an object that appears to be a collection of the values in the map by wrapping the (delegate) map.

```java
class MyClass { 
    private Oracle oracle; 
    public MyClass() { 
        oracle = new Oracle(); 
        // allocate our "owned" Oracle delegate 
    } 
    // Re-send message to delegate 
    public String answer() { 
        return "not " + oracle.answer(); 
    } 
}
```

* In multiple inheritance, its not clear which method is inherited.

    > Copier extends Scanner, Printer. 
    > Scanner,  Printer extends PoweredDevice. 
    > PoweredDevice halt method stops power.  
    > Printer overwrites halt() method which stops printing.    

    Which halt() method does Copier have access to? 
    If your Copier paper jams, you might want to tell it to halt() to prevent damage. Fortunately, you don’t have to write that method because it’s already implemented in Printer. Unfortunately, because inheritance usually is implemented via depth-first search of the inheritance tree, you’ve called the PoweredDevice.halt() method, removing power to the Copier altogether, losing all of the other queued jobs. 

* Problems arise because of two conflicting tendencies of classes: classes tend to increase in size as they take on more responsibilities, but code reuse requires decrease in size.  Inheritance shouldn’t be used to share code. Although one of the advantages of inheritance is that you can put common code in the parent class, sharing code shouldn't be the reason why you use inheritance. Inheritance should be used to used to model classes that share behavior, not merely code. 
And A pure behavior, sans state should not be a class in the first place. (Egglaying NOT OK. Mammal OK)

- Say a class has a method someMethod() which invokes a non-static, non-final-non-abstract method someOverridableMethod(). Let say a subClass overrides this method. Now this breaks the someMethod() implementation, without the subClass knowing about it. (The interaction of inherited classes with their parents can be surprising and unpredicatable if the ancestor wasn't designed to be inherited from.)



> Say we have a class Duration which extends Object. Lets say a subClass overloads the method (e.g. equals(Duration d) overloads equals(Object o)) Now the compiler chooses the method based on object type at runTime. d1.equals(d2) will return true while d1.equals(o2) returns false, even though both d2 and o2 refer to the same object.




**How to document for inheritance?**

Methods of a class can be:

- private. 
    - not possible to override private method in Java. Since method overriding works on dynamic binding, its  private methods are not even visible to Child class, they are only visible and accessible in the class on which they are declared. 
- abstract 
    - So that only concrete implementations specify them at the time of object creation Other methods defined in the class, thus do not depend on its implementation.
- non-static final
    - Final methods cannot be overrid
- static
    - Parent class methods that are static are not part of a child class (although they are accessible) so there is no question of overriding it.  Even if you add another static method in a subclass, identical to the one in its parent class, this subclass static method is unique and distinct from the static method in its parent class.
- empty implementation
- non-static, non-final, non-abstract, non-empty.
    -  These methods are overridable.

* If you feel that you must allow inheritance from such a class, one reasonable approach is to ensure that the class never invokes any of its overridable methods and to document this fact. In other words, eliminate the class’s self-use of overridable methods entirely. In doing so, you’ll create a class that is reasonably safe to subclass. Overriding a method will never affect the behavior of any other method.


- [Good reason to prohibit inheritance in Java](https://stackoverflow.com/questions/218744/good-reasons-to-prohibit-inheritance-in-java)
- [French Guy on Composition over Inheritance](https://www.youtube.com/watch?v=wfMtDGfHWpA&t=2s)
- [Composition Inhertiance and Aggregation in JS](https://stackoverflow.com/questions/8696695/composition-inheritance-and-aggregation-in-javascript)
- [Composition over Inheritence Reddit](https://www.reddit.com/r/programming/comments/5dxq6i/composition_over_inheritance/da8bplv/)










        

----------

# Design Patterns

[Stanford Handout](http://web.stanford.edu/class/archive/cs/cs108/cs108.1092/handouts/19PatternsDelegate.pdf)

**Factory Method**  

Make new instances of a class without exposing the class name. Allows us to be more more sophisticated about what is passed back to clients, e.g. in testing, we can pass a special stub.  Since the client just calls makeFoo(), they can't tell.
Example: We avoid providing direct access to database connections (make its constructor private) because they're resource intensive. So we use a static factory method getDbConnection that creates a connection if we're below the limit.  Otherwise, it tries to provide a "spare" connection, failing with an exception if there are none.

The "factory" is a mechanism for clients to create/get new instances of some implementation without needing to know or depend on the particular implementing class. Rather than the client call Foo f = new Foo(), they call Foo f = Foo.makeFoo()-- "makeFoo()" is a "factory" method in this case, returning a new instance to the client. The exact class of what is passed back may vary at runtime to be a particular subclass of Foo, but the client does not need to know about that. 

------

**Sentinel**  [MIT Lecture on recursion](http://web.mit.edu/6.031/www/fa18/classes/16-recursive-data-types/1-recursive/)
Using an object, rather than a null reference, to signal the base case or endpoint of a data structure is an example of a design pattern called sentinel objects. The enormous advantage that a sentinel object provides is that it acts like an object in the datatype, so you can call methods on it. So we can call the size() method even on an empty list. If empty lists were represented by null, then we wouldn’t be able to do that, and as a consequence our code would be full of tests like:
if (lst != null) n = lst.size();
which clutter the code, obscure its meaning, and are easy to forget. Better the much simpler
n = lst.size();
which will always work, including when an empty lst refers to an Empty object.
Keep null values out of your data structures, and your life will be happier.

----

**Iterator pattern** 

Allow some to iterate over the elements in a collection (start, access each element, detect when at end) without knowing the collection implementation. In Java, this is done with the Iterator interface, which defines methods hasNext() and next().

-----

**Adaptor pattern** 

Start with an object that implements interface X. The "Adapter" wraps the X object, and translates between it and the rest of the world to make it look like interface Y. This is a form of delegation, implementing a different interface from the delegate. • e.g. HashMap supports a values() method that returns a Collection of all the values in the HashMap. In reality, it does not construct an actual Collection of all the values. Instead, it builds a thin adapter object that implements the Collection interface and has a pointer to the original HashMap. When this adapter gets a message like size(), it passes it through to the underlying HashMa

-----

**Builder** [How to make an object immutable in java](https://stackoverflow.com/questions/24545239/how-to-make-object-immutable-in-java)

* Bloch’s builder pattern:  avoid the problem of too many constructor parameters. To make classes for objects which are both immutable and have named parameters (parameters which may or mayn’t be present, and whose order is not important).
- [Why do we need a builder class?](https://softwareengineering.stackexchange.com/questions/380397/why-do-we-need-a-builder-class-when-implementing-a-builder-pattern) clearly separateS constructed objects from objects under construction.  This approach requires a clear transition from under-construction to constructed.  For the consumer, there is no way to confuse an under-construction object with a constructed object: the type system will enforce this.  That means sometimes we can use this approach to "fall into the pit of success", as it were, and, when making abstraction for others (or ourselves) to use (like an API or a layer), this can be a very good thing.


* GoF Pattern: If the runtime representation of the final (possibly immutable) object is optimized for reading and/or space usage, but not for update.  String and StringBuilder are good examples here.  Repeatedly concatenating strings is not very efficient, so the StringBuilder uses a different internal representation that is good for appending — but not as good on space usage, and not as good for reading and using as the regular String class. (Possible comparison: HandBuilderClass and Hand which builds a hand of Best five hands)
Singleton: [](http://www.drdobbs.com/jvm/creating-and-destroying-java-objects-par/208403883?pgno=3)

----

**Accumulator**: Used in Recursion. A mutable object is passed around in a recursive function.

---

**Strategy Pattern**: [Use of enums to implement Strategy Pattern](https://stackoverflow.com/questions/4709175/what-are-enums-and-why-are-they-useful)

----

**Interpretor Pattern**: [Interpretor Pattern in Recursion](http://web.mit.edu/6.031/www/fa18/classes/16-recursive-data-types/1-recursive/)

----

**Template Pattern**: Tree Traversals

----

**Visitor Pattern**
[Understanding the need for Visitor Pattern](https://softwareengineering.stackexchange.com/questions/333692/understanding-the-need-of-visitor-pattern)
