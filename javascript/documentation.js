// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++
!function ($) {
	$(function(){
		//init the table plugin, requires absolute urls (absolute:true) to comply with github crosdomain security.
		$(document).table({absolute:true});
		
		// Disable certain links in docs
		$('section [href^=#]').click(function (e) {
			e.preventDefault()
		})
		
		// make code pretty
		window.prettyPrint && prettyPrint();
	})
	}(window.jQuery)