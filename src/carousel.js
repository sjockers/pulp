(function( pulp, $ ) {
	"use strict"

	var carousel = new pulp.util.Module;	
	carousel.extend( pulp.util.renderable );
	carousel.extend( pulp.util.observable );
	
	var articles = pulp.model.articles;	
	var $containers = [];

	function initializeScaffold(){

		carousel.create("carousel_tmpl");
		carousel.target = "body";
		carousel.hideContent();		
		carousel.render();
		
		$containers[0] = carousel.$element.find("#container-0");
		$containers[1] = carousel.$element.find("#container-1");
		$containers[2] = carousel.$element.find("#container-2");
		
	}
	
	carousel.extend({

		views: {
			previous: null,
			current: null,
			next: null
		},
		
		display: function(path) {	

			articles.find("url", path);
			var views = this.views;
			if(!this.element) initializeScaffold();

			articles.current().observe( pulp.events.CONTENT_LOADED, function(){
				if(articles.hasPrevious()){
					views.previous = new pulp.View(articles.previous(), $containers[0]);					
				}				
				if(articles.hasNext()){
					views.next = new pulp.View(articles.next(), $containers[2]);
				}
			})

			views.current =  new pulp.View(articles.current(), $containers[1]);
		}
	});
	
	// expose to namespace
	pulp.carousel = pulp.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );