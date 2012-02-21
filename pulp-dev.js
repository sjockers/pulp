(function( pulp, $ ) {
	"use strict"

	var app = new pulp.util.Module;
	
	app.init = function(){
		var url = $("link[rel='toc']").attr("href");						
		pulp.controller.init(url);
	};
	
	// expose to namespace
	pulp.app = pulp.app || app;

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
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
		
		fetch: function(successCallback) {												
			var self = this;				

			function onSuccess(data){
				self.content = Article.extractContent(data);
				self.notify(pulp.events.CONTENT_LOADED);
				typeof successCallback == "function" && successCallback(self.content);				
			}

			$.ajax({
				type: "GET",
				url: this.url,
			  success: onSuccess
			});			
		}
		
	});
	
	Article.extend({
		
		extractContent: function(htmlString) {
			// extract the content from the body-element using reg-ex
			return htmlString.split(/<\/?body[^>]*>/)[1];			
		}
		
	});
			
	// expose to namespace
	pulp.Article = pulp.Article || Article;		
		   
})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	var carousel = new pulp.util.Module;
	
	var articles = pulp.model.articles;
	
	carousel.extend({

		views: {
			previous: null,
			current: null,
			next: null
		},
		
		display: function(path) {	
			articles.find("url", path);

			articles.current().observe( pulp.events.CONTENT_LOADED, function(){
				carousel.views.previous = new pulp.View(articles.previous());
				carousel.views.next = new pulp.View(articles.next());
			})

			this.views.current =  new pulp.View(articles.current());
		}
	});
	
	// expose to namespace
	pulp.carousel = pulp.carousel || carousel;

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	var controller = new pulp.util.Module;
	controller.extend(pulp.util.observable);

	controller.extend({
		init: function (tocUrl) {
			pulp.model.observe(pulp.events.TOC_LOADED, this.setup);
			pulp.model.getToc(tocUrl);
		},
		
		setup: function() {
			// TODO: Extract content from current page
			// var content = pulp.Article.extractContent($(document));
			
			var path = window.location.pathname;
			this.navigate(path);			
		},
		
		route: function(path) {
			
		},
		
		navigate: function (path) {
			// TODO: Check if path is valid
			pulp.carousel.display(path);
			this.route(path);
		}
			
	});
	
	// expose to namespace
	pulp.controller = pulp.controller || controller;

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	pulp.events = {
		TOC_LOADED : "TOC loaded!",
		CONTENT_LOADED : "Content loaded!"
	}

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

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
	   
})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose public functions:
	pulp.util.Collection = function() {
		
		var index = 0;
		var data = [];
		
		return {
	
			init: function (array) {
				this.clear();	
				data = array;
			},

			add: function (item) {
				data.push(item);
			},

			find: function (property, key) {
				var i=data.length;
				while (i > 0) {
					i--;
					if (data[i][property] == key) {
						index = i;
						return data[i];
					}
				}
				return null;
			},

			current: function () {
				if (!this.hasItems()) {
					return null;
				}
				return data[index];
			},
			
			next: function () {
				if (!this.hasNext()) {
					return null;
				}
				return data[index+1];					
			},

			previous: function () {
				if (!this.hasPrevious()) {
					return null;
				}						 
				return data[index-1];
			},

			rewind: function () {
				index = 0;
			},
	
			clear: function () {
				index = 0;
				data = [];
			},
			
			hasItems: function () {
				return data.length > 0;
			},

			hasNext: function () {
				return index+1 < data.length;
			},

			hasPrevious: function () {
				return index > 0;
			}
	
		}
	}	

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	var closure = function(parent){  
	  var Module = function(){
	    this.init.apply(this, arguments);
	  };

	  Module.prototype.init = function(){};

	  if (parent){
	    for(var i in parent){
	      Module[i] = SuperClass.clone(parent[i]);
	    }
	    for(var i in parent.prototype){
	      Module.prototype[i] = SuperClass.clone(parent.prototype[i]);
	    }
	    Module._super = parent;
	    Module.prototype._super = parent.prototype;
	  }

	  Module.extend = function(obj){
	    var extended = obj.extended;
	    for(var i in obj){
	      Module[i] = obj[i];
	    }
	    if (extended) extended(Module)
	  };

	  Module.include = function(obj){
	    var included = obj.included;
	    for(var i in obj){
	      Module.prototype[i] = obj[i];
	    }
	    if (included) included(Module)
	  };

	  Module.proxy = function(func){
	    var thisObject = this;
	    return(function(){ 
	      return func.apply(thisObject, arguments); 
	    });
	  }
	
	  Module.prototype.proxy = Module.proxy;

	  Module.prototype._class = Module;

	  return Module;
	};

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose to namespace
	pulp.util.Module = closure;

})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	function _observers(observable, event) {
		if (!observable.observers) {
			observable.observers = {};
		}
		
		if (!observable.observers[event]) {
			observable.observers[event] = [];
		}
		
		return observable.observers[event];
	}

	function observe(event, observer) {
		if (!this.observers) {
			this.observers = [];
		}
		
		if (typeof observer != "function") {
			throw new TypeError("not a function"); 
		}
		
		if (typeof event != "string") {
			throw new TypeError("not a valid event identifier"); 
		}
		
		_observers(this, event).push(observer);
	}; 
	
	function hasObserver(event, observer) {
		var observers  = _observers(this, event);
		return ($.inArray(observer, observers) >= 0);
	};
	
	function notify(event) {
		if (typeof event != "string") {
			throw new TypeError("not a valid event identifier"); 
		}
		
		var observers  = _observers(this, event);
		var args = Array.prototype.slice.call(arguments, 1);

		$.each(observers, function() {			
			try {
				this.apply(this, args);
			} catch (e) {};
		});
	};
		
	// utilities namespace declaration
	pulp.util = pulp.util || {};
	
	// expose public functions:
	pulp.util.observable = {
		observe: observe,         		
		hasObserver: hasObserver,
		notify: notify
	}
	   
})( window.pulp = window.pulp || {}, jQuery );(function( pulp, $ ) {
	"use strict"

	var View = new pulp.util.Module; 

	// make instances observable: 
	View.include(pulp.util.observable);
	
	View.include({
		
		init: function(article) {
			this.article = article;
			this.article.observe( pulp.events.CONTENT_LOADED, this.create );
			this.article.fetch();
		},
		
		create: function() {
			$("body").append(this.article.content);			
		}
	});
	
	View.extend({

	});
			
	// expose to namespace
	pulp.View = pulp.View || View;		
		   
})( window.pulp = window.pulp || {}, jQuery );