(function () {
  'use strict';

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildToc() {
    var article = document.querySelector('.d-article');
    var tocList = document.querySelector('.d-toc-list');
    if (!article || !tocList) return;

    var headings = article.querySelectorAll('h2');
    if (!headings.length) return;

    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      var rawText = h.textContent.trim();
      if (!h.id) {
        h.id = slugify(rawText) || ('section-' + (i + 1));
      }

      var li = document.createElement('li');
      var a  = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = rawText;
      li.appendChild(a);
      tocList.appendChild(li);
    }
  }

  function initActiveHighlight() {
    var article = document.querySelector('.d-article');
    var tocList = document.querySelector('.d-toc-list');
    if (!article || !tocList) return;

    var headings = article.querySelectorAll('h2');
    if (!headings.length) return;

    var anchors = {};
    var links = tocList.querySelectorAll('a');
    for (var j = 0; j < links.length; j++) {
      var href = links[j].getAttribute('href');
      if (href && href.charAt(0) === '#') anchors[href.slice(1)] = links[j];
    }

    var activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      if (activeId && anchors[activeId]) anchors[activeId].classList.remove('active');
      activeId = id;
      if (id && anchors[id]) anchors[id].classList.add('active');
    }

    if (typeof IntersectionObserver === 'undefined') return;
    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) setActive(entries[k].target.id);
      }
    }, { rootMargin: '0px 0px -60% 0px', threshold: 0 });

    for (var m = 0; m < headings.length; m++) {
      if (headings[m].id) observer.observe(headings[m]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildToc();
    initActiveHighlight();
  });

})();
