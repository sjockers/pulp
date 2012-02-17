"use strict"

!function( pulp, $, undefined ) {
		
		// costructor function		
		pulp.Article = function(ressource) {
		  ressource = ressource || {};
			
			this.url = ressource.url;
		  this.title = ressource.title;
		  this.thumbnail = ressource.thumbnail;
		  this.byline = ressource.byline;
		};
		
		// make instances observable: 
		pulp.Article.prototype = Object.create(pulp.util.observable);
		
		pulp.Article.prototype.fetch = function( successCallback ) {												
			var self = this;				
			
			$.ajax({
				type: "GET",
				url: this.url,
			  success: function(data) {
					self.content = extractContent(data);
					self.notify(pulp.events.CONTENT_LOADED);
					typeof successCallback == "function" && successCallback(self.content);
				}
			});			
		}
		
		function extractContent( htmlString ) {
			// extract the content from the body-element using reg-ex
			return htmlString.split(/<\/?body[^>]*>/)[1];			
		}
		   
}( window.pulp = window.pulp || {}, jQuery );