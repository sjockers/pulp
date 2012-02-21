"use strict"

!function( pulp, $ ) {

	var app = new pulp.util.Module;
	
	app.init = function(){
		var url = $("link[rel='toc']").attr("href");						
		pulp.controller.init(url);
	};
	
	// expose to namespace
	pulp.app = pulp.app || app;

}( window.pulp = window.pulp || {}, jQuery );