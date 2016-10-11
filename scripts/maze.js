"use strict";

/**
 * All maze things
 */
var maze = {
	
	gen: {
		/**
		 * The different states that a block can be in
		 */
		State: {
			SOLID: '#',
			EMPTY: '~',
      PATH: '-'
		},
		
		/**
		 * Gets the valid directions for the maze maker to
		 * progress to
		 */
		validDirs: function(map, p) {
			
			var solid = this.State.SOLID;
			var empty = this.State.EMPTY;
      var path = this.State.PATH;
      
      function get(map, x, y) {
        if (x < 0 || y < 0 || x >= map.length || y >= map[x].length) {
          return empty;
        } else {
          var value = map[x][y];
          if (value == path)
            value = empty;
          return value;
        }
      }
      
			function checkDir(map, p, xStep, yStep) {
				// the normal to xStep/yStep
        var nxStep = (xStep == 0 ? 1 : 0);
        var nyStep = (yStep == 0 ? 1 : 0);
        
        var x = p.x + xStep;
        var y = p.y + yStep;
        
        if (get(map, x, y) == empty)
          return false;
        if (get(map, x+nxStep, y+nyStep) == empty)
          return false;
        if (get(map, x-nxStep, y-nyStep) == empty)
          return false;    
        if (get(map, x+xStep, y+yStep) == empty)
          return false;
        if (get(map, x+nxStep+xStep, y+yStep+nyStep) == empty)
          return false;
        if (get(map, x-nxStep+xStep, y-nyStep+yStep) == empty)
          return false;
				return true;
			}
			
			var valid = [];
			
			if (checkDir(map, p, -1, 0))
				valid.push(Direction.LEFT);
      if (checkDir(map, p, 1, 0))
				valid.push(Direction.RIGHT);
      if (checkDir(map, p, 0, -1))
				valid.push(Direction.UP);
      if (checkDir(map, p, 0, 1))
				valid.push(Direction.DOWN);
			
			return valid;
		},
    
    // takes a single step in one direction
    advance: function(map, p, direction) {
      switch(direction) {
        case Direction.LEFT:
          p.add(-1, 0); break;
        case Direction.RIGHT:
          p.add(1, 0); break;
        case Direction.UP:
          p.add(0, -1); break;
        case Direction.DOWN:
          p.add(0, 1); break;
      }
      map[p.x][p.y] = this.State.EMPTY;
    },
    
    // generates a blank grid with walls around
    newMap: function(width, height) {
      var map = [];
      for (var i = 0; i < width; i++) {
        map[i] = [];
        for (var j = 0; j < height; j++) {
          map[i][j] = this.State.SOLID;
        }
      }
      
      return map;
    },
    
    forgePath: function(map, p) {
      var dirs = this.validDirs(map, p);
      while (dirs.length != 0) {
        var dir = dirs[Math.floor(Math.random()*dirs.length)];
        this.advance(map, p, dir);
        dirs = this.validDirs(map, p);
      }
      return p;
    },
    
    backtrace: function(map, p) {
    
      // takes a single step backwords
      function stepBack(map, p) {
        // check if we can branch
        var dirs = maze.gen.validDirs(map, p);
        if (dirs.length > 0)
          return true;
        
        // flag this tile to fully explored
        map[p.x][p.y] = maze.gen.State.PATH;
        
        // look for the old path
        var oldPaths = 0;
        var xStep = 0;
        var yStep = 0;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            if (i != 0 && j != 0) {
              continue;
            }
            if (map[p.x+i][p.y+j] == maze.gen.State.EMPTY) {
              oldPaths++;
              xStep = i;
              yStep = j;
            }
          }
        }
        
        if (oldPaths == 1) {
          p.add(xStep, yStep);
          return false;
        } else {
          // we've reached the very end
          return true;
        }
      }
      
      while (!stepBack(map, p)) {};
      
      // Return true when we reach the end 
      return map[p.x][p.y] == maze.gen.State.PATH;
    },
    
    generate: function(width, height, start, end) {
      var map = this.newMap(width, height);
      var pos = new Point(start.x, start.y);
      map[pos.x][pos.y] = this.State.EMPTY;
      
      do {
        this.forgePath(map, pos);
        var fin = this.backtrace(map, pos);
      } while(!fin);
      
      map[end.x][end.y] = maze.gen.State.PATH;
      return map;
    }
	},
	draw: function(map) {
	  grid().clear().color('#aaa').back('#111').char('');
	  function get(map, x, y) {
	    if (x < 0 || y < 0 || x >= map.length || y >= map[x].length)
	      return maze.gen.State.EMPTY;
	    else
	      return map[x][y];
	  }
	  
	  function translate(map, x, y) {
	    var value = get(map, x, y);
	    if (value == maze.gen.State.PATH)
	      return ' ';
	    return '#';
	  }
	  
	  grid().clear();
	  
	  var stringArray = [];
	  for (var i = 0; i < map.length; i++) {
	    for (var j = 0; j < map[i].length; j++) {
	      var ch = translate(map, i, j);
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
	}
}


$(function() {
	var start = new Point(Math.floor(WIDTH/2), 1);
	var end = new Point(start.x, HEIGHT-2);
	
	var map;
	var player;
	generate();
	
	function generate() {
	  map = maze.gen.generate(WIDTH, HEIGHT, end, start);
	  
	  player = new Point(start.x, start.y);
	  maze.draw(map, player, end);
	  movePlayer(0, 0);
	  cell(end.x, end.y).char('F').color('red');
	}
	
	function movePlayer(xStep, yStep) {
	  var xNew = player.x + xStep;
	  var yNew = player.y + yStep;
	  if (end.x == xNew && end.y == yNew) {
	    generate();
	    return;
	  }
	  if (map[xNew][yNew] == maze.gen.State.SOLID) {
	    return;
	  } else {
	    cell(player.x, player.y).char(' ');
	    player.set(xNew, yNew);
	    cell(player.x, player.y).char('@').color('red');
	  }
	}
	
	onButtonLeft(function() {
	  movePlayer(-1, 0);
	});
	onButtonRight(function() {
	  movePlayer(1, 0);
	});
	onButtonDown(function() {
	  movePlayer(0, 1);
	});
	onButtonUp(function() {
	  movePlayer(0, -1);
	});
});
