"use strict"

!function( pulp, $ ) {
		
	var View = new pulp.util.Module; 

	// make instances observable: 
	View.include(pulp.util.observable);
	
	View.include({
		
		init: function(article) {
			this.article = article;
			this.article.observe( pulp.events.CONTENT_LOADED, this.create );
			this.article.fetch();
		},
		
		create: function() {
			$("body").append(this.article.content);			
		}
	});
	
	View.extend({

	});
			
	// expose to namespace
	pulp.View = pulp.View || View;		
		   
}( window.pulp = window.pulp || {}, jQuery );