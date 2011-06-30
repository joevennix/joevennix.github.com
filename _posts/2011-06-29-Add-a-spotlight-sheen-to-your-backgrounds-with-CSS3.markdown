---
layout: post
title: "Add a spotlight “sheen” to your backgrounds with CSS3"
---
<p>Recently when building an admin panel for a client, I decided to add a spotlight sheen effect to the background for a sleeker look. Here's a snap of the completed design:</p>
<a href="/images/spotlightsheen.png"><img src="/images/spotlightsheen2.png" /></a>
<p>Here's the CSS(3) that I used to do it. The "sheen" is really just a radial gradient that tapers from a transparent white to full transparency:</p>
<pre><code>background:-webkit-gradient(radial, 250 50,0,250 50,800,
            from(rgba(255,255,255,.4)),to(transparent)) transparent;
background: -moz-radial-gradient(250px 50px, 
            rgba(255,255,255,.4), transparent) transparent;
</code></pre>
<p>The effect is applied to a #wrap div, which lies directly on top of the body.</p>