"use strict"

!function( pulp, $, undefined ) {

	var model = Object.create(pulp.util.observable);
		
	model.articles = new pulp.util.Iterator();
						
	model.getToc = function(pathToToc) {
		fetchTocFromServer( pathToToc, function(data) {
			var articleArray = parseArticleItems(data);
			model.articles.init(articleArray);
			model.notify(pulp.events.TOC_LOADED);
		});
	}
			
	var fetchTocFromServer = function( url, successCallback, failureCallback ) {												
		$.ajax({
			type: "GET",
			url: url,
			success: function (data, status, xhr) {
				typeof successCallback == "function" && successCallback(data);
			},
			error: function (xhr, status, exception) {
				typeof failureCallback == "function" && failureCallback(status);
			}				
		});			
	}	

	var parseArticleItems = function(htmlFragment) {
		var items = $(htmlFragment).find("[itemscope]");				
		var articles = $.map( items, function(item) {
			var i = $(item);
			return new pulp.Article({
				title :  i.find("[itemprop='title']").text(),
				url :    i.find("[itemprop='url']").attr("href"),
				byline : i.find("[itemprop='byline']").text()
			}); 
		});
		return articles;			
	}

	// expose model (module pattern)
	pulp.model = pulp.model || function() {
	 	return model;
	}();
	   
}( window.pulp = window.pulp || {}, jQuery );