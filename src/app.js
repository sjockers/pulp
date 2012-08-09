
/**
 * pulp.app 
 * 
 * This module is the entry point to the application.
 *
 */

(function( pulp, $ ) {
	"use strict"

	var app = new pulp.util.Module;
	app.extend(pulp.util.observable);
	var articles = pulp.model.articles;

	// private methods:
	function getTocUrl() {
		return $("link[rel='toc']").attr("href");						
	};

	function getTemplatesUrl() {
		return $("link[rel='templates']").attr("href");						
	};

	// public methods:
	app.extend({

    /**
     * Initializes the application.
     *
     * @method init
     * @param {String} path to TOC
     * @param {String} path to external GUI templates
     */		
		init: function (tocUrl, templatesUrl) {
			var tocUrl = tocUrl || getTocUrl();
			var templatesUrl = templatesUrl || getTemplatesUrl();


			//TODO: Make History API/popstate work
			//window.addEventListener("popstate", pulp.ui.carousel.backward);

			console.log("LOAD TOC!");

			$.ajax({
				type: "GET",
				dataType: "html",
				url: templatesUrl,
			  success: function(templates) {				
					$(document.body).append(templates);
					pulp.model.observe(pulp.events.TOC_LOADED, app.setup);
					pulp.model.getToc(tocUrl);
				}
			});

		},
		
		/**
     * Sets up the GUI elements.
     *
     * @method setup
     */
		setup: function() {			
			var path = window.location.pathname;
			app.navigate(path);
			pulp.ui.navbar.init();					
		},
		
		/**
     * Checks if the History API is supported.
     *
     * @method historySupported
     */
		historySupported: function() {
			return !!(window.history && window.history.pushState);
		},
		
		/**
     * Updates the browser history.
     *
     * @method updatesHistory
     */
		updateHistory: function() {
			var article = pulp.model.articles.current();
			window.document.title = article.title;
			if(this.historySupported()) {
				history.pushState(null, null, article.url);				
			}			
		},	
		
		/**
     * Trigger flicking forward.
     *
     * @method nextArticle
     */
		nextArticle: function() {
			console.log("next!", articles.hasNext(), articles.current())
			if(articles.hasNext()){		
				articles.forward();
				pulp.app.updateHistory();
			};
		},
				
		/**
     * Trigger flicking backward.
     *
     * @method previousArticle
     */
		previousArticle: function() {	
			console.log("prev!", articles.hasPrevious())
			if(articles.hasPrevious()){	
				articles.backward();
				pulp.app.updateHistory();
			};
		},
		
		/**
     * Navigate to a certain article within the publication.
     *
     * @method navigate
     * @param {String} path to the article (ID)
     */
		navigate: function (path) {
			// TODO: Check if path is valid
			pulp.ui.carousel.display(path);			
		}
			
	});
	
	// expose to namespace
	pulp.app = pulp.app || app;

})( window.pulp = window.pulp || {}, jQuery );