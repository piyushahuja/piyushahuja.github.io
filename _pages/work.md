---
layout: page-home
title: Work Experience
permalink: /work
section: Home
---


<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>

{% for post in site.categories.work %}
<div class="section list">
  <h1>{{ post.startYear}} - {{ post.endYear}}</h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  <a class="comments">{{ post.designation}}</a>
  </p>
  <p class="excerpt">{{ post.excerpt }}</p>
</div>
{% endfor %}
  


<!-- 
  <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>
 -->
