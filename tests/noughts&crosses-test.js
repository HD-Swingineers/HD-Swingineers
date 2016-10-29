QUnit.test("Check if snake can incrament score", function(assert) {
  var scr = SCORE;
  assert.equal(0,scr);
  AddScore();
  assert.equal(1, scr);
});

QUnit.test('Correct wall generation test (borders)', function(assert) {
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

QUnit.test("Check if snake length increases and score goes up", function(assert) {
 // var scr = SCORE;
  var selection = 0;

  var snake = []
  for (var i = SNAKELENGTH; i>=0; i--) {
          snake.push({x:i, y:0});
      }  
  assert.equal(3,snake.length);
  assert.equal(0,SCORE);

  checkCollision(xPos,yPos,xFood,yFood);//collsion with food

  assert.equal(4,SNAKELENGTH);
  assert.equal(1,SCORE);
});

QUnit.test("Test selction had correct defaults and ", function(assert) {
  var cell1 = document.getElementById('cell-0x0');
  var cell2 = document.getElementById('cell-'+(WIDTH-1)+'x'+(HEIGHT-1));
  assert.ok(cell1 != null);
  assert.ok(cell2 != null);
});