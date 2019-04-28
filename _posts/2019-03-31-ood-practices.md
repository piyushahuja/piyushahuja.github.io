---
layout: post-journal
title: Design Patterns
date:   2019-03-21 09:00:11
tag: 
categories: interview
excerpt: 
permalink: /ood-practices
comments: false

---



The essential idea is that an abstract data type is defined by its operations. The set of operations for a type T, along with their specifications, fully characterize what we mean by T. when we talk about the List type, what we mean is not a linked list or an array or any other specific data structure for representing a list. Instead we mean a set of opaque values – the possible objects that can have List type – that satisfy the specifications of all the operations of List: get(), size(), etc. (maps to interfaces in Java?)

The key idea of data abstraction is that a type is characterized by the operations you can perform on it. A number is something you can add and multiply; a string is something you can concatenate and take substrings of; a boolean is something you can negate, and so on. In a sense, users could already define their own types in early programming languages: you could create a record type date, for example, with integer fields for day, month, and year. But what made abstract types new and different was the focus on operations: the user of the type would not need to worry about how its values were actually stored, in the same way that a programmer can ignore how the compiler actually stores integers. All that matters is the operations.

A second view is this: An abstract data type is a set of values (or the range of the AF of its representations). This way of thinking about datatypes — as a recursive definition of an abstract datatype with concrete variants — is appealing not only because it can handle recursive and unbounded structures like lists and trees, but also because it provides a convenient way to describe operations over the datatype, as functions with one case per variant. the datatype definition maps to the abstract interface, concrete variants, and constructors.

> This is a recursive definition of ImList as a set of values. Here’s the high-level meaning: the set ImList consists of values formed in two ways: either by the Empty constructor, or by applying the Cons constructor to an element elt and an ImList rest.    
> A more detailed reading: ImList<E> is a generic type where for any E, the set ImList<E> consists of the values formed: either by the Empty constructor, or by applying the Cons constructor to a value called elt of type E and a value called rest of type ImList<E>.

> Using callbacks requires a programming language in which functions are first-class, which means they can be treated like any other value in the language: passed as parameters, returned as return values, and stored in variables and data structures. In old programming languages, only data was first-class: built-in types (like numbers) and user-defined types. But in modern programming languages, like Python and JavaScript, both data and functions are first-class. First-class functions are a very powerful programming idea. The first practical programming language that used them was Lisp, invented by John McCarthy at MIT. But the idea of programming with functions as first-class values actually predates computers, tracing back to Alonzo Church’s lambda calculus. The lambda calculus used the Greek letter λ to define new functions; this term stuck, and you’ll see it as a keyword not only in Lisp and its descendants, but also in Python. 
> In Java, the only first-class values are primitive values (ints, booleans, characters, etc.) and object references. But objects can carry functions with them, in the form of methods. So it turns out that the way to implement a first-class function, in an object-oriented programming language like Java that doesn’t support first-class functions directly, is to use an object with a method representing the function



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
* [Why can't I define a static method in a Java interface?](https://stackoverflow.com/questions/512877/why-cant-i-define-a-static-method-in-a-java-interface)
    *  One way to implement empty is to have clients call the Empty class constructor to obtain empty lists. This sacrifices representation independence — clients have to know about the Empty class!

    As we saw in Interfaces, a better way to do it is as a static factory method that takes no arguments and produces an instance of Empty. We can put this static method in the ImList interface along with the other operations. This choice was not possible in previous versions of Java, which is why we still write code like:

    List<String> z = new ArrayList<>();
    Perhaps someday Java will offer a List.empty() method to obtain a new empty all-purpose List, but not yet. (List.of() and Collections.emptyList() provide immutable empty lists.)
* There are two worlds in type checking: compile time before the program runs, and run time when the program is executing.At compile time, every variable has a declared type, stated in its declaration. 
    * The compiler uses the declared types of variables (and method return values) to deduce declared types for every expression in the program.
    * At run time, every object has an actual type, imbued in it by the constructor that created the object. For example, new String() makes an object whose actual type is String. new Empty() makes an object whose actual type is Empty. new ImList() is forbidden by Java, because ImList is an interface — it has no object values of its own, and no constructors. * What is method overloading? What is method overriding? Methods are overriden during compile time, but overloaded only on runtime.
* Why can't static methods be overrdiden?
    - Pretend that each class has a hash table that maps method signatures (name and parameter types) to an actual chunk of code to implement the method. When the virtual machine attempts to invoke a method on an instance, it queries the object for its class and looks up the requested signature in the class's table. If a method body is found, it is invoked. Otherwise, the parent class of the class is obtained, and the lookup is repeated there. This proceeds until the method is found, or there are no more parent classes—which results in a NoSuchMethodError.
    - If a superclass and a subclass both have an entry in their tables for the same method signature, the sub class's version is encountered first, and the superclass's version is never used—this is an "override".
    - Now, suppose we skip the object instance and just start with a subclass. The resolution could proceed as above, giving you a sort of "overridable" static method. The resolution can all happen at compile-time, however, since the compiler is starting from a known class, rather than waiting until runtime to query an object of an unspecified type for its class. There is no point in "overriding" a static method since one can always specify the class that contains the desired version




* [What is the point of getters and setters?](https://stackoverflow.com/questions/1461598/what-is-the-point-of-setters-and-getters-in-java/1462424#1462424 )
* [Why use getters and setters?](https://stackoverflow.com/questions/1568091/why-use-getters-and-setters-accessors)

* All private methods are implicitly final. All methods of a final class are final. A field that is both static and final has only one piece of storage that cannot be changed. When using final with object handles rather than primitives the meaning gets a bit confusing. With a primitive, final makes the value a constant, but with an object handle, final makes the handle a constant. The handle must be initialized to an object at the point of declaration, and the handle can never be changed to point to another object. However, the object can be modified; Java does not provide a way to make any arbitrary object a constant.  This restriction includes arrays, which are also objects. Just because something is final doesn’t mean that its value is known at compile-time. This is demonstrated by initializing final variables at run-time using randomly generated numbers. Making object handles final seems less useful than making primitives final.[Link]( https://www.codeguru.com/java/tij/tij0071.shtml )

* Check rep invariants after every method. You should certainly call checkRep() to assert the rep invariant at the end of every operation that creates or mutates the rep – in other words, creators, producers, and mutators. Look back at the RatNum code above, and you’ll see that it calls checkRep() at the end of both constructors. Observer methods don’t normally need to call checkRep(), but it’s good defensive practice to do so anyway. Why? Calling checkRep() in every method, including observers, means you’ll be more likely to catch rep invariant violations caused by rep exposure.


* Use final liberally. Final gives you static checking for unreassignable references.
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


-----

# Common Source of Bugs

- Using equals method to compare StringBuilders. StringBuilders is a mutable object which inherits equals from Object, and thus compares for observational equality(memory references) and not behavior equality.

- Not treating primitive wrapper classes like Boolean, Integer etc. as immutable. (e.g. it would be a mistake to pass them as a parameter and expect to be modified in a function, like an accumulator variable is)

- Equals() and HashCode() must be overriden for immutable custom classes, otherwise they inherit these methods from Object class. 

- TreeSet and TreeMap uses compareTo method to differentiate elements, whereas HashSet and HashMap uses equals. By default, compareTo uses equals. This can result in subtle bugs: if you expect two custom different objects to return true on equals but count as different in a TreeSet, you must override compareTo. e.g comparing Poker Hands: you might want the value of same numberd cards of different suits to return true on compareTo, but should return false on equals and counted as different. If you don't override compareTo, this can result in a bug.

-  For mutable objects, it is okay - better not to override the object equals (e.g. StriingBuilder). When equals() and hashCode() can be affected by mutation, we can break the rep invariant of a hash table that uses that object as a key.

- Before we pass a mutable collection to another part of our program, we can wrap it in an unmodifiable wrapper. We should be careful at that point to forget our reference to the mutable collection, lest we accidentally mutate it. (One way to do that is to let it go out of scope.) Just as a mutable object behind a final reference can be mutated, the mutable collection inside an unmodifiable wrapper can still be modified by someone with a reference to it, defeating the wrapper.

- HashMap keys and values have to be casted propely before being used as primitive types.

- Missing Semicolons.

- int overflow.
    - especially in functions where n grows largely, like fibonacci or any combinatorial explosion.  
    - Also in general, doing stuff like int mid = (low + high) / 2 and not taking into account integer overflow can lead to a bug. Fix the bug by this: int mid = low + ((high - low) / 2); (. It is not sufficient merely to prove a program correct; you have to test it too.
    * [Bug in Java BST](https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html)
    * [Reverse an integer](https://stackoverflow.com/questions/21070506/reverse-integer-leetcode-how-to-handle-overflow)

- Violation of preconditions that the compiler cannot check. 
    - (e.g. an interface is supposed to be immutable, but some iimplementatiin adds a mutator method. Or merge method: inputs are supposed to be sorted, but a recursive call doesnt do it.) compiler cannot check that we haven’t weakened the specification in other ways: strengthening the precondition on some inputs to a method, weakening a postcondition, weakening a guarantee that the interface abstract type advertises to clients.  If you declare a subtype in Java — implementing an interface is our current focus — then you must ensure that the subtype’s spec is at least as strong as the supertype’s. Classic example: no correct way for MutableSquare to implement MutableRectangle.setSize(..)and mutable square is not a subtype of mutable rectangle.        

----------

# Design Patterns


[MIT Notes](https://www.cs.uct.ac.za/mit_notes/software/htmls/ch08s03.html)   
[Stanford Handout](http://web.stanford.edu/class/archive/cs/cs108/cs108.1092/handouts/19PatternsDelegate.pdf)
[Design Patterns implemented in Java](https://github.com/iluwatar/java-design-patterns)

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

**Iterator pattern**  abstracts away from the details of iterating over a data structure

Allow some to iterate over the elements in a collection (start, access each element, detect when at end) without knowing the collection implementation. In Java, this is done with the Iterator interface, which defines methods hasNext() and next().

Iterator gives you a sequence of elements from a data structure, without you having to worry about whether the data structure is a set or a hash table or a list or an array — the Iterator looks the same no matter what the data structure is.

For example, given a List<File> files, we can iterate using indices:
```java
for (int ii = 0; ii < files.size(); ii++) {
    File f = files.get(ii);
    // ...
```

But this code depends on the size and get methods of List, which might be different in another data structure. Using an iterator abstracts away the details:
```java
Iterator<File> iter = files.iterator();
while (iter.hasNext()) {
    File f = iter.next();
     // ..
```
-----

**Adaptor pattern** 

Start with an object that implements interface X. The "Adapter" wraps the X object, and translates between it and the rest of the world to make it look like interface Y. This is a form of delegation, implementing a different interface from the delegate.

> HashMap supports a values() method that returns a Collection of all the values in the HashMap. In reality, it does not construct an actual Collection of all the values. Instead, it builds a thin adapter object that implements the Collection interface and has a pointer to the original HashMap. When this adapter gets a message like size(), it passes it through to the underlying HashMap

-----

**Builder** 

* Bloch’s builder pattern:  Avoid the problem of too many constructor parameters. To make classes for objects which are both immutable and have named parameters (parameters which may or maynot be present, and whose order is not important).
    * [Why do we need a builder class?](https://softwareengineering.stackexchange.com/questions/380397/why-do-we-need-a-builder-class-when-implementing-a-builder-pattern) clearly separates constructed objects from objects under construction.  This approach requires a clear transition from under-construction to constructed.  For the consumer, there is no way to confuse an under-construction object with a constructed object: the type system will enforce this.  That means sometimes we can use this approach to "fall into the pit of success", as it were, and, when making abstraction for others (or ourselves) to use (like an API or a layer), this can be a very good thing.


* GoF Pattern: If the runtime representation of the final (possibly immutable) object is optimized for reading and/or space usage, but not for update.  

> String and StringBuilder are good examples here.  Repeatedly concatenating strings is not very efficient, so the StringBuilder uses a different internal representation that is good for appending — but not as good on space usage, and not as good for reading and using as the regular String class.

> Possible comparison: HandBuilderClass and Hand which builds a hand of Best five hands. Can change HandBuilderClass based on rules. Or Maybe it should just be a function?

-----

**Singleton** [Creating and destroying java objects](http://www.drdobbs.com/jvm/creating-and-destroying-java-objects-par/208403883?pgno=3)

----

**Accumulator**: Used in Recursion. A mutable object is passed around in a recursive function.

---

**Strategy Pattern**  (Also *Inversion of Control*)

[Use of enums to implement Strategy Pattern](https://stackoverflow.com/questions/4709175/what-are-enums-and-why-are-they-useful)

----

**Interpretor Pattern**: [Interpretor Pattern in Recursion](http://web.mit.edu/6.031/www/fa18/classes/16-recursive-data-types/1-recursive/)

Let’s consider two disadvantages of the Interpreter pattern:

For a complicated operation on a datatype with many variants, the code to implement the operation will be distributed across all the different variant classes. If we want to inspect all the code, refactor it, or fix a bug, we must find it in all those different places: the code is harder to understand. Bugs in our recursive implementations are easier to introduce and harder to find.

If we wish to add a new operation to our type, we must modify the interface and every implementing class. If there are many concrete variants that already have substantial code, perhaps written and maintained by other programmers, this change will be more difficult to make than if we could keep the code for the new operation in its own separate location.  


----

**Template Pattern** (Also *Inversion of Control*)

Tree Traversals

----

**Visitor Pattern** (Also *Treating Functions as First Class Values*)
[Understanding the need for Visitor Pattern](https://softwareengineering.stackexchange.com/questions/333692/understanding-the-need-of-visitor-pattern)
[Visitor class as input to DFS, BFS ](https://stackoverflow.com/questions/40810454/how-to-implement-graph-search-dfs-with-object-oriented-design/40810666#40810666)

The Interpreter pattern makes it easier to add new variants, because we don’t have to change any of our existing code: we just need to implement all the various operations as methods in the new variant class.

The Visitor pattern makes it easier to add new operations. Instead of having to modify both the interface and every variant class, we just need to create a new, e.g., Formula.Visitor implementation with all the code for our new operation. There is no change to existing classes or interfaces

We will also use the Visitor pattern when we intend clients of our type to know and understand its underlying structure and implement their own operations — and we’ve already seen a common and important use case for this: parse trees!

>  If a Visitor pattern emerges it's probably because I've refactored out duplication, not because I thought ahead of time about the similarities of rendering a tree versus adding up its values.

----

**Composite Pattern**

Music = Note(duration:double, pitch:Pitch, instrument:Instrument)
        + Rest(duration:double)
        + Concat(m1:Music, m2:Music)
Composite
Music is an example of the composite pattern, in which we treat both single objects (primitives, e.g. Note and Rest) and groups of objects (composites, e.g. Concat) the same way.

Formula is also an example of the composite pattern.

The graphical user interface (GUI) view tree relies heavily on the composite pattern: there are primitive views like JLabel and JTextField that don’t have children, and composite views like JPanel and JScrollPane that do contain other views as children. Both implement the common JComponent interface.

The composite pattern gives rise to a tree data structure, with primitives at the leaves and composites at the internal nodes.

----

**Functional Objects** (Also *Treating Functions as First Class Values*)

Design pattern when a language doesn't have first-class functions.

Paul Graham says design patterns are about deficencies in a language. If you're using a design pattern, it means you're not using abstractions which are good enough.  See e.g. Python while supporting functions as first class citizens, didn't have support for methods as first class citizens. See how Guido Van Rossum designed an abstraction/design pattern in the python language, so that we programmers dont have to do this: [First Class Everything](http://python-history.blogspot.com/2009/02/first-class-everything.html).

----
**Listener Pattern or Pub-Sub** (Also *Inversion of Control*)

- [MIT on Listener](http://courses.csail.mit.edu/iap/interview/Hacking_a_Google_Interview_Handout_3.pdf)

The problem:

Input is handled in console user interfaces and servers ths way: a single input loop that reads commands typed by the user or messages sent by the client, parses them, and decides how to direct them to different modules of the program.

If a GUI email client were written that way, it might look like this (in pseudocode):

```java
while (true) {
    read mouse click
    if (clicked on Check Mail button) doRefreshInbox();
    else if (clicked on Compose button) doStartNewEmailMessage();
    else if (clicked on an email in the inbox) doOpenEmail(...);
    ...
}

```

This is, for example, how the Node.js event loop works. 

But in a GUI, we don’t directly write this kind of method, because **it’s not modular.** GUIs are put together from a variety of library components – buttons, scrollbars, textboxes, menus – that need to be self-contained and handle their own input.  Ideally we would make the clients (GUI elelemts) ready for change by allowing them to provide their own code to run when an event occurs, so that the behavior doesn’t have to be hard-coded into the implementation beforehand. Writing a single giant input loop to handle every possible event in a large system is neither safe from bugs nor easy to understand: that single piece of code becomes an all-knowing all-controlling behemoth. Callbacks allow each module in the system to be responsible for their own events.

So the control flow through a graphical user interface proceeds like this:

* A top-level event loop reads input from mouse and keyboard and calles listeners: note: all listenerss provide the same interface.  
* Each listener does its thing (which might involve e.g. modifying objects in the view tree), and then returns immediately to the event loop. The last part – listeners return to the event loop as fast as possible – is very important, because it preserves the responsiveness of the user interface.

GUI event handling is an instance of the Listener pattern, also known as Publish-Subscribe. Another Example would be [Promises](https://javascript.info/promise-basics).

In the Listener pattern:

* An event source generates (or publishes) a stream of discrete events, which correspond to state transitions in the source.
* One or more listeners register interest (subscribe) to the stream of events, providing a function to be called when a new event occurs.



A callback is a function that a client provides to a module for the module to call. The actionPerformed listener function is a callback. This is in contrast to normal control flow, in which the client is doing all the calling: calling down into functions that the module provides. With a callback, the client is providing a piece of code for the implementer to call.

The kind of callback used in the Listener pattern is not an answer to a one-time request like your account balance. It’s more like a regular service that the bank is promising to provide, using your callback number as needed to reach you. A better analogy for the Listener pattern is account fraud protection, where the bank calls you on the phone whenever a suspicious transaction occurs on your account.

Oone of the challenges of using callbacks from within the implementation of an abstract data type. The implementer can’t control what the callback might do. The callback might call another operation of the same object, as happened here, forcing us to deal with reentrancy from within the same thread, which lock synchronization doesn’t prevent.

Handing control to a callback function is similar to returning to a caller. An implementer has to be careful to put the rep in a clean state before calling any callbacks – in this case, meaning that no iterations over the rep are underway, but in general, also ensuring that the rep invariant is already satisfied. (see Counter)
Reference: [Callbacks](http://web.mit.edu/6.031/www/fa18/classes/24-callbacks/#first-class_functions)


------
**MapReduce Abstraction** (Also *Treating Functions as First Class Values*)

map/filter/reduce patterns in this reading do something similar to Iterator, but at an even higher level: they treat the entire sequence of elements as a unit, so that the programmer doesn’t have to name and work with the elements individually. the control statements disappear: specifically, the for statements, the if statements, and the return statements in the code

Map/filter/reduce can often make code shorter and simpler, and allow the programmer to focus on the heart of the computation rather than on the details of loops, branches, and control flow.

By arranging our program in terms of map, filter, and reduce, and in particular using immutable datatypes and pure functions (functions that do not mutate data) as much as possible, we’ve created more opportunities for safe concurrency. Maps and filters using pure functions over immutable datatypes are instantly parallelizable — invocations of the function on different elements of the sequence can be run in different threads, on different processors, even on different machines, and the result will still be the same.

Java’s map/filter/reduce implementation supports this concurrency automatically. We can take any Stream and create a parallelized version of it by calling parallel():

Stream<Path> paths = files.parallel().map(File::toPath);
Or on a collection, we can call parallelStream().

Subsequent map/filter/reduce operations on the parallel stream may be executed in separate threads created automatically by Java. So this simple change allows the file loading and word splitting to happen in parallel.

MapReduce is a pattern for parallelizing very large computations in this way, that require a cluster of machines to compute.