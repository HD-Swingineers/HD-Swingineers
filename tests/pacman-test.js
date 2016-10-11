// Converts an array of strings to and array of states.
// This will also transform the array about the x=y axis
// so that x,y coordinates look correct in code.
var stringToMap = function(stringArray) {
	var map = [];
		
	for (var i in stringArray) {
		for (var j in stringArray[i]) {
			var ch = stringArray[i][j];
			var value;
			switch (ch) {
				case '#': 
					value = pacman.gen.State.SOLID; break;
				case '-': 
					value = pacman.gen.State.PATH; break;
				case ' ':
        case '~':
        case '@': // position of interest
					value = pacman.gen.State.EMPTY; break;
				default:
					console.log('unknown value \'' + ch + '\'');
			};
			
			var line = map[j];
			if (!line) {
				line = [];
				map.push(line);
			}
			line.push(value);
		}
	}
	return map;
}

var mapToString = function(m) {
  
  function mapToStrArray(map) {
    var strArray = [];
    for (var i in map) {
      for (var j in map[i]) {
        var value = map[i][j];
        var ch;
        switch (value) {
          case pacman.gen.State.SOLID: 
            ch = '#'; break;
          case pacman.gen.State.EMPTY:
            ch = ' '; break;
          case pacman.gen.State.PATH:
            ch = '-'; break;
          default:
            console.log('unknown value \'' + value + '\'');
        };
        
        var line = strArray[j];
        if (!line) {
          line = [];
          strArray.push(line);
        }
        line.push(ch);
      }
    }
    return strArray;
  }
  
  function strArrayToString(strArray) {
    var str = '';
    for (var i in strArray) {
      for (var j in strArray[i]) {
        var ch = strArray[i][j];        
        str += ch;
      }
      str += '\n';
    }
    return str.slice(0, -1);
  }
  
  return strArrayToString(mapToStrArray(m));
}

QUnit.test('StringToMap works', function(assert) {
	var map = stringToMap([
		'# ',
		'-#',
		' -'
	]);
	
	assert.equal(map[0][0], pacman.gen.State.SOLID);
	assert.equal(map[1][0], pacman.gen.State.EMPTY);
	assert.equal(map[0][1], pacman.gen.State.PATH);
	assert.equal(map[1][1], pacman.gen.State.SOLID);
	assert.equal(map[0][2], pacman.gen.State.EMPTY);
	assert.equal(map[1][2], pacman.gen.State.PATH);
});

QUnit.test('MapToString works', function(assert) {
  var map = stringToMap([
		'# ',
		'-#',
		' -'
	]);
  
  assert.equal(mapToString(map), 
    '# \n' +
    '-#\n' +
    ' -'
  );
});

QUnit.test('All empty directions can be valid gen directions', function(assert) {
	var map = stringToMap([
		'#####',
    '#####',
		'##@##',
		'#####',
    '#####'
	]);
	
	var result = pacman.gen.validDirs(map, new Point(2, 2));
	
	assert.ok(result.indexOf(Direction.UP) != -1);
	assert.ok(result.indexOf(Direction.DOWN) != -1);
	assert.ok(result.indexOf(Direction.LEFT) != -1);
	assert.ok(result.indexOf(Direction.RIGHT) != -1);
});

QUnit.test('Valid gen cannot go next to another path', function(assert) {
	var map = stringToMap([
		'#####',
    '# ###',
		'##@##',
		'#### ',
    '## ##'
	]);
  
	var result = pacman.gen.validDirs(map, new Point(2, 2));
	
	assert.ok(-1 == result.indexOf(Direction.UP));
	assert.ok(-1 == result.indexOf(Direction.RIGHT));
	assert.ok(-1 == result.indexOf(Direction.LEFT));
	assert.ok(-1 == result.indexOf(Direction.DOWN));
});

QUnit.test('Valid gen cannot go onto another path', function(assert) {
	var map = stringToMap([
		'#####',
    '## ##',
		'# @##',
		'#####',
    '#####'
	]);
	
	var result = pacman.gen.validDirs(map, new Point(2, 2));
	
	assert.ok(-1 == result.indexOf(Direction.UP));
	assert.ok(-1 != result.indexOf(Direction.RIGHT));
	assert.ok(-1 == result.indexOf(Direction.LEFT));
	assert.ok(-1 != result.indexOf(Direction.DOWN));
});

QUnit.test('Advance goes in the correct direction', function(assert) {
  var map = stringToMap([
    '#####',
    '#####',
    '##@##',
    '#####',
    '#####'
  ]);
  
  var p = new Point(2, 2);
  pacman.gen.advance(map, p, Direction.LEFT);
  
  assert.ok(map[1][2] == pacman.gen.State.EMPTY);
  assert.deepEqual(p, new Point(1,2));
});

QUnit.test('Backtrace works', function(assert) {
  var map = stringToMap([
    '#####',
    '#@ -#',
    '## ##',
    '## ##',
    '## ##'
  ]);
  var p = new Point(1, 1);
  pacman.gen.backtrace(map, p);
  
  assert.equal(map[1][1], pacman.gen.State.PATH);
  assert.equal(map[2][1], pacman.gen.State.PATH);
  assert.equal(map[3][1], pacman.gen.State.PATH); // unchanged
  assert.equal(map[2][2], pacman.gen.State.PATH);
  assert.equal(map[2][3], pacman.gen.State.EMPTY);
  
  assert.deepEqual(p, new Point(2, 3));
});

QUnit.test('Doing stuff', function(assert) {
  var map = pacman.gen.generate();
  console.log(mapToString(map));
  assert.ok(true);
});