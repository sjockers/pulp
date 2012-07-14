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
	var scroller;
	var slider;
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = document.body;
		carousel.hideContent();		
		carousel.render();		
				
		$containers[0] = carousel.$element.find("#container-0");
		$containers[1] = carousel.$element.find("#container-1");
		$containers[2] = carousel.$element.find("#container-2");
		
		slider = new pulp.util.Scroll('pulp-carousel', {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false,
			onScrollEnd: updateViews,
			onBeforeScrollStart: function(){
				
				// TODO: Use this to flag if next/previous movement is possible!
				
				if(this.dirX > 0 && articles.hasNext()) {
					pulp.log("HAS NEXT!");
					//this.pastPageX = this.currPageX;
					
				}
				if(this.dirX < 0 && articles.hasPrevious()) {
					pulp.log("HAS PREV!");
					//this.pastPageX = this.currPageX;
					
				}
			}
		});

		$(window).bind('orientationchange resize', function () {
			resizeContainers();
		});
		
		resizeContainers();	
	}
	
	function resizeContainers(){
		$.each($containers, function() {        
		    this.height($(document).height());  
		});
		scroller.refresh();
		slider.refresh();
		slider.center();
	}

	function updateViews(e){

		pulp.log(slider.pastPageX, slider.currPageX);
		
		// TODO: Remove if this proves unnecessary!
		// if(slider.pastPageX == slider.currPageX){
		// 	return;
		// };
		
		if(slider.currPageX > 1) {
			stepForward(carousel.views);
		};
		if(slider.currPageX < 1) {
			stepBackward(carousel.views);						
		};			

	}	
	
	function stepForward(vws) {
			
		console.log(articles.hasNext());	
			
		if(articles.hasNext()){
			slider.center();

			vws.previous = vws.current;
			vws.current = vws.next;
			vws.previous.render($containers[0]);
			vws.current.render($containers[1]);
			
			scroller = new pulp.util.Scroll('container-1');
							
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

			scroller = new pulp.util.Scroll('container-1');
		
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
			
			articles.find("url", path);
			var views = this.views;
						
			views.current =  new pulp.ArticleView(articles.current(), $containers[1]);
			scroller = new pulp.util.Scroll('container-1');
			
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