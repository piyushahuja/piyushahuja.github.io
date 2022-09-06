---

layout: page-home
title: History of Ideas
comments: false
lesson: intro

---


<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>


{% assign sortedPosts = "" | split: ',' %}



{% for post in site.courses %}
{% if post.course == "ideas" %}
{% assign sortedPosts = sortedPosts | push: post %}
{% endif %}
{% endfor %}

{% assign sortedPosts = sortedPosts | sort: 'lesson' %}



{% for post in sortedPosts %}
<div class="section list">
  
  <h1> Lesson {{post.lesson}} </h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  </p>
  <!--<p class="excerpt">{{ post.excerpt }}</p>-->
</div>

{% endfor %}
