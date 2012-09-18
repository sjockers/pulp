/**
 * pulp.core.model
 *
 * data model for the publication. Home of words.
 * 
 */

pulp.util.namespace("core");

pulp.core.model = (function( pulp, $ ) {
  "use strict";
    
  var model = new pulp.core.Module();
  model.extend(pulp.mixin.observable); 
  model.articles = new pulp.core.Collection();
  
  function fetchTocFromServer( url, successCallback, failureCallback ) {                        
    $.ajax({
      type: "GET",
      url: url,
      success: function (data, status, xhr) {
        if (typeof successCallback === "function") {
          successCallback(data);
        }
      },
      error: function (xhr, status, exception) {
        if (typeof failureCallback === "function") {
          failureCallback(exception);
        }
      }
    });
  } 

  function parseArticleItems(htmlFragment) {
    var items = $(htmlFragment).find("[itemscope]");        
    var articles = $.map( items, function(item) {
      var i = $(item);
      return new pulp.core.Article({
        title :  i.find("[itemprop='title']").text(),
        url :    i.find("[itemprop='url']").attr("href"),
        byline : i.find("[itemprop='byline']").text()
      }); 
    });

    return articles;      
  }
            
  model.getToc = function(pathToToc) {
    
    function success (data) {
      var articleArray = parseArticleItems(data);
      model.articles.init(articleArray);
      model.notify(pulp.core.events.TOC_LOADED);
    }
    
    function failure (error) {
      pulp.util.log("Table of contents could not be loaded!", error);
    }
    
    fetchTocFromServer( pathToToc, success, failure );
  };
  
  return model;
     
}( pulp, jQuery ));