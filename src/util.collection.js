/**
 * pulp.util.collection
 *
 * basic implementation for a generic collection of data
 * used for storing articles in pulp.model
 * 
 */

(function( pulp, $ ) {
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
	
		}
	}	

})( window.pulp = window.pulp || {}, jQuery );