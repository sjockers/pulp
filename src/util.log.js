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