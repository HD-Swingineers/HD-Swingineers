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
          value = mazegen.State.SOLID; break;
        case '-': 
          value = mazegen.State.PATH; break;
        case ' ':
        case '~':
        case '@': // position of interest
          value = mazegen.State.EMPTY; break;
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
          case mazegen.State.SOLID: 
            ch = '#'; break;
          case mazegen.State.EMPTY:
            ch = ' '; break;
          case mazegen.State.PATH:
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
  
  assert.equal(map[0][0], mazegen.State.SOLID);
  assert.equal(map[1][0], mazegen.State.EMPTY);
  assert.equal(map[0][1], mazegen.State.PATH);
  assert.equal(map[1][1], mazegen.State.SOLID);
  assert.equal(map[0][2], mazegen.State.EMPTY);
  assert.equal(map[1][2], mazegen.State.PATH);
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
  
  var result = mazegen.validDirs(map, new Point(2, 2));
  
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
  
  var result = mazegen.validDirs(map, new Point(2, 2));
  
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
  
  var result = mazegen.validDirs(map, new Point(2, 2));
  
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
  mazegen.advance(map, p, Direction.LEFT);
  
  assert.ok(map[1][2] == mazegen.State.EMPTY);
  assert.deepEqual(p, new Point(1,2));
});

QUnit.test('Backtrace stops at possible brach', function(assert) {
  var map = stringToMap([
    '#####',
    '#@ -#',
    '## ##',
    '## ##', // <- should stop here
    '## ##'
  ]);
  var p = new Point(1, 1);
  var result = mazegen.backtrace(map, p);
  
  assert.equal(map[1][1], mazegen.State.PATH);
  assert.equal(map[2][1], mazegen.State.PATH);
  assert.equal(map[3][1], mazegen.State.PATH); // unchanged
  assert.equal(map[2][2], mazegen.State.PATH);
  assert.equal(map[2][3], mazegen.State.EMPTY);
  
  assert.deepEqual(p, new Point(2, 3));
  assert.equal(result, false);
});

QUnit.test('Backtrace detects finish', function(assert) {
  var map = stringToMap([
    '#####',
    '#  -#',
    '## ##',
    '#####',
  ]);
  var p = new Point(2, 2);
  var result = mazegen.backtrace(map, p);
  
  assert.equal(map[1][1], mazegen.State.PATH);
  assert.equal(map[2][1], mazegen.State.PATH);
  assert.equal(map[3][1], mazegen.State.PATH);
  assert.equal(map[2][2], mazegen.State.PATH);
  
  assert.deepEqual(p, new Point(1, 1));
  assert.equal(result, true);
});
