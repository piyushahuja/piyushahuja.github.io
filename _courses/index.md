---
title: Courses
layout: page-home
permalink: /courses
section: Home
lesson: index
---



<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>



<!-- These are in-person workshops I offer in Cambridge.
 -->

{% for page in site.courses %}
{% if page.lesson == "intro" %}
<div class = "postit">
<a class="postit-link" href="{{ page.url | prepend: site.baseurl }}">{{ page.title }}</a> 
<span class="post-tag">{{ page.tag}}</span>
</div>
{% endif %}
{% endfor %}

  


<!-- 
  <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>
 -->
