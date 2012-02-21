"use strict"

!function( pulp, $ ) {

	var carousel = new pulp.util.Module;
	
	var articles = pulp.model.articles;
	
	carousel.extend({

		views: {
			previous: null,
			current: null,
			next: null
		},
		
		display: function(path) {	
			articles.find("url", path);

			articles.current().observe( pulp.events.CONTENT_LOADED, function(){
				carousel.views.previous = new pulp.View(articles.previous());
				carousel.views.next = new pulp.View(articles.next());
			})

			this.views.current =  new pulp.View(articles.current());
		},		
	});
	
	// expose to namespace
	pulp.carousel = pulp.carousel || carousel;

}( window.pulp = window.pulp || {}, jQuery );