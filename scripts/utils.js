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

Point.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return '(' + x + ',' + y + ')';
}

Point.prototype.step = function(dir) {
  if (dir & Direction.LEFT)
    this.add(-1, 0);
  if (dir & Direction.RIGHT)
    this.add(1, 0);
  if (dir & Direction.UP)
    this.add(0, -1);
  if (dir & Direction.DOWN)
    this.add(0, 1);
  return this;
}

/**
 * A bunch of directions something can go in
 */
var Direction = {
	UP: 1,
	LEFT: 2, 
	RIGHT: 4, 
	DOWN: 8,
  
  /**
   * Revereses the direction
   */
  flip: function(dir) {
    if (dir & Direction.LEFT) {
      dir &= ~Direction.LEFT;
      dir ^= Direction.RIGHT;
    } else if (dir & Direction.RIGHT) {
      dir &= ~Direction.RIGHT;
      dir ^= Direction.LEFT;
    }
    if (dir & Direction.UP) {
      dir &= ~Direction.UP;
      dir |= Direction.DOWN;
    } else if (dir & Direction.DOWN) {
      dir &= ~Direction.DOWN;
      dir |= Direction.UP;
    }
    return dir;
  }
}
