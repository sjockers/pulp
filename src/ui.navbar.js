/**
 * pulp.ui.navbar
 *
 * simple ui component for navigating through the publication using button
 * 
 */

pulp.namespace("ui.navbar");

pulp.ui.navbar = (function( pulp, $ ) {
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
  
  return navbar;  

}( pulp, jQuery ));