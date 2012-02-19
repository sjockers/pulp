"use strict"

!function( pulp, $ ) {

	var controller = new pulp.util.Module;
	controller.extend(pulp.util.observable);
	
	// expose to namespace
	pulp.controller = pulp.model || controller;

}( window.pulp = window.pulp || {}, jQuery );	