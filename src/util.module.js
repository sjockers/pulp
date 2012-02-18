"use strict"

!function( pulp, $ ) {

	var module = function(extensions) {
		if (extensions) this.extend(extensions);
	}
	
	module.prototype.extend = function(obj) {
		$.extend(this, obj);
	}
	
	module.prototype.proxy = function(func) {
		return $.proxy(this, func);
	}

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose to namespace
	pulp.util.Module = module;

}( window.pulp = window.pulp || {}, jQuery );