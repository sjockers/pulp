(function( pulp, $ ) {

	var View = new pulp.util.Module; 
	View.include(pulp.util.observable);
	View.include(pulp.util.renderable);
	
	View.include({
		
		article: null,
				
		init: function(article, target) {
			var view = this;
			view.article = article;
			
			view.article.observe( pulp.events.CONTENT_LOADED, function(){
				view.create("view_tmp", view.article);
				view.render(target);
			});
			
			view.article.fetch();
		},
		
	});
	
	View.extend({

	});
			
	// expose to namespace
	pulp.View = pulp.View || View;		
		   
})( window.pulp = window.pulp || {}, jQuery );