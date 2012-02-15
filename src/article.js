 !function( pulp, $, undefined ) {
		
		// costructor function		
		pulp.Article = function(ressource) {
		  ressource = ressource || {};
			
			this.url = ressource.url;
		  this.title = ressource.title;
		  this.thumbnail = ressource.thumbnail;
		  this.byline = ressource.byline;
		};
		
		pulp.Article.prototype.fetch = function( callbacks ) {												
			
			var self = this;
			
			function onSuccess(data) {
				self.content = extractContent(data);
				callbacks.onSuccess(self.content);
			};
				
			$.ajax({
				type: "GET",
				url: this.url,
			  success: onSuccess,
				failure: callbacks.onFailure				
			});
			
		}
		
		function extractContent( htmlString ) {
			// extract the content from the body-element using reg-ex
			return htmlString.split(/<\/?body[^>]*>/)[1];			
		}
		
		
		
	   
}( window.pulp = window.pulp || {}, jQuery );