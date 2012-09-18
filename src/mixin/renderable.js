/**
 * pulp.mixin.renderable
 *
 * implementing this mixin enables modules to render content to the DOM
 *
 */

pulp.util.namespace("mixin");

pulp.mixin.renderable = (function( pulp, $ ) {
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