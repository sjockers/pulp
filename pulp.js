/*! Pulp Toolkit - v0.1.0 - 2012-09-18
* https://github.com/sjockers/pulp
* Copyright (c) 2012 Simon Jockers; Licensed MIT */

/**
 * pulp.app
 *
 * This module is the entry point to the application.
 *
 */

(function( pulp, $) {
  "use strict";
  
  pulp.app = (function(){
    var app = new pulp.util.Module();
    app.extend(pulp.util.observable);
    var articles = pulp.model.articles;

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
        pulp.model.observe(pulp.events.TOC_LOADED, app.setup);
        pulp.model.getToc(toc);
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

/**
 * pulp.core.Article
 *
 * Represents an article item
 *
 */

pulp.namespace("core");

pulp.core.Article = (function( pulp, $ ) {
  "use strict";

  var Article = new pulp.util.Module();

  // make instances observable:
  Article.include(pulp.util.observable);

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
        article.notify(pulp.events.CONTENT_LOADED);
        if (typeof successCallback === "function") {
          successCallback();
        }
      }

      if (article.content) {
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
/**
 * pulp.events
 *
 * event constants for use with observable component
 * 
 */

(function( pulp, $ ) {
	"use strict";

	pulp.events = {
		TOC_LOADED : "TOC loaded!",
		CONTENT_LOADED : "Content loaded!"
	};

}( pulp, jQuery ));


/**
 * pulp.model
 *
 * data model for the publication. Home of words.
 * 
 */

pulp.namespace("model");

pulp.model = (function( pulp, $ ) {
  "use strict";
    
  var model = new pulp.util.Module();
  model.extend(pulp.util.observable); 
  model.articles = new pulp.util.Collection();
  
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
      model.notify(pulp.events.TOC_LOADED);
    }
    
    function failure (error) {
      pulp.log("Table of contents could not be loaded!", error);
    }
    
    fetchTocFromServer( pathToToc, success, failure );
  };
  
  return model;
     
}( pulp, jQuery ));
/**
 * pulp.namepaces
 *
 * Generic namespace implementation
 *
 */

(function( pulp, $) {
  "use strict";

  pulp.namespace = function(namespaceString) {
    var parts = namespaceString.split("."),
      parent = pulp,
      currentPart = "";    
    
    for(var i = 0, length = parts.length; i < length; i++) {
      currentPart = parts[i];
      parent[currentPart] = parent[currentPart] || {};
      parent = parent[currentPart];
    }

    return parent;
  };

}( window.pulp = window.pulp || {}, jQuery ));
/**
 * pulp.core.ArticleView
 * pulp.core.ArticleViewFactory
 *
 * visual representation of an article, used for rendering articles in the ui.carousel component
 * 
 */


pulp.namespace("ArticleViewFactory");

pulp.core.ArticleViewFactory = (function( pulp, $ ) {

  var ArticleView = new pulp.util.Module(); 
  ArticleView.include(pulp.util.observable);
  ArticleView.include(pulp.util.renderable);

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
      
      view.article.observe( pulp.events.CONTENT_LOADED, function(){
        view.create("view_tmp", view.article);
        view.render(target);
        view.article.unObserve( pulp.events.CONTENT_LOADED, this);
      });
      
      view.article.fetch();
    },

    /**
     * Inserts the view into the DOM (overwrites pulp.util.renderable) 
     * 
     * @method render
     * @param {HTMLElement} target for rendering
     */   
    render: function(target) {
      this.target = target || this.target;    
      $(this.target).html(this.$element);         
    },
    
    replaceWith: function(replacement) {
      pulp.log(replacement.$element);
      this.$element.replaceWith(replacement.$element.html());
    }
    
  });
      
  return {
    create : function(article, target){
      return new ArticleView(article, target);
    }
  };    
       
}( pulp, jQuery ));
/**
 * pulp.ui.carousel
 *
 * ui component for displaying articles
 * also handles touch-screen flipping through articles
 * 
 */

pulp.namespace("ui.carousel");

pulp.ui.carousel = (function( pulp, $ ) {

  var carousel = new pulp.util.Module();  
  carousel.extend( pulp.util.renderable );
  carousel.extend( pulp.util.observable );
  
  var articles = pulp.model.articles;
  
  var leftStepSkipped = false;
  var rightStepSkipped = false;

  function makeLinksLocal() {
    var a = document.getElementsByTagName("a");
    var i;
    function openExternal() {
      window.location=this.getAttribute("href");
      return false; 
    }
    for(i=0;i<a.length;i++) {
      if(!a[i].onclick && a[i].getAttribute("target") !== "_blank") {
        a[i].onclick = openExternal; 
      }
    }
  }
  
  function resizeContainers(){    
    $("#slider").height($(document).height());
    carousel.scroller.refresh();
    carousel.slider.refresh();
    carousel.slider.center();
  }

  function findViews(slider) {
    return {
      previous: $(slider).find(".previous"),  
      current: $(slider).find(".current"),
      next: $(slider).find(".next")   
    };
  }
  
  function stepForward() {

    if(rightStepSkipped === false) {                              
      pulp.app.nextArticle();
      var views = findViews(carousel.slider.scroller);
    
      if(articles.hasNext()){

        pulp.core.ArticleViewFactory.create(articles.next(), views.previous);
      
        views.next.removeClass("next").addClass("current");               
        views.current.removeClass("current").addClass("previous");
        views.previous.removeClass("previous").addClass("next");
                          
        carousel.slider.center();
      
        carousel.scroller.destroy();
        carousel.scroller = new pulp.util.Scroll(views.next.get(0));
      
        leftStepSkipped = false;
      
      } 
      else {
        if (rightStepSkipped === false) {
          pulp.app.previousArticle();
          pulp.core.ArticleViewFactory.create(articles.previous(), views.previous);

          carousel.scroller = new pulp.util.Scroll(views.next.get(0));
          rightStepSkipped = true;
        }
      }
    }
  }
  
  function stepBackward() {

    if(leftStepSkipped === false){

      pulp.app.previousArticle();       
      var views = findViews(carousel.slider.scroller);
    
      if(articles.hasPrevious()){

        pulp.core.ArticleViewFactory.create(articles.previous(), views.next);
      
        views.previous.removeClass("previous").addClass("current");
        views.current.removeClass("current").addClass("next");
        views.next.removeClass("next").addClass("previous");                
                          
        carousel.slider.center();
      
        carousel.scroller.destroy();        
        carousel.scroller = new pulp.util.Scroll(views.previous.get(0));

        rightStepSkipped = false;
    
      }
      else {
        if (leftStepSkipped === false) {
          pulp.app.nextArticle();
          pulp.core.ArticleViewFactory.create(articles.next(), views.next); 
          carousel.scroller = new pulp.util.Scroll(views.previous.get(0));        
          leftStepSkipped = true;         
        }
      }
    }
  } 

  function updateViews(e){    
    switch (carousel.slider.currPageX) {
      case 0 :
        stepBackward();
        break;
      case 2 :
        stepForward();
        break;
    }
  } 
  
  function initializeScaffold(){
    
    carousel.create("carousel_tmpl");
    carousel.target = document.body;
    carousel.hideContent();
    
    carousel.render();    

    carousel.slider = new pulp.util.Scroll("pulp-carousel", {
      snap: true,
      momentum: false,
      hScrollbar: false,
      vScroll: false,
      lockDirection: true, 
      onScrollEnd: updateViews
    });
      
    $(window).bind("orientationchange resize", function (){
      resizeContainers();
    });
    
    makeLinksLocal();   
  }
      
  carousel.extend({

    scroller: null,
    slider: null,

    init: function() {
    },
    
    display: function(path) { 

      if(!this.element) {
        initializeScaffold();     
      }
      
      articles.find("url", path);
      var views = findViews(this.slider.scroller);
      
      pulp.core.ArticleViewFactory.create(articles.current(), views.current);
      carousel.scroller = new pulp.util.Scroll(views.current.get(0)); 
      
      if(articles.hasPrevious()){
        pulp.core.ArticleViewFactory.create(articles.previous(), views.previous);          
      }
            
      if(articles.hasNext()){
        pulp.core.ArticleViewFactory.create(articles.next(), views.next);
      }
      
      resizeContainers();       
    },
    
    forward: function(){
      this.slider.scrollToPage('next', 0);
    },
    
    backward: function(){
      this.slider.scrollToPage('prev', 0);
    }
    
  });
  
  return carousel;

}( pulp, jQuery ));
/**
 * pulp.ui.navbar
 *
 * simple ui component for navigating through the publication using button
 * 
 */

pulp.namespace("ui.navbar");

pulp.ui.navbar = (function( pulp, $ ) {
  "use strict";

  var navbar = new pulp.util.Module(); 
  navbar.extend(pulp.util.renderable);

  function nextClicked(event){
    pulp.ui.carousel.forward();
  }
  
  function prevClicked(event){
    pulp.ui.carousel.backward();
  }
  
  navbar.extend({
    init: function() {
      navbar.create("navbar_tmp");
      navbar.render("body");
      
      $(".pulp-prev").click(prevClicked);
      $(".pulp-next").click(nextClicked);   
    }
  });
  
  return navbar;  

}( pulp, jQuery ));
/**
 * pulp.util.Collection
 *
 * basic implementation for a generic collection of data
 * used for storing articles in pulp.model
 * 
 */

pulp.namespace("util.Collection");

pulp.util.Collection = (function( pulp, $ ) {
  "use strict";
  
  var Collection = function() {
    
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
          if (data[i][property] === key) {
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

      backward: function () {
        if (!this.hasPrevious()) {
          return null;
        }            
        index-=1;
        return data[index];
      },

      forward: function () {
        if (!this.hasNext()) {
          return null;
        }
        index+=1;
        return data[index];
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
  
    };
  };  

  return Collection;

}( pulp, jQuery ));
/*jslint devel: true */ // ... allow for the console to be used

/**
 * pulp.log
 *
 * simple wrapper around console.log
 * 
 */

pulp.namespace("log");

pulp.log = (function(pulp) {
  "use strict";
  
  var log = function(){
    log.history = log.history || [];
    log.history.push(arguments);
    
    if (window.console) {
      if (arguments.length === 1) {
        console.debug(arguments.shift);
      }
      else {
        console.log( Array.prototype.slice.call(arguments) );
      }
    }
    
  };
  
  return log;

}(pulp));
/**
 * pulp.util.Module
 *
 * class-like implementation of the module pattern
 * 
 */

pulp.namespace("util.Module");

pulp.util.Module = (function( pulp, $ ) {
  "use strict";

  var closure = function(parent){
    var Module = function(){
      this.init.apply(this, arguments);
    };

    Module.extend = function(obj){
      var i, extended = obj.extended;
      for(i in obj){
        if (obj.hasOwnProperty(i)) {
          Module[i] = obj[i];
        }
      }
      if (extended) {
        extended(Module);
      }
    };

    Module.include = function(obj){
      var i, included = obj.included;
      for(i in obj){
        if (obj.hasOwnProperty(i)) {
          Module.prototype[i] = obj[i];
        }
      }
      if (included) {
        included(Module);
      }
    };

    Module.proxy = function(func){
      var thisObject = this;
      return function(){ 
        return func.apply(thisObject, arguments); 
      };
    };
    
    Module.clone = function(obj){
      if (typeof obj === "function") {
        return obj;
      } 
      if (typeof obj !== "object") {
        return obj;
      }
      if (jQuery.isArray(obj)) {
        return jQuery.extend([], obj);
      }
      return jQuery.extend({}, obj);
    };
    
    Module.prototype.init = function(){};

    if (parent){
      for(var i in parent) {
        Module[i] = Module.clone(parent[i]);
      }
      for(var j in parent.prototype) {
        Module.prototype[j] = Module.clone(parent.prototype[j]);
      }
      Module._super = parent;
      Module.prototype._super = parent.prototype;
    }
  
    Module.prototype.proxy = Module.proxy;

    Module.prototype._class = Module;

    return Module;
  };
  
  return closure;

}( pulp, jQuery ));
/**
 * pulp.util.observable
 *
 * basic pub/sub implementation
 * 
 */

pulp.namespace("util.observable");

pulp.util.observable = (function( pulp, $ ) {

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
    
    if (typeof observer !== "function") {
      throw new TypeError("not a function"); 
    }
    
    if (typeof event !== "string") {
      throw new TypeError("not a valid event identifier"); 
    }
    
    _observers(this, event).push(observer);
  } 
  
  function unObserve(event, observer) {
    
    if (typeof observer !== "function") {
      throw new TypeError("not a function"); 
    }
    
    if (typeof event !== "string") {
      throw new TypeError("not a valid event identifier"); 
    }
    
    var observers  = _observers(this, event);
    
    for(var i=0, l=observers.length; i<l; i++) {
      if(observers[i] === observer){
        observers.splice(i,1);
      }
    }
  }
  
  function hasObserver(event, observer) {
    var observers  = _observers(this, event);
    return ($.inArray(observer, observers) >= 0);
  }
  
  function notify(event) {
    if (typeof event !== "string") {
      throw new TypeError("not a valid event identifier"); 
    }
    
    var observers  = _observers(this, event);
    var args = Array.prototype.slice.call(arguments, 1);

    $.each(observers, function() {      
      this.apply(this, args);
    });
  }

  // expose public functions:
  return {
    observe: observe, 
    unObserve: unObserve,     
    hasObserver: hasObserver,
    notify: notify
  };
     
}( window.pulp = window.pulp || {}, jQuery ));
/**
 * pulp.util.renderable
 *
 * implementing this mixin enables modules to render content to the DOM
 *
 */

pulp.namespace("util");

pulp.util.renderable = (function( pulp, $ ) {
  "use strict";
  
  var renderable = {
    
    element: null,
    
    $element: null,
    
    target: null,
    
    data: {},
        
    template: null,
        
    // create the element
    create: function(template, data){
      this.template = template || this.template;
      this.data = data || this.data;
      this.element = pulp.util.templating(this.template, this.data);
      this.$element = $(this.element);
    },
    
    // insert it into the DOM
    render: function(target){
      this.target = target || this.target;
      $(this.target).append(this.$element);
    },

    // wrap original content in container to hide it
    hideContent: function(target){
      this.target = target || this.target;
      $(this.target).wrapInner(pulp.util.templating("original_tmp",{}));
    }
  };
  
  // JavaScript Micro-Templating
  // Courtesy of John Resig - MIT Licensed
    
  var templatingCache = {};
  pulp.util.templating = function(str, data){
  /*jslint regexp: true, evil: true */ // ... because the Function constructor is evil!
  /*jshint regexp: false, evil: true */
    
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      templatingCache[str] = templatingCache[str] ||
        pulp.util.templating(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
  
  return renderable;

}( pulp, jQuery ));
/*global iScroll */ // tell jslint/jshint to treat iScroll as a global

/**
 * pulp.util.scroll
 *
 * wraps & extends iscroll
 *
 */

pulp.namespace("util");

pulp.util.Scroll = (function( pulp, $ ) {
  "use strict";

  // extending the iScroll lib
  iScroll.prototype.center = function(){
    if (this.pagesX) {
      this._pos( this.pagesX[1], 0 );
      this.currPageX = 1;
    }
  };

  return iScroll;

}( pulp, jQuery ));