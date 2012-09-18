/**
 * pulp.app
 *
 * This module is the entry point to the application.
 *
 */

(function( pulp, $) {
  "use strict";
  
  pulp.app = (function(){
    var app = new pulp.core.Module();
    app.extend(pulp.mixin.observable);
    var articles = pulp.core.model.articles;

    // private methods:

    function getTocUrl() {
      return $("link[rel='toc']").attr("href");
    }

    function getTemplatesUrl() {
      return $("link[rel='templates']").attr("href");
    }

    // public methods:
    app.extend({

    /**
     * Initializes the application.
     *
     * @method init
     * @param {String} path to TOC
     * @param {String} path to external GUI templates
     */
    init: function(tocUrl, templatesUrl) {
      var toc = tocUrl || getTocUrl();
      var templates = templatesUrl || getTemplatesUrl();


      //TODO: Make History API/popstate work
      //window.addEventListener("popstate", pulp.ui.carousel.backward);
      //console.log("LOAD TOC!");

      $.ajax({
      type: "GET",
      dataType: "html",
      url: templates,
      success: function(templates) {
        $(document.body).append(templates);
        pulp.core.model.observe(pulp.core.events.TOC_LOADED, app.setup);
        pulp.core.model.getToc(toc);
      }
      });

    },

    /**
     * Sets up the GUI elements.
     *
     * @method setup
     */
    setup: function() {
      var path = window.location.pathname;
      app.navigate(path);
      pulp.ui.navbar.init();
    },

    /**
     * Checks if the History API is supported.
     *
     * @method historySupported
     */
    historySupported: function() {
      return !!(window.history && window.history.pushState);
    },

    /**
     * Updates the browser history.
     *
     * @method updatesHistory
     */
    updateHistory: function() {
      var article = articles.current();
      window.document.title = article.title;
      if (this.historySupported()) {
      history.pushState(null, null, article.url);
      }
    },

    /**
     * Trigger flicking forward.
     *
     * @method nextArticle
     */
    nextArticle: function() {
      articles.forward();
      pulp.app.updateHistory();
    },

    /**
     * Trigger flicking backward.
     *
     * @method previousArticle
     */
    previousArticle: function() {
      articles.backward();
      pulp.app.updateHistory();
    },

    /**
     * Navigate to a certain article within the publication.
     *
     * @method navigate
     * @param {String} path to the article (ID)
     */
    navigate: function(path) {
      // TODO: Check if path is valid
      pulp.ui.carousel.display(path);
    }

    });
    
    return app;    
  }());

}( pulp, jQuery ));
