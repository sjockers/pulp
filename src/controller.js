"use strict"

!function( pulp, $ ) {

	var controller = new pulp.util.Module;
	controller.extend(pulp.util.observable);

	controller.extend({
		init: function (tocUrl) {
			pulp.model.observe(pulp.events.TOC_LOADED, this.setup);
			pulp.model.getToc(tocUrl);
		},
		
		setup: function() {
			// TODO: Extract content from current page
			// var content = pulp.Article.extractContent($(document));
			
			var path = window.location.pathname;
			this.navigate(path);			
		},
		
		route: function(path) {
			
		},
		
		navigate: function (path) {
			// TODO: Check if path is valid
			pulp.carousel.display(path);
			this.route(path);
		}
			
	});
	
	// expose to namespace
	pulp.controller = pulp.controller || controller;

}( window.pulp = window.pulp || {}, jQuery );	