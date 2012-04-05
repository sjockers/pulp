(function( pulp, $ ) {
	"use strict"

	var app = new pulp.util.Module;
	app.extend(pulp.util.observable);

	var articles = pulp.model.articles;

	function getTocUrl() {
		return $("link[rel='toc']").attr("href");						
	};

	function getTemplatesUrl() {
		return $("link[rel='templates']").attr("href");						
	};

	app.extend({
		
		init: function (tocUrl, templatesUrl) {
			var tocUrl = tocUrl || getTocUrl();
			var templatesUrl = templatesUrl || getTemplatesUrl();

			window.addEventListener("popstate", app.previousArticle);

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
		
		setup: function() {
			// TODO: Extract content from current page
			// var content = pulp.Article.extractContent($(document));			
			var path = window.location.pathname;
			app.navigate(path);
			pulp.ui.navbar.init();					
		},
		
		historySupported: function() {
			return !!(window.history && window.history.pushState);
		},
		
		updateHistory: function() {
			var article = pulp.model.articles.current();
			window.document.title = article.title;
			if(this.historySupported()) {
				history.pushState(null, null, article.url);				
			}			
		},	
		
		nextArticle: function() {
			if(articles.hasNext()){				
				articles.forward();
				pulp.ui.carousel.next();
				pulp.app.updateHistory();
			};
		},
		
		previousArticle: function() {			
			if(articles.hasPrevious()){	
				articles.backward();
				pulp.ui.carousel.previous();							
				pulp.app.updateHistory();
			};
		},
		
		navigate: function (path) {
			// TODO: Check if path is valid
			pulp.ui.carousel.display(path);			
		}
			
	});
	
	// expose to namespace
	pulp.app = pulp.app || app;

})( window.pulp = window.pulp || {}, jQuery );