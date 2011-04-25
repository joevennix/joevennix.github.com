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
        window.setInterval(function() { rs(); }, 400);
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