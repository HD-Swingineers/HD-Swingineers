"use strict";

/**
 * All pacman things. This file depends on mazegen-test.js
 */
var pacman = {
  
  margin: 16,
  
  Mob: function(char = '@', color = 'pink') {
    this.pos = new Point(0,0);
    this.dir = Direction.LEFT;
    this.char = char;
    this.color = color;
    
    this.update = function(map) {
      this.pos.step(map);
    }
  },
  
  Game: function() {
    this.score = 0;
    this.player = new pacman.Mob('o', 'yellow');
    this.ghosts = [new pacman.Mob('M', 'blue')];
  },
  
  ai: {
    /**
     * List the valid directions that a ghost could move in
     */
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
    },
    
    /**
     * Updates what the ghost should do on the next move
     */
    think: function(map, ghost) {
      var dirs = listDirs(map, ghost);
      ghost.dir = dirs[Math.floor(Math.random()*dirs.length)];
    }
  },
  
  /**
   * Mirrors a map. Overlap is the amount of columns
   * along the right of the map to remove
   */
	mirror: function(map, overlap) {
    map.splice(-overlap, overlap);
    var oldwidth = map.length;
    var newwidth = oldwidth*2;
    for (var i = oldwidth; i < newwidth; i++) {
      var newcol = map[newwidth-i-1].slice();
      map.push(newcol);
    }
  },
  
  /**
   * Removes any deadends from the map
   */
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
  
  drawMap: function(map) {
	  /**
     * Converts the state of a tile into a character
     */
	  function translate(value) {
	    if (value == mazegen.State.PATH)
	      return ' ';
	    return '#';
	  }
	  
    grid().clear().color('#3af').back('#111').char('');    
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
	    row(i).text(line);
	  }
  },
  
  drawScore: function(game) {
    var region = col(WIDTH-pacman.margin, WIDTH);
    var line = 3;
    row(line++).intersect(region).centerText('PACMAN').color('yellow');
    row(line++).intersect(region).centerText('----------').color('white');
    line++;
    line++;
    row(line++).intersect(region).text('  Score:').color('white');
    line++;
    row(line++).intersect(region).centerText('0000').color('yellow');
    line++;
    line++;
    row(line++).intersect(region).text('  Lives:').color('white');
    line++;
    row(line++).intersect(region).centerText('c c c').color('yellow');
    line++;
    line++;
    row(line++).intersect(region).text('  Highscore:').color('white');
    line++;
    row(line++).intersect(region).centerText('  1924:').color('yellow');
    for (var i = WIDTH-pacman.margin; i < WIDTH; i++) {
      for (var j = 0; j < HEIGHT; j++) {
        if (i == WIDTH-pacman.margin || i == WIDTH-1 || j == 0 || j == HEIGHT-1)
          cell(i, j).char('*').color('white');
      }
    }
  },
    
  generate: function(width, height) {
    var overlap = 3;
    var startWidth = Math.floor(width/2+overlap);
    var xCenter = Math.floor(width/2);
    var yCenter = Math.floor(height/2);
    var map = mazegen.generate(startWidth, height, new Point(1, 1), new Point(1, height-2));
    pacman.removeDeadEnds(map);
    for (var i = -3; i <= 0; i++) {
      for (var j = -2; j <= 2; j++) {
        if (i == -3 || j == -2 || j == 2) {
          map[xCenter+i][yCenter+j] = mazegen.State.SOLID;
          console.log( i + ' ' + j);
        } else {
          map[xCenter+i][yCenter+j] = mazegen.State.PATH;
          console.log( i + '-' + j);
        }
      }
    }
    pacman.mirror(map, overlap);
    return map;
  }
};

$(function() {
  var map = pacman.generate(WIDTH-pacman.margin, HEIGHT);
  pacman.drawMap(map);
  pacman.drawScore();
  
  var player = new Mob();
  
  update();
  
  function update() {
    setTimeout(update, 500); 
  }
});
