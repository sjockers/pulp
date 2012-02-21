(function( pulp, $ ) {
	"use strict"

	var Article = new pulp.util.Module; 

	// make instances observable: 
	Article.include(pulp.util.observable);
	
	Article.include({
		
		init: function(ressource) {
		  ressource = ressource || {};

			this.url = ressource.url;
		  this.title = ressource.title;
		  this.thumbnail = ressource.thumbnail;
		  this.byline = ressource.byline;
		  this.content = ressource.content;

		},
		
		fetch: function(successCallback) {												
			var self = this;				

			function onSuccess(data){
				self.content = Article.extractContent(data);
				self.notify(pulp.events.CONTENT_LOADED);
				typeof successCallback == "function" && successCallback(self.content);				
			}

			$.ajax({
				type: "GET",
				url: this.url,
			  success: onSuccess
			});			
		}
		
	});
	
	Article.extend({
		
		extractContent: function(htmlString) {
			// extract the content from the body-element using reg-ex
			return htmlString.split(/<\/?body[^>]*>/)[1];			
		}
		
	});
			
	// expose to namespace
	pulp.Article = pulp.Article || Article;		
		   
})( window.pulp = window.pulp || {}, jQuery );