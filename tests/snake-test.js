QUnit.test('snake direction', function(assert) {
	var snkRight = Direction.RIGHT;
	var snkLeft = Direction.RIGHT;
	var snkUp = Direction.RIGHT;
	var snkDoWn = Direction.RIGHT;
  //var leftup = (Direction.LEFT | Direction.UP)
  
  var result1 = Direction.flip(snkRight);
 // var result2 = Direction.flip(leftup);
  
  assert.equal(result1, Direction.LEFT);
  // assert.equal(result2, Direction.RIGHT | Direction.DOWN);
	// var snakeRight = Direction.right;  
 // 	var result = Direction.flip(right);
  
 //  assert.equal(result, Direction.LEFT);

});
