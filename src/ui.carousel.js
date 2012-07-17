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


		slider = new pulp.util.Scroll("pulp-carousel", {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false,
			onScrollEnd: updateViews
		});
		
		$("#pulp-next").click( function(){
			console.log("YEAH!");
			// slider.scrollToPage('next', 0);
			// return false;
		})
		
		$("#pulp-prev").click( function(){
			console.log("YEAH!");
			// slider.scrollToPage('prev', 0);
			// return false;
		})

			
		$(window).bind("orientationchange resize", function (){
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
		
		if(slider.currPageX > 1) {
			stepForward(carousel.views);
		}
		if(slider.currPageX < 1) {
			stepBackward(carousel.views);						
		}

	}	
	
	function stepForward(vws) {
					
		if(articles.hasNext()){
										
			pulp.app.nextArticle();
			
			if(articles.hasNext()){
				vws.previous = vws.current;
				vws.current = vws.next;
				
				vws.previous.render($containers[0]);
				vws.current.render($containers[1]);
				slider.center();
				scroller = new pulp.util.Scroll('container-1');
				vws.next = new pulp.ArticleView(articles.next(), $containers[2]);
			} 
			else {
				pulp.app.previousArticle();
				vws.previous = new pulp.ArticleView(articles.previous(), $containers[0]);
			}
		}
	}
	
	function stepBackward(vws) {

		if(articles.hasPrevious()){

			pulp.app.previousArticle();				

			if(articles.hasPrevious()){
				vws.next = vws.current;
				vws.current = vws.previous;
				
				vws.next.render($containers[2]);
				vws.current.render($containers[1]);
				slider.center();			
				scroller = new pulp.util.Scroll('container-1');		
				vws.previous = new pulp.ArticleView(articles.previous(), $containers[0]);
			}
			else {
				pulp.app.nextArticle();
				vws.next = new pulp.ArticleView(articles.next(), $containers[2]);				
			}
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
			
			slider.center();			
			
		}
	});
	

	// UI namespace declaration
	pulp.ui = pulp.ui || {};

	// expose to namespace
	pulp.ui.carousel = pulp.ui.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );