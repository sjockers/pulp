"use strict"

!function( pulp, $ ) {

	var carousel = new pulp.util.Module;
	
	app.init = function(){
		var url = $("link[rel='toc']").attr("href");
		pulp.model.getToc(url);
	};
	
	// expose to namespace
	pulp.app = pulp.app || app;

}( window.pulp = window.pulp || {}, jQuery );