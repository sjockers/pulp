/**
 * pulp.util.scroll
 *
 * wraps & extends iscroll
 * 
 */

(function( pulp, $ ) {
	
	iScroll.prototype.center = function(){
		if (this.pagesX) {
			this._pos( this.pagesX[1], 0 );
			this.currPageX = 1;			
		}
	}
		
	// utilities namespace declaration
	pulp.util = pulp.util || {};

	// expose public functions:
	pulp.util.Scroll = iScroll;
			   
})( window.pulp = window.pulp || {}, jQuery );