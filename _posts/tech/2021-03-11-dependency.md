---
layout: post-normal
title: Dependency Management
date:   2020-03-11 09:00:11
tag: 
categories: tech
excerpt: 
permalink: /dependency
comments: false

---

How do I introduce external code in my project which it depends on?

- Git Submodules: If you want to work on the code in the submodule at the same time as you’re working on the code in the main project Otherwise use a simpler package management system (such as Maven or Rubygems).
- **Package Repositories** with a package management system: apt, maven, rubygems, brew, pip, npm
- **Vendoring** (Copying the code)

----

[Things One Might Want From Dependency Management](https://news.ycombinator.com/item?id=20672051)
[Things One Might Want From Dependency Management II](https://cheat.readthedocs.io/en/latest/python/piptools.html)



At a more macro level, your software projects are likely to have dependencies that are themselves projects. You might depend on installed programs (like python), system packages (like openssl), or libraries within your programming language (like matplotlib). 

# Package Repositories 

These days, most dependencies will be available through a repository that hosts a large number of such dependencies in a single place, and provides a convenient mechanism for installing them. Some examples include the Ubuntu package repositories for Ubuntu system packages, which you access through the apt tool, RubyGems for Ruby libraries, PyPi for Python libraries, or the Arch User Repository for Arch Linux user-contributed packages.

Pip eventually goes to PyPi, a global repository of Python packages. Checks dependencies, gets them.  As opposites to pip, Anaconda vets the repository: safe, stable, supported and useful.  Anaconda starts from a base list of packages assuming you are a data scientist.  Miniconda starts from scratch. 

# Versioning

Most projects that other projects depend on issue a version number with every release. Usually something like 8.1.3 or 64.1.20192004. They are often, but not always, numerical. Version numbers serve many purposes, and one of the most important of them is to ensure that software keeps working. Imagine, for example, that I release a new version of my library where I have renamed a particular function. If someone tried to build some software that depends on my library after I release that update, the build might fail because it calls a function that no longer exists! Versioning attempts to solve this problem by letting a project say that it depends on a particular version, or range of versions, of some other project. That way, even if the underlying library changes, dependent software continues building by using an older version of my library.

That also isn’t ideal though! What if I issue a security update which does not change the public interface of my library (its “API”), and which any project that depended on the old version should immediately start using? This is where the different groups of numbers in a version come in. The exact meaning of each one varies between projects, but one relatively common standard is semantic versioning. With semantic versioning, every version number is of the form: major.minor.patch. The rules are:

If a new release does not change the API, increase the patch version.
If you add to your API in a backwards-compatible way, increase the minor version.
If you change the API in a non-backwards-compatible way, increase the major version.
This already provides some major advantages. Now, if my project depends on your project, it should be safe to use the latest release with the same major version as the one I built against when I developed it, as long as its minor version is at least what it was back then. In other words, if I depend on your library at version 1.3.7, then it should be fine to build it with 1.3.8, 1.6.1, or even 1.3.0. Version 2.2.4 would probably not be okay, because the major version was increased. We can see an example of semantic versioning in Python’s version numbers. Many of you are probably aware that Python 2 and Python 3 code do not mix very well, which is why that was a major version bump. Similarly, code written for Python 3.5 might run fine on Python 3.7, but possibly not on 3.4.


# Lock File

A lock file is simply a file that lists the exact version you are currently depending on of each dependency. Usually, you need to explicitly run an update program to upgrade to newer versions of your dependencies. There are many reasons for this, such as avoiding unnecessary recompiles, having reproducible builds, or not automatically updating to the latest version (which may be broken). Having all your dependencies, including their dependencies, explicitly specified (including name and version) is what gives you reproducible builds. Ruby does the same thing with Gemfile.lock. npm does the same thing with package-lock.json. 



**Example: Ruby**

You have a gemfile.lock which lists all needed versions of all gems for your sit. "bundle install" then installs all those and "bundle execute" uses just what is specified in the gem lock file.

Bundler is handy for larger sites with lots of specific dependencies as it keeps everything in sync so someone else could build the site on a different computer and get the same exact setup as the first person.

Example: [Deno](https://kitsonkelly.com/posts/deno-is-a-browser-for-code/)

**Example: Python**

Theree's no  builtin way to automatically define a lock file. The recommended way is this:

```python
 pip freeze > requirements.txt
 pip install -r requirements.txt? 


```
This would install the exact versions. The above flow using pip does not have the following properties

* pip doesn't distinguish between transitive and instransitive dependencies, or if they conflicted at install time.  We no longer know which packages in that file we originally wanted, and which were pulled in as dependencies. Why is this a problem? If dependencies need to change (i.e. we need to remove any dependency, or upgrade one)
    * For example, maybe we needed Celery, but installing it pulled in a half-dozen other packages. Later we might decide we don’t need Celery anymore and remove it from the requirements file, but we don’t know which other packages we can also safely also remove. 
    * It gets very complicated if we want to upgrade some of the packages, for the same reasons. Which are are direect dependencies, which we want to upgrade, and which are indirect, which some other package needs? Use: pip-tools or poetry 
       pip freeze literally list all packages that's installed in the current environment besides basic toolings such as setuptools (and you could even instruct it to list those as well)?
* Doesn’t support multiple sets of dependencies (e.g. dev vs. prod, where prod is not necessarily a subset of dev).  It catches way too much. IPython, black and the testing libraries are _not_ a part of my actual dependencies and shouldn't be installed in production. A good UI for a dependency manager at the very least distinguishes between dev and production context, and ideally lets me define custom contexts. 

How to do it?

Use: Poetry + pipenv, or pip-tools.

Your should create `setup.py/cfg` and declare your immediate dependencies, then you can optionally provide version _ranges_ that are acceptable. I highly recommend to install pip-tools and use pip-compile to generate requirements.txt, that file then works like a lock file and it is essentially picking the latest versions within restrictions in setup.cfg


## Vendoring

An extreme version of this kind of dependency locking is vendoring, which is where you copy all the code of your dependencies into your own project. That gives you total control over any changes to it, and lets you introduce your own changes to it, but also means you have to explicitly pull in any updates from the upstream maintainers over time.

**Example: Python**

Python has no vendoring.  There is no a builtin way to create a redistributable executable with all your dependencies.

Why does it not have vendoring as builtin?

Not everyone builds reproducible software with Python (or in general) and how you handle dependencies can vary. Python leaves it open how you do it: globally installed packages, local packages, or a mix of both. In the end, it needs to find the import in the PYTHONPATH, so there's no magic involved, and there are multiple robust options to choose from.

How to do it, then?

To create a redistributable executable with all your dependencies, you can either use pyinstaller or nuitka, both of which are very actively maintained/developed and continually improving, or docker.

Alternatively, this can be done via the setuptools route. It is the one that's most common and available by default. It has a weakness though, it started with people writing setup.py file and defining all parameters there. Because setup.py is actually a python program it encourages you to write it as a program and that creates issues, setuptools though for a wile had a declarative way to declare packages using setup.cfg file, you should use that and your setup.py should contain nothing more than a call to setup().

Example: **Crook's Reproducible Build**

Is it a single, self-contained script, or are there modules you’ve written?  If there are modules, you’ll probably need a virtualenv, otherwise Python won’t know where to look for them. Yes, in principle, you could chmod +x your Python script, add the necessary shebang and then hardcode sys.path ( modifying the python module search path within the script (by modifying sys.path) or environment variable PYTHONPATH?), but that tightly couples you to the Python binary (even if you did #!/usr/bin/env python3 you might get Python 3.1 on some system, which wouldn’t work) and the module path, unless you go to the trouble of establishing the module path dynamically. That seems like a lot of work. virtualenvs make everything much easier, at the expense of having to create the virtualenv once.

In production, one wouldn’t do it this way: if you distributed binaries executables then they’d be installed per the usual Python setuptools routine. 

# Virtual Environments


**Why don’t other languages have them?**

Other languages don’t have system-level package management. Python does.

Node: the node_modules folder it like a virtual env. In the Node.js/npm ecosystem, we have conflated the management of code on our local machine, with a centralized registry of code to help facilitate discovery.  Node's dependency managers npm/yarn just copy the versioned dependencies from their cache folder into the local node_modules folder and remove transitive dependencies duplicates when possible by flattening them into node_modules.

Because of the heavy reliance on semantic versioning, and the complex dependency graphs that tend to come from the Node.js/npm eco-system, having a repeatable build became a real problem. Yarn introduced the concept of lock files, of which npm followed suit. My personal feeling is it was a bit of the tail wagging the dog, in that the behaviours of developers in the eco-system created a problem that then needed an imperfect solution to fix it. Any of us that have lived with the eco-system for a long time know that the fix to a lot of issues is rm -rf node_modules package-lock.json && npm install.


Deno has two solutions for that. First, is that Deno caches modules. That cache can be checked into your source control, and the --cached-only flag will ensure that there is not attempts to retrieve remote modules. The DENO_DIR environment variable can be used to specify where the cache is located to provide further flexibility.

Second, Deno supports lock files. --lock lock.json --lock-write would write out a lock file with hashes of all the dependencies for a given workload. This would be used to validate future runs when the --lock lock.json is used.

There are also a couple other commands that make managing repeatable builds. deno cache would resolve all the dependencies for a supplied module and populate the Deno cache. deno bundle can be used to generate a single file “build” of a workload which all the dependencies are resolved and included in that file, so only that single file is needed for future deno run commands.


**Why do I need to make a "virtual environment" to have separate dependencies, and then source it my shell?**

If you have an application A which uses different versions than application B, it could be solved by allowing python to keep multiple versions of the same packages, but then you would like to count on system package manager to keep care of that, and pip, rpm, deb don't offer this functionality by default. So you would once again have to use some kind of virtualenv like environment that's disconnected from the system packages.

Why do I need to have fresh copies of my dependencies, even if they are the same versions, in each virtual environment?   

You don't you can install your dependencies in system directory and configure virtualenv to see these packages as well, I prefer though to have it completely isolated from the system.

Having to do a complete install of all the packages into an empty virtual environment can be slow, which is especially aggravating when we know little or nothing has changed, but that’s the only way to be sure we have exactly what we want.

------








