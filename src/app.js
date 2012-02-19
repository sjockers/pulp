"use strict"

!function( pulp, $ ) {

	var app = new pulp.util.Module;
	
	app.init = function(){
		var url = $("link[rel='toc']").attr("href");
		pulp.model.getToc(url);
	};
	
	app.showArticle = function(url){
		var article = pulp.model.articles.find("url", url);
		$("body").append(article.title);
	}
	
	// expose to namespace
	pulp.app = pulp.app || app;

}( window.pulp = window.pulp || {}, jQuery );