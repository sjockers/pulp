(function( pulp, $ ) {
	"use strict"

	var Article = new pulp.util.Module; 
	
	// make instances observable: 
	Article.include(pulp.util.observable);
	
	Article.include({
		
		init: function(ressource) {
		  ressource = ressource || {};
			this.url = ressource.url;
		  this.title = ressource.title;
		  this.thumbnail = ressource.thumbnail;
		  this.byline = ressource.byline;
		  this.content = ressource.content;
		},
		
		save: function() {
			localStorage.setItem(this.url, JSON.stringify(this.content));			
		},

		load: function() {
			this.content = JSON.parse(localStorage.getItem(this.url));		
		},
		
		fetch: function(successCallback) {												
			var article = this;				
			article.load();

			function onSuccess(data){
				article.content = Article.extractContent(data);
				article.save();
				article.notify(pulp.events.CONTENT_LOADED);
				typeof successCallback == "function" && successCallback(self.content);				
			}

			if (article.content) {
			pulp.log("content available!", article.url);  
				article.notify(pulp.events.CONTENT_LOADED);				
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
	
	Article.extend({
		
		extractContent: function(htmlString) {
			// remove arbitrary line breaks and extract the content from the body-element using reg-ex
			var temp = htmlString.replace(/\s*\n\s*/g,' ');			
			temp = temp.split(/<\/?body[^>]*>/)[1];	
			return $(temp).find("#pulp").html();		
		}
		
	});
			
	// expose to namespace
	pulp.Article = pulp.Article || Article;		
		   
})( window.pulp = window.pulp || {}, jQuery );