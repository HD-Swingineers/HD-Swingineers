QUnit.test( "pacman mirrors grid", function( assert ) {
  map = stringToMap([
    '# #-#',
    '-#- -',
    ' - # '
  ]);
  
  expected = mapToString(stringToMap([
    '# ## #',
    '-#--#-',
    ' -  - '
  ]));
  
  pacman.mirror(map, 2);
  
  result = mapToString(map);
  
  assert.equal(result, expected);
});

QUnit.test( "pacman remove dead ends", function( assert ) {
  map = stringToMap([
    '#######',
    '#---#-#',
    '#-#-#-#',
    '#-#---#',
    '#######'
  ]);
  
  expected = mapToString(stringToMap([
    '#######',
    '#-----#',
    '#-#-#-#',
    '#-----#',
    '#######'
  ]));
  
  pacman.removeDeadEnds(map);
  
  result = mapToString(map);
  
  assert.equal(result, expected);
});

QUnit.test('update pacman mob', function(assert) {
  var mob = new pacman.Mob();
  mob.pos.set(1, 3);
  mob.dir = Direction.RIGHT;
  
  pacman.updateMob(mob);
  
  assert.deepEqual(mob.pos, new Point(2, 3));
});

QUnit.test('AI get valid directions', function(assert) {
  map = stringToMap([
    '#####',
    '# @ #',
    '## ##',
    '#####',
  ]);
  
  var ghost = new pacman.Mob();
  ghost.pos.set(2, 1);
  ghost.dir = Direction.RIGHT;

  var dirs = pacman.ai.listDirs(map, ghost);
  
  // not left because avoid going backwards
  assert.deepEqual(dirs, [Direction.RIGHT, Direction.DOWN]);
});

QUnit.test('AI knows how to get out', function(assert) {
  map = stringToMap([
    '#####',
    '#  @#',
    '## ##',
    '#####',
  ]);
  
  var ghost = new pacman.Mob();
  ghost.pos.set(3, 1);
  ghost.dir = Direction.RIGHT;

  var dirs = pacman.ai.listDirs(map, ghost);
  
  assert.deepEqual(dirs, [Direction.LEFT]);
});
