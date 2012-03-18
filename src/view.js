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
				view.article.unObserve( pulp.events.CONTENT_LOADED, this);
			});
			
			view.article.fetch();
		},
		
		// insert it into the DOM (overwrites pulp.util.renderable)
		render: function(target){
			this.target = target || this.target;		
			$(this.target).html(this.$element);					
		}
		
	});
	
	View.extend({

	});
			
	// expose to namespace
	pulp.View = pulp.View || View;		
		   
})( window.pulp = window.pulp || {}, jQuery );