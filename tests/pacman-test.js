"use strict";

QUnit.test( "pacman mirrors grid", function( assert ) {
  var map = stringToMap([
    '# #-#',
    '-#- -',
    ' - # '
  ]);
  
  var expected = mapToString(stringToMap([
    '# ## #',
    '-#--#-',
    ' -  - '
  ]));
  
  pacman.mirror(map, 2);
  
  var result = mapToString(map);
  
  assert.equal(result, expected);
});

QUnit.test( "pacman remove dead ends", function( assert ) {
  var map = stringToMap([
    '#######',
    '#---#-#',
    '#-#-#-#',
    '#-#---#',
    '#######'
  ]);
  
  var expected = mapToString(stringToMap([
    '#######',
    '#-----#',
    '#-#-#-#',
    '#-----#',
    '#######'
  ]));
  
  pacman.removeDeadEnds(map);
  
  var result = mapToString(map);
  
  assert.equal(result, expected);
});

QUnit.test('update pacman mob moves', function(assert) {
  var map = pacman.convert(stringToMap([
    '#####',
    '#@ ##',
    '# ###',
    '#####'
  ]));
  var mob = new pacman.Mob();
  mob.pos.set(1, 1);
  mob.dir = Direction.RIGHT;
  
  mob.update(map);
  
  assert.deepEqual(mob.pos, new Point(2, 1));
});

QUnit.test('update pacman mob stops at wall', function(assert) {
  var map = pacman.convert(stringToMap([
    '#####',
    '# @##',
    '# ###',
    '#####'
  ]));
  var mob = new pacman.Mob();
  mob.pos.set(2, 1);
  mob.dir = Direction.RIGHT;
  
  mob.update(map);
  
  assert.deepEqual(mob.pos, new Point(2, 1));
});

QUnit.test('AI get valid directions', function(assert) {
  var map = stringToMap([
    '#####',
    '# @ #',
    '## ##',
    '#####',
  ]);
  
  var ghost = new pacman.Ghost('pink');
  ghost.pos.set(2, 1);
  ghost.dir = Direction.RIGHT;

  var dirs = pacman.Ghost.ai.listDirs(map, ghost);
  
  // not left because avoid going backwards
  assert.deepEqual(dirs, [Direction.RIGHT, Direction.DOWN]);
});

QUnit.test('AI knows how to get out', function(assert) {
  var map = stringToMap([
    '#####',
    '#  @#',
    '## ##',
    '#####',
  ]);
  
  var ghost = new pacman.Ghost();
  ghost.pos.set(3, 1);
  ghost.dir = Direction.RIGHT;

  var dirs = pacman.Ghost.ai.listDirs(map, ghost);
  
  assert.deepEqual(dirs, [Direction.LEFT]);
});

QUnit.test('pacman converts map', function(assert) {
  var map = stringToMap([
    '#- ',
    ' #-'
  ]);
  
  pacman.convert(map);
  
  assert.equal(map[0][0], pacman.State.WALL);
  assert.equal(map[1][0], pacman.State.DOT);
  assert.equal(map[2][0], pacman.State.DOT);
  assert.equal(map[0][1], pacman.State.DOT);
  assert.equal(map[1][1], pacman.State.WALL);
  assert.equal(map[2][1], pacman.State.DOT);
});
