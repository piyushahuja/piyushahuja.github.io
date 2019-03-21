piyushahuja.com
===============

This is Piyush's personal website. It uses the static site generator Jekyll to render markdown files into html. The inspiration for the design was Mark Reid's website,  and the basic layout was coded in HTML/CSS.

<!-- HOWTO: 

http://nicolashery.com/fast-mobile-friendly-website-with-jekyll/
 -->

<!-- 
I find it important that the code blocks look good on a small mobile screen as well as the desktop. To achieve this, I first use the following CSS rule:

pre {
  white-space: pre-wrap;
}
This will wrap the code when a line is longer than the screen size, instead of displaying a horizontal scroll bar (I find horizontal scrolling awkward, but that might be just me). Wrapped code isn't great though, and a little difficult to read. To limit this on small screens, diminish the font-size to make as much code as possible fit on one line, using media queries:

pre, pre > code {
  /* Make more code fit on small screens */
  font-size: 14px;
}

@media only screen and (min-width: 481px) {
  pre, pre > code {
    /* Bigger font on bigger screens */
    font-size: 16px;
  }
}
Finally, for the colors of the syntax highlighting, I like the Solarized theme. I put together two CSS stylesheets to use with Pygments and Jekyll, the "Light" and "Dark" versions.

Here I realized the importance of testing a website on an actual mobile device (versus just in a resized desktop browser). Indeed, the Solarized Dark theme was fine on the bright screen of my MacBook Air, but too dark and diffictult to read on my iPhone screen. That's one of the reasons I opted for Solarized Light.


With a blog on programming, I'm going to be using a lot of code examples. It's important that they look good, both on desktop and mobile.

For syntax highlighting, Jekyll has a nice integration with Pygments. To install, run:

$ pip install pygments
And add to your _config.yml file:

pygments: true
I like using fenced code blocks, as found in GitHub-Flavored Markdown, instead of Liquid highlight tags. To do so, I switched my Jekyll Markdown parser to redcarpet:

$ gem install redcarpet
And add to the _config.yml file:

markdown: redcarpet
And now you can include code blocks with:

```javascript
var msg = 'Hello world!';
```

 -->