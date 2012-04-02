(function( pulp, $ ) {
	"use strict"

	var carousel = new pulp.util.Module;	
	carousel.extend( pulp.util.renderable );
	carousel.extend( pulp.util.observable );
	carousel.extend( pulp.util.touchable );
	
	var articles = pulp.model.articles;	
	var $containers = [];
	var $slider;

	var slideLeft = "slide-left";
	var slideRight = "slide-right";
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = document.body;
		carousel.hideContent();		
		carousel.render();		
		carousel.touch("swipeLeft", pulp.app.nextArticle);
		carousel.touch("swipeRight", pulp.app.previousArticle);
		
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
		vws.previous = vws.current;
		vws.current = vws.next;
		vws.previous.render($containers[0]);
		vws.current.render($containers[1]);

		if(articles.hasNext()){
			vws.next = new pulp.View(articles.next(), $containers[2]);		
		}
	}
	
	function stepBackward(vws) {
		vws.next = vws.current;
		vws.current = vws.previous;
		vws.next.render($containers[2]);
		vws.current.render($containers[1]);

		if(articles.hasPrevious()){			
			vws.previous = new pulp.View(articles.previous(), $containers[0]);
		}
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
			$slider.addClass(slideRight);
		},
		
		previous: function() {
			$slider.addClass(slideLeft);
		},
		
		display: function(path) {	

			// TODO: This doesn't do yet what it is supposed to do. Fix it!

			if(!this.element) initializeScaffold();			

			articles.find("url", path);
			var views = this.views;
			
			views.current =  new pulp.View(articles.current(), $containers[1]);
			
			if(articles.hasPrevious()){
				views.previous = new pulp.View(articles.previous(), $containers[0]);					
			}					
			if(articles.hasNext()){
				views.next = new pulp.View(articles.next(), $containers[2]);
			}
		}
	});
	
	// expose to namespace
	pulp.carousel = pulp.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );