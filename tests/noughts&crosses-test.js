

QUnit.test("Score incrementation", function(assert) {
  var scr = SCORE;
  assert.equal(scr,2);
  // AddScore();
  // assert.equal(scr, 3);
});

QUnit.test('Correct wall generation test (borders)', function(assert) {
  var map = stringToMap([
    '#####',
    '#@ -#',
    '## ##',
    '## ##', 
    '## ##'
  ]);
  var p = new Point(1, 1);
  var result = mazegen.backtrace(map, p);
  
  assert.equal(map[1][1], mazegen.State.PATH);

  assert.equal(map[2][1], mazegen.State.PATH);

  assert.equal(result, false);
});

QUnit.test("Test if the cells were created correctly", function(assert) {
  var cell1 = document.getElementById('cell-0x0');

  var cell2 = document.getElementById('cell-'+(WIDTH-1)+'x'+(HEIGHT-1));


  assert.ok(cell1 != null);

  assert.ok(cell2 != null);
});