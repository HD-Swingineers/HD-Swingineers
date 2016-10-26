"use strict";

/**
 * All pacman things. This file depends on mazegen-test.js
 */
var pacman = {
  
  margin: 16,
  
  State: {
    DOT: '.',
    WALL: '#',
    EMPTY: ' '
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
    return map;
  },
  
  /**
   * Draws the map to the screen.
   * If `full` is true, then a full (time consuming) 
   * refresh of the screen will be done. This is only
   * needed the first time the map is drawn.
   */
  drawMap: function(map, full) {
    // nothing should change in the map
    // mobs are responsible for cleaning up after themselves
    if (!full)
      return;
      
    grid().clear().color('#3af').back('#111').char('');    
	  // top x,y corner
	  var x = 0;
	  var y = 0;
	  
	  for (var i = 0; i < map.length; i++) {
	    for (var j = 0; j < map[i].length; j++) {
	      pacman.drawCell(map, i, j);
	    }
	  }
  },
  
  /**
   * Draws a single cell
   */
  drawCell: function(map, x, y) {
    var chr = '';
    var clr = '';
    switch(map[x][y]) {
      case pacman.State.WALL:
        chr = '#';
        clr = '#3af';
        break;
      case pacman.State.EMPTY:
        chr = '';
        clr = '';
        break;
      case pacman.State.DOT:
        chr = '.';
        clr = 'yellow';
        break;
    }
    cell(x, y).char(chr).color(clr);
  },
  
  /**
   * Draws the score panel on the side. Set `full`
   * to true for the inital draw only  
   */
  drawScore: function(game, full) {
    var score = ('00000' + game.score).substr(-5,5);
      var lives = ''
    for (var i = 0; i < game.lives; i++) {
      lives += ' ᗧ'
    }
    lives = lives.trim();
    
    // draw updating data
    var region = col(WIDTH-pacman.margin, WIDTH);
    var line = 4;
    row(line+6).intersect(region).centerText(score).color('yellow');
    row(line+11).intersect(region).clear().centerText(lives).color('yellow');
    
    if (!full)
      return;
    
    row(line++).intersect(region).centerText('PACMAN').color('yellow');
    row(line++).intersect(region).centerText('----------').color('white');
    line++;
    line++;
    row(line++).intersect(region).text('  Score:').color('white');
    line++;
    line++; // write score
    line++;
    line++;
    row(line++).intersect(region).text('  Lives:').color('white');
    line++;
    line++; // write lives
    line++;
    line++;
    row(line++).intersect(region).text('  Highscore:').color('white');
    line++;
    row(line++).intersect(region).centerText('10924').color('yellow');
    for (var i = WIDTH-pacman.margin; i < WIDTH; i++) {
      for (var j = 0; j < HEIGHT; j++) {
        if (i == WIDTH-pacman.margin || i == WIDTH-1 || j == 0 || j == HEIGHT-1)
          cell(i, j).char('*').color('white');
      }
    }
  },
    
  /**
   * Takes a map the maze generator made and turns it into
   * a pacman map
   */
  convert: function(map) {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        var value;
        switch(map[i][j]) {
          case mazegen.State.EMPTY:
          case mazegen.State.PATH:
            value = pacman.State.DOT;
            break;
          case mazegen.State.SOLID:
            value = pacman.State.WALL;
            break;
        }
        map[i][j] = value;
      }
    }
    return map;
  },    
  
  /**
   * Generates a map of a given size
   */
  generate: function(width, height) {
    var overlap = 3;
    var startWidth = Math.floor(width/2+overlap);
    var xCenter = Math.floor(width/2);
    var yCenter = Math.floor(height/2);
    var map = mazegen.generate(startWidth, height, new Point(1, 1), new Point(1, height-2));
    pacman.removeDeadEnds(map);
    pacman.convert(map);
    
    for (var i = -4; i <= 0; i++) {
      for (var j = -3; j <= 3; j++) {
        var value;
        if (i == -4 || j == -3 || j == 3)
          value = pacman.State.DOT;
        else if (i == -3 || j == -2 || j == 2) {
          value = pacman.State.WALL;
        } else {
          value = pacman.State.EMPTY;
        }
        map[xCenter+i][yCenter+j] = value;
      }
    }
    map[xCenter-1][yCenter-2] = pacman.State.Empty;
    pacman.mirror(map, overlap);
    return map;
  }
};

/**
 * Thing that holds all the entire state of the game
 */
pacman.GameState = function(width, height) {
  this.map = pacman.generate(width, height);
  this.player = new pacman.Player();
  this.lives = 3;
  this.score = 0;
  
  this.ghosts = [
    new pacman.Ghost('blue'),
    new pacman.Ghost('pink'),
    new pacman.Ghost('red'),
    new pacman.Ghost('orange')
  ];
  
  this.reset();
}

/**
 * Draws the entire game to the world
 */
pacman.GameState.prototype.draw = function(full) {
  pacman.drawMap(this.map, full);
  pacman.drawScore(this, full);
  
  this.player.draw();
  for (var i = 0; i < this.ghosts.length; i++) {
    this.ghosts[i].draw();
  }
}

/**
 * Resets the positions of all players
 */
pacman.GameState.prototype.reset = function() {
  var xCenter = Math.floor(this.map.length/2);
  var yCenter = Math.floor(this.map[0].length/2);
  
  this.player.pos.x = xCenter;
  this.player.pos.y = yCenter+3;
  
  for (var i = 0; i < this.ghosts.length; i++) {
    var ghost = this.ghosts[i];
    ghost.pos.y = yCenter;
    ghost.pos.x = xCenter + i - 2;
  }
}
  
/**
 * Updates the game state
 */
pacman.GameState.prototype.update = function() {
  this.player.update(this.map);
  for (var i = 0; i < this.ghosts.length; i++) {
    this.ghosts[i].update(this.map);
  }
  
  // update collisions
  var playerPos = this.player.pos;
  for (var i = 0; i < this.ghosts.length; i++) {
    var ghostPos = this.ghosts[i].pos;
    if (ghostPos.x == playerPos.x && ghostPos.y == playerPos.y) {
      this.lives--;
      if (this.lives == 0)
        submitHighScore(GameID.Pacman, this.score);
      else
        this.reset();
      return;
    }
  }
  if (this.map[playerPos.x][playerPos.y] == pacman.State.DOT) {
    this.score++;
    this.map[playerPos.x][playerPos.y] = pacman.State.EMPTY;
  }
}

/**
 * Represents some moving thing in the game
 */
pacman.Mob = function(char = '@', color = 'green') {
  this.pos = new Point(1,1);
  this.dir = Direction.LEFT;
  this.char = char;
  this.color = color;
}

/**
 * moves this mob in the direction it is trying to go in
 */
pacman.Mob.prototype.update = function(map) {
  var test = this.pos.clone();
  test.step(this.dir);
  
  if (map[test.x][test.y] != pacman.State.WALL) {
    pacman.drawCell(map, this.pos.x, this.pos.y);
    this.pos.step(this.dir);
  }
}
  
/**
 * Draws this mob to the screen
 */
pacman.Mob.prototype.draw = function() {
  cell(this.pos.x, this.pos.y).char(this.char).color(this.color);
}

/**
 * Represents the player
 */
pacman.Player = function() {
  pacman.Mob.call(this, 'o', 'yellow');
  this.goin = this.dir;
  var self = this;
  var secondFrame = false;
  
  onButtonLeft(function() {
    self.goin  = Direction.LEFT;
  });
  
  onButtonRight(function() {
    self.goin = Direction.RIGHT;
  });
  
  onButtonUp(function() {
    self.goin = Direction.UP;
  });
  
  onButtonDown(function() {
    self.goin = Direction.DOWN;
  });
}

pacman.Player.prototype = Object.create(pacman.Mob.prototype);
pacman.Player.prototype.constructor = pacman.Player;

pacman.Player.prototype.update = function(map) {
  var test = this.pos.clone().step(this.goin);
  if (map[test.x][test.y] != pacman.State.WALL)
    this.dir = this.goin;
  else 
    this.goin = this.dir;
  pacman.Mob.prototype.update.call(this, map);
  
  // update sprite
  if (this.secondFrame ^= 1) {
    this.char = 'o';
  } else {
    switch(this.dir) {
      case Direction.LEFT:
        this.char = 'ᗤ'; break;
      case Direction.RIGHT:
        this.char = 'ᗧ'; break;
      case Direction.UP:
        this.char = 'ᗢ'; break;
      case Direction.DOWN:
        this.char = 'ᗣ'; break;
    }
  }
}

/**
 * Represents a Ghost
 */
pacman.Ghost = function(color) {
  pacman.Mob.call(this, 'M', color);
}

pacman.Ghost.prototype = Object.create(pacman.Mob.prototype);
pacman.Ghost.prototype.constructor = pacman.Ghost;

pacman.Ghost.prototype.update = function(map) {
  var dirs = pacman.Ghost.ai.listDirs(map, this);
  this.dir = dirs[Math.floor(Math.random()*dirs.length)];
  pacman.Mob.prototype.update.call(this, map);
}

/**
 * AI for the ghosts
 */
pacman.Ghost.ai = {
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
  }
}

$(function() {
  var game = new pacman.GameState(WIDTH-pacman.margin, HEIGHT);
  game.draw(true);
  update();
  
  function update() {
    game.update();
    game.draw(false);
    setTimeout(update, 200); 
  }
});
