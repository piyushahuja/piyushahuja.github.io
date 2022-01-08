---

layout: page-home
title: Writing Workshop
comments: false
lesson: intro
---


<CENTER><h1 class="emphnext">{{ page.title }}</h1></CENTER>




{% for post in site.courses %}
{% if post.course == "writing" %}
<div class="section list">
  <h1>Lesson {{post.lesson}}</h1>
  <p class="line">
  <a class="title" href="{{ post.url }}">{{ post.title }}</a>
  </p>
  <!--<p class="excerpt">{{ post.excerpt }}</p>-->
</div>
{% endif %}
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

**Assignments**

Every assignment would be delivered in five versions: A three page version, a one page version, a three paragraph version, a one paragraph version, and a one sentence version. 

Along the way you’d trade detail for brevity. Hopefully adding clarity at each point.  Each step requires asking “What’s really important?” That’s the most important question you can ask yourself about anything. The class would really be about answering that very question at each step of the way. Whittling it all down until all that’s left is the point.

**Feedback Forum**

Each meeting includes Feedback Forum (30 min feedback sessions). A participant shares a segment of <2000 words; other participants comments for 20 min in Google docs & 10 min verbally [Idea Source](https://twitter.com/DarbyVickers/status/1387089114852249604)



