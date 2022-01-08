---

layout: page-home
title: Algorithms
comments: false
course: philosophy
lesson: intro

---


<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>



{% for post in site.courses %}
{% if post.course == "algorithms" %}
<div class="section list">
  <h1>Lesson {{post.lesson}}</h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  </p>
  <!--<p class="excerpt">{{ post.excerpt }}</p>-->
</div>
{% endif %}
{% endfor %}
  
