---

layout: page-home
title: History of Ideas
comments: false
lesson: intro

---


<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>



{% for post in site.courses %}
{% if post.course == "ideas" %}
<div class="section list">
  <h1>Lesson {{post.lesson}}</h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  </p>
  <!--<p class="excerpt">{{ post.excerpt }}</p>-->
</div>
{% endif %}
{% endfor %}
  

Articles:

[Scientific Revolution](https://twitter.com/michael_nielsen/status/1473312007923257344)
[Emergence of Modern Astronomy](https://thonyc.wordpress.com/2020/07/15/the-emergence-of-modern-astronomy-a-complex-mosaic-part-xl/)

* Newton
* Galileo
* Da Vinci
* Einstein
* Von Neumann
* Turing
* Archimedes
* Aristotle
* Pythagoras
* Claude Shannon
