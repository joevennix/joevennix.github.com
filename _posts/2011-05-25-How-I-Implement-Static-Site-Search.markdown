---
layout: post
title: "How I implement static-site search"
---
A few weeks ago I read about <a href="http://tapirgo.com/">Tapir</a>, a Javascript static-site search API: add a few lines of Javascript to your static blog or site (RSS feed required), and thanks to AJAX magic you can have your own built-in search functionality! No more clunky embedded Google search (the previous “best solution”). Really a very good idea, and nicely implemented as well.

However, my blog isn’t that big, since I am constantly changing servers and losing years worth of blog posts. My RSS feed weighs in at a whopping 4kb. All my posts fit on a single page. Because of my relatively small RSS footprint, Tapir seemed to be overkill.

So I wrote my own solution. Check it out by typing something into the search bar at the top right. RSS feeds are just XML, which is very easy to parse with Javascript. Even easier (kinda) with jQuery's $.ajax() calls. Here's what my code looks like:

<pre><code class="javascript">function findEntries(q) {
  var matches = [];
  var rq = new RegExp(q, 'im');
  for (var i = 0; i &lt; entries.length; i++) {
    var entry = entries[i];
    var title = $(entry.getElementsByTagName('title')[0]).text();
    var link = $(entry.getElementsByTagName('link')[0]).attr('href');
    var content = $(entry.getElementsByTagName('content')[0]).text();          
    if (rq.test(title) || rq.test(link) || rq.test(content)) {
      var updated = prettyDate(xmlDateToJavascriptDate($(entry.getElementsByTagName('updated')[0]).text()));
      matches.push({'title':title, 'link':link, 'date':updated});
    }
  }
  var html = '&lt;h3 style="text-align:center; margin-bottom:40px;"&gt;&lt;a href="#" onclick="window.location.hash=\'\'; return false;"&gt;&lt;img style="height:8px; margin:3px 3px;" src="/images/closelabel.png" /&gt;&lt;/a&gt; Search Results for "'+htmlEscape(q)+'"&lt;/h3&gt;&lt;div id="results"&gt;';
  for (var i = 0; i &lt; matches.length; i++) {
    var match = matches[i];
    html += '&lt;div class="results_row"&gt;&lt;div class="results_row_left"&gt;&lt;a href="'+match.link+'"*gt;'+htmlEscape(match.title);
    html += '&lt;/a&gt;&lt;/div&gt;&lt;div class="results_row_right">'+match.date+'&lt;/div&gt;&lt;div style="clear:both;"&gt;&lt;/div&gt;&lt;/div&gt;';
  }
  html += '&lt;/div&gt;';
  $('#content').html(html);
}

$('#search_form').submit(function(e) {
  var query = $('#query').val();            
  window.location.hash = 'search='+escape(query.replace(/\s/g, '+'));
  e.preventDefault();
});

$(window).bind('hashchange', function(e) {
  var query = $.param.fragment().replace('+', ' ').replace('search=', '');
  $('#query').val(query);
  console.log('Changing state: '+query);
  if (query == '') {
    if (oldhtml == null) {
      oldhtml = $('#content').html(); 
    }
    $('#content').html(oldhtml);
    $('#footer').show();
    $('#query').blur();
  } else {
    $('#content').html('&lt;div id="loader"&gt;&lt;/div&gt;');
    $('#footer').hide();
    $('#query').blur().attr('disabled', true);
    if (entries == null) {
      $.ajax({url:'/atom.xml?r='+(Math.random()*99999999999), dataType:'xml', success: function(data) {
        entries = data.getElementsByTagName('entry');
        findEntries(query);
      } });
    } else {
      findEntries(query);
    }
    $('#query').blur().attr('disabled', false);
  }
});
$(window).trigger( 'hashchange' );</code></pre>

I use Ben Alman's <a href="http://benalman.com/projects/jquery-bbq-plugin/">jQuery BBQ plugin</a> to manage the page state. As you can see, the actual searching is done with regular expressions for the moment. This won't scale as well as something like a <a href="http://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string_search_algorithm">Boyer-moore search</a>, but I think it's neat to be able to grep through my posts. Because the RSS feed is cached, every search after the initial one is almost instantaneous.

Although this is not an optimal solution for sites with a huge amount of posts, it does work very well to small- to medium-sized sites. The main barrier in my solution is that the script has to process the entire text of every post, which can be very slow. I figure this could be improved by having a pre-generated dictionary (preferably something like a <a href="http://en.wikipedia.org/wiki/Trie">trie</a> structure for easier partial-matching) that holds all the words in a post, and points to an array of post IDs. Can anyone think of how this could be further optimized? 