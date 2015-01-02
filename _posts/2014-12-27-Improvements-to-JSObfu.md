---
layout: post
title: "Improvements to jsobfu, Metasploit's Javascript Obfuscator"
---

(Note: this is a cross-post of an article I wrote for Metasploit's blog. The original post can be found [here](https://community.rapid7.com/community/metasploit/blog/2014/12/27/improvements-to-jsobfu)).

Several months ago, Wei [sinn3r](https://twitte<pre><code class="ruby">r.com/_sinn3r) Chen and I landed some improvements to Metasploit's Javascript obfuscator, jsobfu. Most notably, we moved it out to its own [repo](https://github.com/rapid7/jsobfu) and [gem](https://rubygems.org/gems/jsobfu), wrapped it in tests, beefed up its AV resilience, and added a command line interface so that it can be used from the CLI outside of metasploit-framework.
 
#### Obfuscation over the years

jsobfu was written by James [egypt](https://twitter.com/egyp7) Lee and was the first Javascript obfuscator in the framework that used a proper parser (tenderlove's [rkelly](https://github.com/tenderlove/rkelly) gem) and AST transformations to obfuscate. It was written to replace the [Rex::Exploitation::ObfuscateJS](https://dev.metasploit.com/api/Rex/Exploitation/ObfuscateJS.html) mixin, which was a simpler and less effective regex-based variable renamer (it is still in the Framework to support legacy modules, but jsobfu is the way to go nowadays). Also useful is the [Rex::Exploitation::EncryptJS](https://dev.metasploit.com/api/Rex/Exploitation/EncryptJS.html) mixin, which encodes the malicious Javascript with a random XOR key and wraps it in an eval wrapper. This can be handy when dealing with static/signatured AV engines.
 
#### Module Usage

If you are writing a browser exploit or Javascript post-exploitation module, we have added a convenient mixin for allowing dead-simple obfuscation that can be controlled by the end-user with a datastore option. Your code will look something like:

include Msf::Exploit::JSObfu

def generate_html
  js_obfuscate("trigger_exploit();");
end</code></pre>

Note that the `Msf::Exploit::JSObfu` mixin is automatically pulled in when you use the [BrowserExploitServer](https://github.com/rapid7/metasploit-framework/wiki/How-to-write-a-browser-exploit-using-BrowserExploitServer).

When the `js_obfuscate` method is used, the user has control over the level of obfuscation iterations through an advanced datastore option called `JsObfuscate`:

    Name           : JsObfuscate
    Current Setting: 0
    Description    : Number of times to obfuscate JavaScript

#### The Gem

The new [jsobfu Ruby gem](https://rubygems.org/gems/jsobfu) can be installed in a snap:

    $ gem install jsobfu

This installs the `jsobfu` library and adds a global `jsobfu` shell command that will read Javascript code from stdin and obfuscate it:

    $ echo "console.log('Hello World')" | jsobfu

    window[(function () { var E="ole",d="ons",f="c"; return f+d+E })()][(String.fromChar
    Code(108,111,0147))](String.fromCharCode(0x48,0x65,0154,0154,111,32,0127,0x6f,114,01
    54,0x64));

There is also an optional iterations parameter that allows you to obfuscate a specified number of times:

    $ echo "console.log('Hello World')" | jsobfu 3

    window[(function(){var T=String[(String.fromCharCode(102,114,0x6f,109,0x43,104,97,0x
    72,0x43,0157,0x64,0145))](('j'.length*0x39+54),('h'.length*(3*('X'.length*024+8)+9)+
    15),(1*('Q'.length*(1*0x40+14)+19)+4)),Z=(function(){var c=String.fromCharCode(0x6e,
    0163),I=String.fromCharCode(99,0x6f);return I+c;})();return Z+T;})()][(String[(Strin
    g[((function () { var r="de",t="mCharCo",M="f",_="ro"; return M+_+t+r })())]((0x6*0x
    f+12),(01*('J'.length*('z'.length*(4*0x9+4)+27)+1)+46),(0x37*'Bw'.length+1),('K'.len
    gth*(0x3*0x1a+17)+14),(02*(1*(1*(05*'RIZ'.length+2)+6)+3)+15),('X'.length*('zzJA'.le
    ngth*021+15)+21),(0x1*0111+24),('FK'.length*0x2b+28),('z'.length*0x43+0),(03*33+12),
    ('AZa'.length*('NKY'.length*(02*4+3)+0)+1),(1*0x5c+9)))](('u'.length*(01*('KR'.lengt
    h*('av'.length*0x7+3)+5)+19)+(01*('j'.length*056+0)+4)),('z'.length*(String.fromChar
    Code(0x67,85,0155,0156,75,84,0114,0x4c)[((function () { var f="ngth",F="e",x="l"; re
    turn x+F+f })())]*((function () { var n='m',a='Q'; return a+n })()[(String.fromCharC
    ode(0154,101,110,0x67,0x74,104))]*(function () { var w='d',A='tMf'; return A+w })()[
    ((function () { var yG="ngth",q5="e",J="l"; return J+q5+yG })())]+'SX'.length)+'crFi
    Kaq'.length)+(1*026+2)),('p'.length*(06*15+10)+'nnU'.length)))]((function(){var En=S
    tring[(String.fromCharCode(0146,0x72,0x6f,0x6d,0103,104,97,0x72,67,0x6f,0144,101))](
    (3*041+9),('eHUOhZL'.length*(0x1*(01*9+1)+3)+9)),Y=(function(){var z=(function () {
    var Sf='r'; return Sf })(),Z=(function () { var N='o'; return N })(),C=String.fromCh
    arCode(0x57);return C+Z+z;})(),k=String[((function () { var b="e",s="od",p="fromCha"
    ,H="rC"; return p+H+s+b })())](('C'.length*('H'.length*('Ia'.length*0xf+3)+12)+27),(
    'G'.length*(01*('Wv'.length*25+10)+27)+14),('Q'.length*077+45),('MXq'.length*30+18),
    (1*('B'.length*(0x1*29+20)+24)+38),(0x2*020+0));return k+Y+En;})());

#### The Implementation

The original approach of jsobfu is simple: obfuscate String, object, and number literals by transforming them into random chunks of executable statements. For example, the statement:

<pre><code class="javascript">"ABC";</code></pre>

Might be transformed a number of different ways (variables are renamed during transformation):

<pre><code class="javascript">String.fromCharCode(0101,0x42,0x43);</code></pre>

Or:

<pre><code class="javascript">(function () { var t="C",_="B",h="A"; return h+_+t })();</code></pre>

Or even:

<pre><code class="javascript">(function(){var k=String.fromCharCode(0103),d=String.fromCharCode(0x42),
  v=(function () { var I="A"; return I })();return v+d+k;})();</code></pre>

In order to make this useful in evading AV, we wanted to be sure that every signaturable string in the original code was (possibly) randomized. Because Javascript allows property lookups from a string, it is possible to rewrite all property lookups into small, randomly chosen chunks of code. This makes de-obfuscation rather tedious for a human, since a lot of code is executing and there is no straightforward place to put a hook (as opposed to an eval-based approach).

So if you obfuscate code that performs a lookup:

<pre><code class="javascript">// input:
var obj = {};
var x = obj.y;</code></pre>

The lookup will be obfuscated with a randomly chosen String literal transformation:

<pre><code class="javascript">// obfuscated output:
var K = {};
var X = K[(String.fromCharCode(0x79))];</code></pre>

Global lookups must also be dealt with:

<pre><code class="javascript">// input:
var x = GlobalObject.y;</code></pre>

Global lookups are resolved against the window global, so they too can be obfuscated:

<pre><code class="javascript">// obfuscated output:
var G = window[String.fromCharCode(0x47,0x6c,0x6f,0142,97,0x6c,79,98,0x6a,
101,99,0x74)][((function () { var i="y"; return i })())];</code></pre>