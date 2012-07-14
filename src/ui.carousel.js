/**
 * pulp.ui.carousel
 *
 * ui component for displaying articles
 * also handles touch-screen flipping through articles
 * 
 */

(function( pulp, $ ) {
	"use strict"

	var carousel = new pulp.util.Module;	
	carousel.extend( pulp.util.renderable );
	carousel.extend( pulp.util.observable );
	carousel.extend( pulp.util.touchable );
	
	var articles = pulp.model.articles;
	var $containers = [];
	var scrollers = [];
	var slider;
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = document.body;
		carousel.hideContent();		
		carousel.render();		
				
		$containers[0] = carousel.$element.find("#container-0");
		$containers[1] = carousel.$element.find("#container-1");
		$containers[2] = carousel.$element.find("#container-2");

		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);				

		slider = new pulp.util.Scroll('pulp-carousel', {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false,
			onScrollEnd: updateViews,
			onScrollStart: function(){
				this.pastPageX = this.currPageX;
			}
		});
		
		slider.center();
		
	}

	function updateViews(e){

		pulp.log(slider.pastPageX, slider.currPageX);
		
		if(slider.pastPageX == slider.currPageX){
			return;
		};
		
		setTimeout(function(){			
			if(slider.currPageX > 1) {
				stepForward(carousel.views);
			};
			if(slider.currPageX < 1) {
				stepBackward(carousel.views);						
			};			
		}, 300)

	}	
	
	function stepForward(vws) {
			
		if(articles.hasNext()){
			slider.center();

			vws.previous = vws.current;
			vws.current = vws.next;
			vws.previous.render($containers[0]);
			vws.current.render($containers[1]);
			
			new pulp.util.Scroll('container-1');
							
			pulp.app.nextArticle();
			vws.next = new pulp.ArticleView(articles.next(), $containers[2]);
		}
	}
	
	function stepBackward(vws) {

		if(articles.hasPrevious()){
			slider.center();
		
			vws.next = vws.current;
			vws.current = vws.previous;
			vws.next.render($containers[2]);
			vws.current.render($containers[1]);				

			new pulp.util.Scroll('container-1');
		
			pulp.app.previousArticle();				
			vws.previous = new pulp.ArticleView(articles.previous(), $containers[0]);
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
		
		display: function(path) {	

			if(!this.element) initializeScaffold();			
			// initializeScaffold();
			
			articles.find("url", path);
			var views = this.views;
						
			views.current =  new pulp.ArticleView(articles.current(), $containers[1]);
			// scrollers[0] = new pulp.util.Scroll('container-1', {
			// 	onScrollEnd: function(){
			// 		pulp.log("CONTAINER!"); 
			// 	}
			//});
			
			if(articles.hasPrevious()){
				views.previous = new pulp.ArticleView(articles.previous(), $containers[0]);					
			}					
			if(articles.hasNext()){
				views.next = new pulp.ArticleView(articles.next(), $containers[2]);
			}
			
		}
	});
	

	// UI namespace declaration
	pulp.ui = pulp.ui || {};

	// expose to namespace
	pulp.ui.carousel = pulp.ui.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );