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
	var scroller;
	var slider;
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = document.body;
		carousel.hideContent();		
		carousel.render();		

		slider = new pulp.util.Scroll("pulp-carousel", {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false,
			onScrollEnd: updateViews
		});
			
		$(window).bind("orientationchange resize", function (){
			resizeContainers();
		}); 
		
		makeLinksLocal();		
	}
	
	function resizeContainers(){		
		$("#slider").height($(document).height());
		scroller.refresh();
		slider.refresh();
		slider.center();
	}

	function updateViews(e){
		if(slider.currPageX > 1) {
			stepForward();
		}
		if(slider.currPageX < 1) {
			stepBackward();						
		}			
	} 
	
	function makeLinksLocal() {
		var a = document.getElementsByTagName("a");
		for(var i=0;i<a.length;i++) {
		if(!a[i].onclick && a[i].getAttribute("target") != "_blank") {
			a[i].onclick=function() {
					window.location=this.getAttribute("href");
					return false; 
				}
			}
		}
	}
	
	function findViews() {
		return {
			previous: $(slider.scroller).find(".previous"),	
			current: $(slider.scroller).find(".current"),
			next: $(slider.scroller).find(".next")  	
		}
	}
	
	function stepForward() {
					
		if(articles.hasNext()){
										
			pulp.app.nextArticle();
			var views = findViews();
			
			if(articles.hasNext()){

				new pulp.ArticleView(articles.next(), views.previous);
				
				views.next.removeClass("next").addClass("current");								
				views.current.removeClass("current").addClass("previous");
				views.previous.removeClass("previous").addClass("next");
														
				slider.center();
				
				scroller.refresh();
				scroller.destroy();
				scroller = new pulp.util.Scroll(views.next.get(0));
			
			} 
			else {
				pulp.app.previousArticle();
				new pulp.ArticleView(articles.previous(), views.previous);
				scroller.refresh();
				scroller.destroy();
				scroller = new pulp.util.Scroll(views.next.get(0)); 
			}
		}
	}
	
	function stepBackward() {

		if(articles.hasPrevious()){

			pulp.app.previousArticle();				
			var views = findViews();
			
			if(articles.hasPrevious()){

				new pulp.ArticleView(articles.previous(), views.next);
				
				views.previous.removeClass("previous").addClass("current");
				views.current.removeClass("current").addClass("next");
				views.next.removeClass("next").addClass("previous");								
														
				slider.center();								
				scroller.refresh();
				scroller.destroy();
				scroller = new pulp.util.Scroll(views.previous.get(0)); 

			}
			else {
				pulp.app.nextArticle();
				new pulp.ArticleView(articles.next(), views.next); 
				scroller.refresh();
				scroller.destroy();				
				scroller = new pulp.util.Scroll(views.previous.get(0)); 
			}
		}		
	} 
			
	carousel.extend({

		init: function() {
		},
		
		display: function(path) { 

			if(!this.element) initializeScaffold();			
			
			articles.find("url", path);
			var views = findViews();
			
			new pulp.ArticleView(articles.current(), views.current);
			scroller = new pulp.util.Scroll(views.current.get(0)); 
			
			if(articles.hasPrevious()){
				new pulp.ArticleView(articles.previous(), views.previous);					
			}
						
			if(articles.hasNext()){
				new pulp.ArticleView(articles.next(), views.next);
			}
			
			resizeContainers();				
		},
		
		forward: function(){
			slider.scrollToPage('next', 0);
		},
		
		backward: function(){
			slider.scrollToPage('prev', 0);
		}
		
	});
	

	// UI namespace declaration
	pulp.ui = pulp.ui || {};

	// expose to namespace
	pulp.ui.carousel = pulp.ui.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );