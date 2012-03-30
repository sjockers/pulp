(function( pulp, $ ) {
	"use strict"

	var app = new pulp.util.Module;
	app.extend(pulp.util.observable);

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

			$.ajax({
				type: "GET",
				dataType: "html",
				url: templatesUrl,
			  success: function(templates) {
					pulp.log("up and atom!");
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
		
		route: function(path) {
			
		},		
		
		nextArticle: function() {
			pulp.carousel.next();
		},
		
		previousArticle: function() {
			pulp.carousel.previous();			
		},
		
		navigate: function (path) {
			// TODO: Check if path is valid
			pulp.carousel.display(path);
			
			this.route(path);
		}
			
	});
	
	// expose to namespace
	pulp.app = pulp.app || app;

})( window.pulp = window.pulp || {}, jQuery );