/**
 * pulp.ui.carousel
 *
 * ui component for displaying articles
 * also handles touch-screen flipping through articles
 * 
 */

(function( pulp, $ ) {

	var carousel = new pulp.util.Module();	
	carousel.extend( pulp.util.renderable );
	carousel.extend( pulp.util.observable );
	carousel.extend( pulp.util.touchable );
	
	var articles = pulp.model.articles;
	
	var leftStepSkipped = false;
	var rightStepSkipped = false;

	function makeLinksLocal() {
		var a = document.getElementsByTagName("a");
		var i;
		function openExternal() {
			window.location=this.getAttribute("href");
			return false; 
		}
		for(i=0;i<a.length;i++) {
			if(!a[i].onclick && a[i].getAttribute("target") !== "_blank") {
				a[i].onclick = openExternal; 
			}
		}
	}
	
	function resizeContainers(){		
		$("#slider").height($(document).height());
		carousel.scroller.refresh();
		carousel.slider.refresh();
		carousel.slider.center();
	}

	function findViews(slider) {
		return {
			previous: $(slider).find(".previous"),	
			current: $(slider).find(".current"),
			next: $(slider).find(".next")		
		};
	}
	
	function stepForward() {

		if(rightStepSkipped === false) {															
			pulp.app.nextArticle();
			var views = findViews(carousel.slider.scroller);
		
			if(articles.hasNext()){

				pulp.articleViewFactory.create(articles.next(), views.previous);
			
				views.next.removeClass("next").addClass("current");								
				views.current.removeClass("current").addClass("previous");
				views.previous.removeClass("previous").addClass("next");
													
				carousel.slider.center();
			
				carousel.scroller.destroy();
				carousel.scroller = new pulp.util.Scroll(views.next.get(0));
			
				leftStepSkipped = false;
			
			} 
			else {
				if (rightStepSkipped === false) {
					pulp.app.previousArticle();
					pulp.articleViewFactory.create(articles.previous(), views.previous);

					carousel.scroller = new pulp.util.Scroll(views.next.get(0));
					rightStepSkipped = true;
				}
			}
		}
	}
	
	function stepBackward() {

		if(leftStepSkipped === false){

			pulp.app.previousArticle();				
			var views = findViews(carousel.slider.scroller);
		
			if(articles.hasPrevious()){

				pulp.articleViewFactory.create(articles.previous(), views.next);
			
				views.previous.removeClass("previous").addClass("current");
				views.current.removeClass("current").addClass("next");
				views.next.removeClass("next").addClass("previous");								
													
				carousel.slider.center();
			
				carousel.scroller.destroy();				
				carousel.scroller = new pulp.util.Scroll(views.previous.get(0));

				rightStepSkipped = false;
		
			}
			else {
				if (leftStepSkipped === false) {
					pulp.app.nextArticle();
					pulp.articleViewFactory.create(articles.next(), views.next); 
					carousel.scroller = new pulp.util.Scroll(views.previous.get(0));				
					leftStepSkipped = true;					
				}
			}
		}
	} 

	function updateViews(e){		
		switch (carousel.slider.currPageX) {
			case 0 :
				stepBackward();
				break;
			case 2 :
				stepForward();
				break;
		}
	} 
	
	function initializeScaffold(){
		
		carousel.create("carousel_tmpl");
		carousel.target = document.body;
		carousel.hideContent();
		
		carousel.render();		

		carousel.slider = new pulp.util.Scroll("pulp-carousel", {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false,
			lockDirection: true, 
			onScrollEnd: updateViews,
		});
			
		$(window).bind("orientationchange resize", function (){
			resizeContainers();
		});
		
		makeLinksLocal();		
	}
			
	carousel.extend({

		scroller: null,
		slider: null,

		init: function() {
		},
		
		display: function(path) { 

			if(!this.element) {
				initializeScaffold();			
			}
			
			articles.find("url", path);
			var views = findViews(this.slider.scroller);
			
			pulp.articleViewFactory.create(articles.current(), views.current);
			carousel.scroller = new pulp.util.Scroll(views.current.get(0)); 
			
			if(articles.hasPrevious()){
				pulp.articleViewFactory.create(articles.previous(), views.previous);					
			}
						
			if(articles.hasNext()){
				pulp.articleViewFactory.create(articles.next(), views.next);
			}
			
			resizeContainers();				
		},
		
		forward: function(){
			this.slider.scrollToPage('next', 0);
		},
		
		backward: function(){
			this.slider.scrollToPage('prev', 0);
		}
		
	});
	

	// UI namespace declaration
	pulp.ui = pulp.ui || {};

	// expose to namespace
	pulp.ui.carousel = pulp.ui.carousel || carousel;

}( window.pulp = window.pulp || {}, jQuery ));