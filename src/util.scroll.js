/**
 * pulp.util.scroll
 *
 * wraps & extends iscroll
 * 
 */

(function( pulp, $ ) {
	
	iScroll.prototype.center = function(){
		if (this.pagesX) {
			var self = this;
			// setTimeout(function(){
				self._pos( self.pagesX[1], 0 );
			// }, 500);			
		}
	}
		
	// utilities namespace declaration
	pulp.util = pulp.util || {};

	// expose public functions:
	pulp.util.Scroll = iScroll;
			   
})( window.pulp = window.pulp || {}, jQuery );