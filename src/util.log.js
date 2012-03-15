(function(pulp) {
	
	pulp.log = function(){
		pulp.log.history = pulp.log.history || [];
		pulp.log.history.push(arguments);
		
		if (window.console) {
			if (arguments.length == 1) {
				console.debug(arguments[0]);
			}
			else {
				console.log( Array.prototype.slice.call(arguments) );
			}
		}
		
	};

})( window.pulp = window.pulp || {});