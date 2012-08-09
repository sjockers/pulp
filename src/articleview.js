/**
 * pulp.ArticleView
 *
 * visual representation of an article, used for rendering articles in the ui.carousel component
 * 
 */

(function( pulp, $ ) {

	var ArticleView = new pulp.util.Module; 
	ArticleView.include(pulp.util.observable);
	ArticleView.include(pulp.util.renderable);

	// public methods:
	ArticleView.include({
		
		article: null,


    /**
     * Constructor.
     *
     * @method init
     * @param {pulp.Article} article to be rendered
     * @param {HTMLElement} target for rendering
     */				
		init: function(article, target) {
			
			if(!article || !target) {
				return
			};
			
			var view = this;
			view.article = article;
			
			view.article.observe( pulp.events.CONTENT_LOADED, function(){
				view.create("view_tmp", view.article);
				view.render(target);
				view.article.unObserve( pulp.events.CONTENT_LOADED, this);
			});
			
			view.article.fetch();
		},

    /**
		 * Inserts the view into the DOM (overwrites pulp.util.renderable) 
		 * 
     * @method render
     * @param {HTMLElement} target for rendering
     */		
		render: function(target) {
			this.target = target || this.target;		
			$(this.target).html(this.$element);					
		},
		
		replaceWith: function(replacement) {
			pulp.log(replacement.$element);
			this.$element.replaceWith(replacement.$element.html());
		}
		
	});
			
	// expose to namespace
	pulp.ArticleView = pulp.ArticleView || ArticleView;		
		   
})( window.pulp = window.pulp || {}, jQuery );