/*global iScroll */ // tell jslint/jshint to treat iScroll as a global

/**
 * pulp.util.scroll
 *
 * wraps & extends iscroll
 *
 */

pulp.namespace("util");

pulp.util.Scroll = (function( pulp, $ ) {
  "use strict";

  // extending the iScroll lib
  iScroll.prototype.center = function(){
    if (this.pagesX) {
      this._pos( this.pagesX[1], 0 );
      this.currPageX = 1;
    }
  };

  return iScroll;

}( pulp, jQuery ));