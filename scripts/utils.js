"use strict";

/**
 * A 2D point object
 */
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function(x, y) {
  this.x += x;
  this.y += y;
  return this;
}

Point.prototype.sub = function(x, y) {
  this.x -= x;
  this.y -= y;
  return this;
}

Point.prototype.toString = function() {
  return '(' + x + ',' + y + ')';
}

/**
 * A bunch of directions something can go in
 */
var Direction = {
	UP: 1,
	LEFT: 2, 
	RIGHT: 4, 
	DOWN: 8
}