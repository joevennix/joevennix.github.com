(function($) {
  $.fn.atomSearch = function(opts) {
      var $this = $(this);
  	});
  	return this;
  }

  $.fn.atomSearch.defaults = {
  	lazyLoad: true,	// if you want the script to pre-download your atom.xml file
  					//immediately, set lazyLoad to false
  	outputContainer: 'body', // this is the selector that search results are dumped into
  	atomFile: '/atom.xml',   // specifies the location of the atom xml feed
    
  }
})