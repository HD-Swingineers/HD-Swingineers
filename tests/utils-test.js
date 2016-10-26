QUnit.test('direction flipping', function(assert) {
  var left = Direction.LEFT;
  var leftup = (Direction.LEFT | Direction.UP)
  
  var result1 = Direction.flip(left);
  var result2 = Direction.flip(leftup);
  
  assert.equal(result1, Direction.RIGHT);
  assert.equal(result2, Direction.RIGHT | Direction.DOWN);
});
