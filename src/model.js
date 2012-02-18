"use strict"

!function( pulp, $ ) {

	var model = new pulp.util.Module;
	model.extend(pulp.util.observable);	
	model.articles = new pulp.util.Collection;
						
	model.getToc = function(pathToToc) {
		fetchTocFromServer( pathToToc, function(data) {
			var articleArray = parseArticleItems(data);
			model.articles.init(articleArray);
			model.notify(pulp.events.TOC_LOADED);
		});
	}
			
	function fetchTocFromServer( url, successCallback, failureCallback ) {												
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

	function parseArticleItems(htmlFragment) {
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

	// expose to namespace
	pulp.model = pulp.model || model;
	   
}( window.pulp = window.pulp || {}, jQuery );