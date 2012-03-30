(function( pulp, $ ) {

	var navbar = new pulp.util.Module; 
	navbar.extend(pulp.util.renderable);

	function nextClicked(event){
		pulp.app.nextArticle();
	}
	
	function prevClicked(event){
		pulp.app.previousArticle();
	}
	
	navbar.extend({
		init: function() {
			navbar.create("navbar_tmp");
			navbar.render("body");
			
			$("#pulp-prev").click(prevClicked);
			$("#pulp-next").click(nextClicked);		
		}
	});

	// UI namespace declaration
	pulp.ui = pulp.ui || {};

	// expose to namespace
	pulp.ui.navbar = pulp.ui.navbar || navbar;		

})( window.pulp = window.pulp || {}, jQuery );