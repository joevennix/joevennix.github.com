/**
 * Code based (heavily) off of: http://code.google.com/p/scrollbarpaper/
 * @version last revision April 12 2011
 */

$.fn.extend({
  jScrollie: function() {
    this.each(function(i) {
      var $this = $(this);
      var jScroll = $this.data('jScrollie');
      if (jScroll == null) {
        //initialize the positioning divs
        var barWidth = 14;
        $this.wrap('<div class="jScrollieMetaContainer">');
        $this.before('<div class="jScrollieContainer" style="width:' + barWidth + 'px"><div class="jScrollieTrack"><div class="jScrollieDrag"><div class="jScrollieDragTop"></div><div class="jScrollieDragBottom"></div></div></div></div>');
        $this.append('<div class="jScrollieClear" style="clear:both;"></div>'); //needed to figure out content height
        $this.wrap('<div class="jScrollie">');      
        var scrollie = $this.parent();
        jScroll = scrollie.prev();
        var content = $('> :first', $this);
        //save our settings
        content.css('overflow', 'hidden');
        $this.data('jScrollie',      jScroll);
        $this.data('track',      $('.jScrollieTrack', jScroll));
        $this.data('drag',       $('.jScrollieDrag', jScroll));
        $this.data('dragTop',    $('.jScrollieDragTop', jScroll));
        $this.data('dragBottom', $('.jScrollieDragBottom', jScroll));
        $this.data('content',    content);
        $this.data('clearer',    $('> :last', $this));
        $this.data('scroller',   scrollie);
        jScroll.hide();

        var rs=function(e) {
            //a resize function that should be called when content or window size changes.
            var offset = scroller.offset();
            var dataOffset = $this.data('offset');
            if (($this.height() != $this.data('height'))
             || (clearer.position().top - content.position().top != $this.data('contentHeight'))
             || (offset.top != dataOffset.top)
             || (offset.left != dataOffset.left)) {
              $this.jScrollie();
            }
          }
        window.setInterval(function() { rs(); }, 500);
        jScroll.scroll(rs);
        //other dynamic size cases here? original code had a setInterval loop that resized
      }

      var barWidth =   $this.data('barWidth');
      var track =      $this.data('track');
      var drag =       $this.data('drag');
      var dragTop =    $this.data('dragTop');
      var dragBottom = $this.data('dragBottom');
      var content =    $this.data('content');
      var clearer =    $this.data('clearer');
      var scroller = $this.data('scroller');
      var contentHeight = clearer.position().top - content.position().top;
      $this.data('height', scroller.height());
      $this.data('contentHeight', contentHeight);
      $this.data('offset', scroller.offset());

      $this.unbind();

      var ratio = scroller.height() / contentHeight;
      if (ratio < 1) { //content is big enough to show the scrollbar
        jScroll.show();
        content.addClass('jScrollieVisible');
        jScroll.height(scroller.height()-10);
        var offset = scroller.offset();
        jScroll.css('right', '2px').css('top', '10px');
        var dragHeight = Math.max(Math.round(scroller.height() * ratio), dragTop.height() + dragBottom.height());
        drag.height(dragHeight-20);
        var updateDragTop = function() { //called on scroll, and right now
          drag.css('top', Math.min(Math.round(scroller.scrollTop() * ratio), scroller.height() - dragHeight) + 'px');
        };
        updateDragTop();

        scroller.scroll(function(event) {
          updateDragTop();
        });

        var unbindMousemove = function() {
          $('html').unbind('mousemove.jScrollie');
        };
        drag.mousedown(function(event) {
          unbindMousemove();
          var offsetTop = event.pageY - drag.offset().top;
          $('html').bind('mousemove.jScrollie', function(event) {
            scroller.scrollTop((event.pageY - scroller.offset().top - offsetTop) / ratio);
            return false;
          }).mouseup(unbindMousemove);
          return false;
        });
      }
      else {
        //content is small enough to hide the scroll bar
        $this.unbind();
        jScroll.hide();
        content.removeClass('jScrollieVisible');
        content.width($this.width() - content.innerWidth() + content.width());
      }
      });
  }
});

(function(a){a.fn.noisy=function(b){return this.each(function(){var c=document.createElement("canvas"),h=c.getContext("2d");if(!h&&b.fallback!==undefined&&b.fallback!=="")a(this).css("background-image","url("+b.fallback+"),"+a(this).css("background-image"));else{b=a.extend({},a.fn.noisy.defaults,b);c.width=c.height=b.size;for(var d=h.createImageData(c.width,c.height),e=function(i,k){return Math.floor(Math.random()*(k-i)+i)},j=0;j<b.intensity*Math.pow(b.size,2);j++){var f=e(0,c.width),g=e(0,c.height);
      f=(f+g*d.width)*4;g=e(0,255);d.data[f]=g;d.data[f+1]=b.monochrome?g:e(0,255);d.data[f+2]=b.monochrome?g:e(0,255);d.data[f+3]=e(0,255*b.opacity)}h.putImageData(d,0,0);a(this).data("original-css")==undefined&&a(this).data("original-css",a(this).css("background-image"));a(this).css("background-image","url("+c.toDataURL("image/png")+"),"+a(this).data("original-css"))}})};a.fn.noisy.defaults={intensity:0.9,size:200,opacity:0.08,fallback:"",monochrome:false}})(jQuery);

(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgba("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0),Math.max(Math.min((g.pos*(g.end[3]-g.start[3])+g.start[3]),1),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){f.push(1);return f}if(f&&f.constructor==Array&&f.length==4){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3]),1]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55,1]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16),1]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16),1]}if(e=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,(.*?)\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55,parseFloat(e[4])]}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.curCSS(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255,1],azure:[240,255,255,1],beige:[245,245,220,1],black:[0,0,0,1],blue:[0,0,255,1],brown:[165,42,42,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgrey:[169,169,169,1],darkgreen:[0,100,0,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkviolet:[148,0,211,1],fuchsia:[255,0,255,1],gold:[255,215,0,1],green:[0,128,0,1],indigo:[75,0,130,1],khaki:[240,230,140,1],lightblue:[173,216,230,1],lightcyan:[224,255,255,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],magenta:[255,0,255,1],maroon:[128,0,0,1],navy:[0,0,128,1],olive:[128,128,0,1],orange:[255,165,0,1],pink:[255,192,203,1],purple:[128,0,128,1],violet:[128,0,128,1],red:[255,0,0,1],silver:[192,192,192,1],white:[255,255,255,1],yellow:[255,255,0,1],transparent:[255,255,255,0]}})(jQuery);