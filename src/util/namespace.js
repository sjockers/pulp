/**
 * pulp.util.namespace
 *
 * Generic namespace implementation
 *
 */

(function( pulp, $) {
  "use strict";

  var namespace = function(namespaceString) {
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
  
  namespace("util");
  pulp.util.namespace = namespace;

}( window.pulp = window.pulp || {}, jQuery ));