---
layout: page-home
title:  
permalink: /philosophy
section: Home
---

<center> 
  <figure>
    <img src="files/images/oxford/spires.jpg" alt="Oxford" width="600" height= "800" /> 
     <figcaption>From Duke Humfrey's library (2016)</figcaption>
  </figure>
</center> 




<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>

{% for post in site.categories.philosophy %}
<div class="section list">
  <h1>{{ post.date | date_to_string }}</h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  <a class="comments" href="{{ post.url }}#disqus_thread">View Comments</a>
  </p>
  <!--<p class="excerpt">{{ post.excerpt }}</p>-->
</div>
{% endfor %}
  
<script type="text/javascript">
//<![CDATA[
(function() {
    var links = document.getElementsByTagName('a');
    var query = '?';
    for(var i = 0; i < links.length; i++) {
      if(links[i].href.indexOf('#disqus_thread') >= 0) {
        query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
      }
    }
    document.write('<script type="text/javascript" src="http://disqus.com/forums/piyushahujanotes/get_num_replies.js' + query + '"></' + 'script>');
  })();
//]]>
</script>


 

