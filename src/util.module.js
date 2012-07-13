/**
 * pulp.util.Module
 *
 * class-like implementation of the module pattern
 * 
 */


(function( pulp, $ ) {
	"use strict"

	var closure = function(parent){  
	  var Module = function(){
	    this.init.apply(this, arguments);
	  };

	  Module.extend = function(obj){
	    var extended = obj.extended;
	    for(var i in obj){
	      Module[i] = obj[i];
	    }
	    if (extended) extended(Module)
	  };

	  Module.include = function(obj){
	    var included = obj.included;
	    for(var i in obj){
	      Module.prototype[i] = obj[i];
	    }
	    if (included) included(Module)
	  };

	  Module.proxy = function(func){
	    var thisObject = this;
	    return(function(){ 
	      return func.apply(thisObject, arguments); 
	    });
	  };
		
		Module.clone = function(obj){
		  if (typeof obj == "function") return obj;
		  if (typeof obj != "object") return obj;
		  if (jQuery.isArray(obj)) return jQuery.extend([], obj);
		  return jQuery.extend({}, obj);
		};
		
	  Module.prototype.init = function(){};

	  if (parent){
	    for(var i in parent){
	      Module[i] = Module.clone(parent[i]);
	    }
	    for(var i in parent.prototype){
	      Module.prototype[i] = Module.clone(parent.prototype[i]);
	    }
	    Module._super = parent;
	    Module.prototype._super = parent.prototype;
	  }
	
	  Module.prototype.proxy = Module.proxy;

	  Module.prototype._class = Module;

	  return Module;
	};


	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose to namespace
	pulp.util.Module = closure;

})( window.pulp = window.pulp || {}, jQuery );