/*jslint devel: true */ // ... allow for the console to be used

/**
 * pulp.log
 *
 * simple wrapper around console.log
 * 
 */


(function(pulp) {
  "use strict";
  
  pulp.log = function(){
    pulp.log.history = pulp.log.history || [];
    pulp.log.history.push(arguments);
    
    if (window.console) {
      if (arguments.length === 1) {
        console.debug(arguments.shift);
      }
      else {
        console.log( Array.prototype.slice.call(arguments) );
      }
    }
    
  };

}( window.pulp = window.pulp || {}));