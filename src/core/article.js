/**
 * pulp.core.Article
 *
 * Represents an article item
 *
 */

pulp.util.namespace("core");

pulp.core.Article = (function( pulp, $ ) {
  "use strict";

  var Article = new pulp.core.Module();

  // make instances observable:
  Article.include(pulp.mixin.observable);

  // public methods:
  Article.include({

    /**
     * Constructor.
     *
     * @method init
     * @param {Object} object containing a TOC item
     */   
    init: function(ressource) {
      ressource = ressource || {};
      this.url = ressource.url;
      this.title = ressource.title;
      this.thumbnail = ressource.thumbnail;
      this.byline = ressource.byline;
      this.content = ressource.content;
    },

    /**
     * Persist Article to LocalStorage.
     *
     * @method save
     */
    save: function() {
      localStorage.setItem(this.url, JSON.stringify(this.content));
    },

    /**
     * Load Article from LocalStorage.
     *
     * @method load
     */
    load: function() {
      this.content = JSON.parse(localStorage.getItem(this.url));
    },


    /**
     * Fetch Article from Server.
     *
     * @method fetch
     */   
    fetch: function(successCallback) {
      var article = this;
      article.load();

      function onSuccess(data){
        article.content = Article.extractContent(data);
        article.save();
        article.notify(pulp.core.events.CONTENT_LOADED);
        if (typeof successCallback === "function") {
          successCallback();
        }
      }

      if (article.content) {
        article.notify(pulp.core.events.CONTENT_LOADED);       
      }
      else {
        $.ajax({
          type: "GET",
          dataType: "html",
          url: this.url,
          success: onSuccess
        });       
      } 
    }

  });

  // public static methods: 
  Article.extend({

    /**
     * Extracts the article content from an HTML document 
     *
     * @method extractContent
     * @param {String} a string containing a complete HTML document
     */   
    extractContent: function(htmlString) {
      // remove arbitrary line breaks and extract the content from the body-element using reg-ex
      var temp = htmlString.replace(/\s*\n\s*/g,' ');     
      temp = temp.split(/<\/?body[^>]*>/)[1]; 
      return $(temp).find("#pulp").html();    
    }

  });    
  
  return Article;

}( pulp, jQuery ));