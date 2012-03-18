(function( pulp, $ ) {
	"use strict"

	var carousel = new pulp.util.Module;	
	carousel.extend( pulp.util.renderable );
	carousel.extend( pulp.util.observable );
	
	var articles = pulp.model.articles;	
	var $containers = [];
	var $slider;

	var slideLeft = "slide-left";
	var slideRight = "slide-right";
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = "body";
		carousel.hideContent();		
		carousel.render();
		
		$containers[0] = carousel.$element.find("#container-0");
		$containers[1] = carousel.$element.find("#container-1");
		$containers[2] = carousel.$element.find("#container-2");
		
		// TODO: Is there a better solution for that?
		$.each($containers, function() {		
			this.height($(document).height());	
		});
		
		// TODO: Move to separate function!
		$slider = carousel.$element.find("#slider");		
		$slider.bind("webkitTransitionEnd", updateViews)
	}

	function updateViews(event){

		if($slider.hasClass(slideRight)) {
			$slider.removeClass(slideRight);			
			stepForward(carousel.views);
		}

		if($slider.hasClass(slideLeft)) {
			$slider.removeClass(slideLeft);
			stepBackward(carousel.views);
		}

	}	
	
	function stepForward(vws) {
		articles.forward();
		vws.previous = vws.current;
		vws.current = vws.next;
		vws.previous.render($containers[0]);
		vws.current.render($containers[1]);
		vws.next = new pulp.View(articles.next(), $containers[2]);		
	}
	
	function stepBackward(vws) {
		articles.backward();
		vws.next = vws.current;
		vws.current = vws.previous;
		vws.previous = new pulp.View(articles.previous(), $containers[0]);
		vws.current.render($containers[1]);
		vws.next.render($containers[2]);
	}	
			
	carousel.extend({

		init: function() {
		},

		views: {
			previous: null,
			current: null,
			next: null
		},
		
		next: function() {
			pulp.log("NEXT", this.$element);
			$slider.addClass(slideRight);
		},
		
		previous: function() {
			pulp.log("PREV", this.$element)
			$slider.addClass(slideLeft);
		},
		
		display: function(path) {	

			// TODO: This doesn't do yet what it is supposed to do. Fix it!

			if(!this.element) initializeScaffold();			

			articles.find("url", path);
			var views = this.views;

			articles.current().observe( pulp.events.CONTENT_LOADED, function(){
				console.log("LOADED!")
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