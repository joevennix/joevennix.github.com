---
layout: post
title: "JScrollie, and Why Javascript Scrollbars Suck"
---
Scrollbars are an essential part of just about every website. Any div that overflows (and is not set to <code>overflow:hidden</code>) requires one, along with the <code>&lt;body&gt;</code> tag. And yet, with the exception of IE<a name="id1" href="#ftn.id1">*</a>, they are hardly customizable in most browsers. To get around this, <a href="http://jscrollpane.kelvinluck.com/">various</a> <a href="http://www.hesido.com/web.php?page=customscrollbar">projects</a> have been written that recreate scrollbars in Javascript to make them highly configurable. 

The problem with most Javascript (and Flash, for that matter) scrollbar solutions today is that they essentially reinvent the wheel by reimplementing all of the native scrolling logic in Javascript, which has a very disconcerting effect on the user. I am used to one scroll setting. When I spin my scrollwheel and the scrollable area flies by too fast, or takes an hour to move down an inch, or, <i>shudder</i>, continues scrolling long after I’ve stopped thanks to some fancy inertia effect, I get a little pissed off. I immediately reach for the scrollbar, as dragging the scrollbar around is generally easier than recalibrating my brain to a new scroll setting. If dragging the scrollbar still produces an inertia effect, well, you better watch your back.

<div class="note footnote">Note: I’m not trying to say faster, slower, or inertia settings for scrolling are inherently bad, they just aren’t what I’m used to. I’m thrown out of my comfort zone. And I have at least one reason to not return to your site. What I <strong>am</strong> trying to say here is that users are used to the <strong>native</strong> scroll settings, i.e. whatever they have set in System Preferences / Control Panel. It makes no sense to force them to use anything different. </div>

Anyways, while working on a project of mine last weekend, I ran into the need for a small, transparent scrollbar to maximize screen space. After looking around at the currently available options, I eventually ran into <a href="http://groups.google.com/group/jscrollpane/browse_thread/thread/73b1089d4140ec85/83ca251160831376">this</a> Google Groups thread, which talks about <a href="http://plugins.jquery.com/project/scrollbarpaper">Scrollbar Paper</a>, a jQuery scrollbar solution written by Henri Medot that works by essentially creating a div that "covers" your actual scrollbar using absolute positioning and a high z-index. Dragging this div around would fire jQuery callbacks that moved the scrollbar, and scrolling up and down the page would fire callbacks that moved the div. Additionally, a 200ms timer callback was setup that repeatedly checked the content size and adjusted the size of the div to match, or hide the div altogether if possible. That way, the actual scrolling logic remained native, while the old scrollbar was hidden out of sight and replaced with a div that you can customize through CSS.

I thought this was an interesting idea, so I grabbed the source code and started messing around. I came up with a slightly different solution, here is a picture that compares both methods:

<img src="/images/jscrollie.png" />

Basically, my solution works by creating a wrapper div that has <code>overflow:hidden</code>. Inside of this div is the actual scrollpane, whose width is set to <code>width of the wrapper div + 20px</code>. This pushes the y-scrollbar out of sight. I then use Henri’s code for creating a fake scrollbar and binding it to follow scroll events. This yields a couple advantages over the original implementation:

1. You can create a truly transparent scrollbar. This is important when you’re scrolling over the table and you want the separator lines to continue all the way to the end.
2. The original solution would sometimes "flicker", and I would catch a glimpse of the native scrollbar underneath the "scrollbar paper." With the new solution, the scrollbar is completely hidden, not just covered with a div with a higher z-index.

I turned my solution into a separate project called jScrollie, which you can get on github <a href="http://github.com/joevennix/jScrollie">here</a>. Right now its sole purpose is to wrap an entire page with a custom scrollbar, however with a little hacking you can get this method working for embedded content (I had to do this for my project). jScrollie also degrades nicely, since all the "wrapper" divs are created when <code>(scrollpane).jScrollie()</code> is called. Forgoing this call leaves you with a stock scrollpane.

For a demo, look at your scrollbar :)

<div class="note footnote" id="ftn.id1">* Although, I can’t give them too much credit: they only allow tint changes to certain parts.</div>