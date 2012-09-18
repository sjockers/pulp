/**
 * pulp.core.ArticleView
 * pulp.core.ArticleViewFactory
 *
 * visual representation of an article, used for rendering articles in the ui.carousel component
 * 
 */


pulp.util.namespace("ArticleViewFactory");

pulp.core.ArticleViewFactory = (function( pulp, $ ) {

  var ArticleView = new pulp.core.Module(); 
  ArticleView.include(pulp.mixin.observable);
  ArticleView.include(pulp.mixin.renderable);

  // public methods:
  ArticleView.include({
    
    article: null,

    /**
     * Constructor.
     *
     * @method init
     * @param {pulp.core.Article} article to be rendered
     * @param {HTMLElement} target for rendering
     */       
    init: function(article, target) {
      
      if(!article || !target) {
        return;
      }
      
      var view = this;
      view.article = article;
      
      view.article.observe( pulp.core.events.CONTENT_LOADED, function(){
        view.create("view_tmp", view.article);
        view.render(target);
        view.article.unObserve( pulp.core.events.CONTENT_LOADED, this);
      });
      
      view.article.fetch();
    },

    /**
     * Inserts the view into the DOM (overwrites pulp.mixin.renderable) 
     * 
     * @method render
     * @param {HTMLElement} target for rendering
     */   
    render: function(target) {
      this.target = target || this.target;    
      $(this.target).html(this.$element);         
    },
    
    replaceWith: function(replacement) {
      pulp.util.log(replacement.$element);
      this.$element.replaceWith(replacement.$element.html());
    }
    
  });
      
  return {
    create : function(article, target){
      return new ArticleView(article, target);
    }
  };    
       
}( pulp, jQuery ));