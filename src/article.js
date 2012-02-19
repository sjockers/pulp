"use strict"

!function( pulp, $ ) {
		
		// costructor function		
		pulp.Article = function(ressource) {
		  ressource = ressource || {};
			
			this.url = ressource.url;
		  this.title = ressource.title;
		  this.thumbnail = ressource.thumbnail;
		  this.byline = ressource.byline;
		};
		
		// make instances observable: 
		pulp.Article.prototype = new pulp.util.Module;		
		pulp.Article.prototype.extend(pulp.util.observable);
		
		pulp.Article.prototype.fetch = function( successCallback ) {												
			var self = this;				
			
			function onSuccess(data){
				self.content = extractContent(data);
				self.notify(pulp.events.CONTENT_LOADED);
				typeof successCallback == "function" && successCallback(self.content);				
			}
			
			$.ajax({
				type: "GET",
				url: this.url,
			  success: onSuccess
			});			
		}
		
		function extractContent( htmlString ) {
			// extract the content from the body-element using reg-ex
			return htmlString.split(/<\/?body[^>]*>/)[1];			
		}
		   
}( window.pulp = window.pulp || {}, jQuery );