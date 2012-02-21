(function( pulp, $ ) {
	"use strict"

	function _observers(observable, event) {
		if (!observable.observers) {
			observable.observers = {};
		}
		
		if (!observable.observers[event]) {
			observable.observers[event] = [];
		}
		
		return observable.observers[event];
	}

	function observe(event, observer) {
		if (!this.observers) {
			this.observers = [];
		}
		
		if (typeof observer != "function") {
			throw new TypeError("not a function"); 
		}
		
		if (typeof event != "string") {
			throw new TypeError("not a valid event identifier"); 
		}
		
		_observers(this, event).push(observer);
	}; 
	
	function hasObserver(event, observer) {
		var observers  = _observers(this, event);
		return ($.inArray(observer, observers) >= 0);
	};
	
	function notify(event) {
		if (typeof event != "string") {
			throw new TypeError("not a valid event identifier"); 
		}
		
		var observers  = _observers(this, event);
		var args = Array.prototype.slice.call(arguments, 1);

		$.each(observers, function() {			
			try {
				this.apply(this, args);
			} catch (e) {};
		});
	};
		
	// utilities namespace declaration
	pulp.util = pulp.util || {};
	
	// expose public functions:
	pulp.util.observable = {
		observe: observe,         		
		hasObserver: hasObserver,
		notify: notify
	}
	   
})( window.pulp = window.pulp || {}, jQuery );