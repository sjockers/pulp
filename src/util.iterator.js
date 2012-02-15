!function( pulp, $, undefined ) {

	var index = 0;
	var data = [];

	// namespace declaration
	pulp.util = pulp.util || {};
	
	// expose public functions:
	pulp.util.iterator = {
	
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

		hasNext: function () {
			return index < data.length;
		},

		hasPrevious: function () {
			return index >= 0;
		},

		rewind: function () {
			index = 0;
		},

		current: function () {
			if (data.length === 0) {
				return null;
			}
			return data[index];
		},
	
		clear: function () {
			index = 0;
			data = [];
		}
	}	

}( window.pulp = window.pulp || {}, jQuery );