---
layout: post
title: "Hacking Safari’s Reader"
---
I often use Safari's Reader function when I come across articles that have tiny print, are contrained along a very narrow column, or are broken up by enormous ads. For those of you unfamiliar with Safari's Reader, it basically performs the same function as the <a href="http://readable.tastefulwords.com/">Readable</a> bookmarklet: it extracts the body of an article and presents it in an easy-to-read format. Here's an example:

<img src="/images/SafariReader.png" />

The problem is, of course, what determines how the article is extracted? And, in that case, how the title is extracted? I ran into this problem when designing my blog, resulting in the title of every article appearing as “\[between extremes\]” -- my blog title, not the article title -- in the Reader. 

<img src="/images/SafariScrewup.png" />

Weird. I searched a bit for “Safari Reader documentation” and found nothing, so I futzed around with the HTML and eventually got it to work by adding the “title” class to the <code>&lt;h3&gt;</code> tag holding the title. Problem solved, pack it up and move on.

Hang on a second, though. I started to wonder what algorithm Safari uses for extracting articles. Then I realized the easiest way to write something like Safari Reader would be in plain JS, with the HTML already parsed into a DOM and whatnot. So I decided to see if Safari injects the code for Reader into the page, for the sole sake of science. A minute later I found the code and came to the conclusion that Safari Reader is just a <i>glorified Safari extension</i>, consisting of an injected script, style, and toolbar button.

For legal reasons I don't think I can just post the code, but here's how to access it:
<ol>
<li>Open <a href="http://news.ycombinator.com">Hacker News</a> in Safari (no sense in wasting a tab)</li>
<li>Open Web Inspector (cmd-option-I)</li>
<li>Open the Scripts tab, click Enable Debugging</li>
<li>Pause the Javascript interpreter (above "Watch Expressions")</li>
<li>Refresh the page</li>
<li>Step through the code line-by-line. Eventually you'll get to the Safari Reader code</li>
</ol>

The JS code that you now see in the Web Inspector is the article extraction algorithm for Safari Reader. Incredibly, the code is not packed or minified, so by throwing it through <a href="http://jsbeautifier.org">jsbeautifier</a>, you can end up with some nice, readable code. A couple of interesting things I noticed by glancing through the code:

<ul>
<li>The script uses a <a href="http://en.wikipedia.org/wiki/Levenshtein_distance">Levenshtein distance</a> calculation sometimes to check if a certain string of text agrees enough with the article to be the title.</li>
<li>~1200 lines of Javascript, hundreds of arrays, and not a single splice() call</li>
<li>The algorithm works by slowly trimming irrelevant DOM nodes, ending up with just the article content</li>
<li>For a certain body of text to be the primary article candidate, it must have at least 10 commas</li>
<li>The "#disqus_thread" identifier is one of the few, hardcoded, values the parser automatically skips</li>
<li>The algorithm also parses next page URL by looking for the link with the best "score"</li>
<li>You can copy and paste this script into the console of any browser. To run it, you would type:</li>
</ul>
<pre><code class="javascript">var ReaderArticleFinderJS = new ReaderArticleFinder(document);
var article = ReaderArticleFinderJS.findArticle();</code></pre>

This code might be valuable to anyone looking to scrape text content from HTML. If anyone has better pointers into the script’s inner workings, feel free to comment!