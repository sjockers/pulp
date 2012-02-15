!function( pulp, $, undefined ) {

		var articles = Object.create(pulp.util.iterator);

		var fetchTOC = function( callbacks ) {
			var url = "/toc.html";
												
			function onSuccess(data) {
				var articleArray = parseArticleItems(data);
				callbacks.onSuccess(articleArray);
			};
		
			$.ajax({
				type: "GET",
				url: url,
			  success: onSuccess,
				failure: callbacks.onFailure				
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

		// expose public properties and functions:
		pulp.model = pulp.model || function() {
			return {
				fetchTOC: fetchTOC,
				articles: articles
			}
		}();
	   
}( window.pulp = window.pulp || {}, jQuery );