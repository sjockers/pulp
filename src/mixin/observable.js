/**
 * pulp.mixin.observable
 *
 * basic pub/sub implementation
 * 
 */
 pulp.util.namespace("mixin");

 pulp.mixin.observable = (function( pulp, $ ) {

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