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