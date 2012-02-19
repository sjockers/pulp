"use strict"

!function( pulp, $ ) {

	var module = function(parent){  
	  var result = function(){
	    this.init.apply(this, arguments);
	  };

	  result.prototype.init  = function(){};

	  if (parent){
	    for(var i in parent){
	      result[i] = SuperClass.clone(parent[i]);
	    }
	    for(var i in parent.prototype){
	      result.prototype[i] = SuperClass.clone(parent.prototype[i]);
	    }
	    result._super = parent;
	    result.prototype._super = parent.prototype;
	  }

	  result.extend = function(obj){
	    var extended = obj.extended;
	    for(var i in obj){
	      result[i] = obj[i];
	    }
	    if (extended) extended(result)
	  };

	  result.include = function(obj){
	    var included = obj.included;
	    for(var i in obj){
	      result.prototype[i] = obj[i];
	    }
	    if (included) included(result)
	  };

	  result.proxy = function(func){
	    var thisObject = this;
	    return(function(){ 
	      return func.apply(thisObject, arguments); 
	    });
	  }
	
	  result.prototype.proxy = result.proxy;

	  result.prototype._class = result;

	  return result;
	};

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose to namespace
	pulp.util.Module = module;

}( window.pulp = window.pulp || {}, jQuery );