QUnit.test('snake direction', function(assert) {
	var right = Direction.right;  
 	var result1 = Direction.flip(right);
  
  assert.equal(result1, Direction.LEFT);

});
