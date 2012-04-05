/**
 * pulp.util.touchable
 *
 * basic touch handler implementation
 * 
 */


(function( pulp, $ ) {
	"use strict"

	// private members
	var startX = null;
	var startY = null;
	var isMoving = false;
	var minMove = 50;
	var touchTarget;

	function cancelTouch() {
		touchTarget.removeEventListener('touchmove', touchMove);
		startX = null;
		isMoving = false;
	}	
 	 
	function touchMove(e) {
		if(touchable.preventDefault) {
			e.preventDefault();
		}
		if(isMoving) {
			var x = e.touches[0].pageX;
			var y = e.touches[0].pageY;
			var dx = startX - x;
			var dy = startY - y;
			
			if(Math.abs(dx) >= minMove) {
				cancelTouch();
				if(dx > 0) {
					touchable.callbacks.swipeLeft();
				}
				else {
					touchable.callbacks.swipeRight();
				}
			}
		}
	}
 	 
	function touchStart(e) {
		if (e.touches.length == 1) {
			startX = e.touches[0].pageX;
			startY = e.touches[0].pageY;
			isMoving = true;			
			touchTarget.addEventListener('touchmove', touchMove, false);
		}
 	}

	
	// public members
	var touchable = {
		
		preventDefault: false,
		isTracking: false,
						
		callbacks: {
			swipeLeft: function(){},
			swipeRight: function(){}
		},
		
		touchSupported: function() {
		  return !!('ontouchstart' in window) ? 1 : 0;
		},
				
		// create the element
		touch: function(event, callback){
			if (this.touchSupported) {
				if (!this.touchTarget) {
					touchTarget = this.target;
				}
				this.callbacks[event] = callback;
				touchTarget.addEventListener('touchstart', touchStart, false);
			}
		}

	};
	
	
	// namespace declaration
	pulp.util = pulp.util || {};

	pulp.util.touchable = touchable;	
		   
})( window.pulp = window.pulp || {}, jQuery );
