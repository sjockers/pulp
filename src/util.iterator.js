!function( pulp, $, undefined ) {

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose public functions:
	pulp.util.Iterator = function() {
		
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

			get: function (property, key) {
				var i=data.length;
				while (i > 0) {
					i--;
					if (data[i][property] == key) {
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
				index++;
				if (!this.hasNext()) {
					return null;
				}
				return data[index];					
			},

			previous: function () {
				index--;
				if (!this.hasPrevious()) {
					return null;
				}						 
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
				return index < data.length;
			},

			hasPrevious: function () {
				return index >= 0;
			}
	
		}
	}	

}( window.pulp = window.pulp || {}, jQuery );