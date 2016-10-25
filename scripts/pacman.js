"use strict";

/**
 * All pacman things. This file depends on mazegen-test.js
 */
var pacman = {
  
  Mob: function() {
    this.pos = new Point(0,0);
    this.dir = Direction.LEFT;
  },
  
  ai: {
    listDirs: function(map, ghost) {
      var x = ghost.pos.x;
      var y = ghost.pos.y;
      var dirs = [];
      if (map[x-1][y] != mazegen.State.SOLID)
        dirs.push(Direction.LEFT);
      if (map[x+1][y] != mazegen.State.SOLID)
        dirs.push(Direction.RIGHT);
      if (map[x][y-1] != mazegen.State.SOLID)
        dirs.push(Direction.UP);
      if (map[x][y+1] != mazegen.State.SOLID)
        dirs.push(Direction.DOWN);
      
      // remove back direction if not trapped
      if (dirs.length > 1) {
        var backIndex = dirs.indexOf(Direction.flip(ghost.dir));
        if (backIndex != -1)
          dirs.splice(backIndex, 1);
      }
      return dirs;
    }
  },
  
	mirror: function(map, overlap) {
    map.splice(-overlap, overlap);
    var oldwidth = map.length;
    var newwidth = oldwidth*2;
    for (var i = oldwidth; i < newwidth; i++) {
      var newcol = map[newwidth-i-1].slice();
      map.push(newcol);
    }
  },
  
  removeDeadEnds: function(map) {
    function isSolid(x, y) {
      if (x < 0 || y < 0 || x >= map.length || y >= map[x].length)
        return true;
      return map[x][y] == mazegen.State.SOLID;
    }
    
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (isSolid(i, j))
          continue;
        
        // find directions the path continues in
        var dirs = 0;
        if (!isSolid(i-1, j))
          dirs++;
        if (!isSolid(i+1, j))
          dirs++;
        if (!isSolid(i, j-1))
          dirs++;
        if (!isSolid(i, j+1))
          dirs++;
        
        // return if not dead end
        if (dirs != 1)
          continue;
        
        dirs = [];
        if (isSolid(i-1, j) && !isSolid(i-2, j))
          dirs.push(Direction.LEFT);
        if (isSolid(i+1, j) && !isSolid(i+2, j))
          dirs.push(Direction.RIGHT);
        if (isSolid(i, j-1) && !isSolid(i, j-2))
          dirs.push(Direction.UP);
        if (isSolid(i, j+1) && !isSolid(i, j+2))
          dirs.push(Direction.DOWN);
        
        var dir = dirs[Math.floor(Math.random()*dirs.length)];
        switch (dir) {
          case Direction.LEFT:
            map[i-1][j] = mazegen.State.PATH; break;
          case Direction.RIGHT:
            map[i+1][j] = mazegen.State.PATH; break;
          case Direction.UP:
            map[i][j-1] = mazegen.State.PATH; break;
          case Direction.DOWN:
            map[i][j+1] = mazegen.State.PATH; break;
        }
      }
    }
  },
  
  draw: function(map) {
	  /**
     * Converts the state of a tile into a character
     */
	  function translate(value) {
	    if (value == mazegen.State.PATH)
	      return ' ';
	    return '#';
	  }
	  
    grid().clear().color('#aaa').back('#111').char('');    
	  var stringArray = [];
	  for (var i = 0; i < map.length; i++) {
	    for (var j = 0; j < map[i].length; j++) {
	      var ch = translate(map[i][j]);
	      var str = stringArray[j];
	      if (str == undefined) {
	        str = '';
	      }
	      str += ch;
	      stringArray[j] = str;
	    }
	  }
	  
	  for (var i in stringArray) {
	    var line = stringArray[i];
	    row(i).centerText(line);
	  }
  },
  
  updateMob: function(mob) {
    mob.pos.step(mob.dir);
  },
  
  generate: function(width, height) {
    var startWidth = Math.floor(width/2+3);
    var map = mazegen.generate(startWidth, height, new Point(1, 1), new Point(1, height-2));
    pacman.removeDeadEnds(map);
    pacman.mirror(map, 3);
    pacman.draw(map);
    return map;
  }
};

$(function() {
  pacman.generate(WIDTH, HEIGHT);
});
