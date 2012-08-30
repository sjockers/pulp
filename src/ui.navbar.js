/**
 * pulp.ui.navbar
 *
 * simple ui component for navigating through the publication using button
 * 
 */

(function( pulp, $ ) {
  "use strict";

  var navbar = new pulp.util.Module(); 
  navbar.extend(pulp.util.renderable);

  function nextClicked(event){
    pulp.ui.carousel.forward();
  }
  
  function prevClicked(event){
    pulp.ui.carousel.backward();
  }
  
  navbar.extend({
    init: function() {
      navbar.create("navbar_tmp");
      navbar.render("body");
      
      $(".pulp-prev").click(prevClicked);
      $(".pulp-next").click(nextClicked);   
    }
  });

  // UI namespace declaration
  pulp.ui = pulp.ui || {};

  // expose to namespace
  pulp.ui.navbar = pulp.ui.navbar || navbar;    

}( window.pulp = window.pulp || {}, jQuery ));