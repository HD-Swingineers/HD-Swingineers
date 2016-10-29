
// michaels unnit testing crap
var SCORE = 0;
var SNAKELENGTH = 3;

QUnit.test('snake direction', function(assert) {
	var snkRight = Direction.RIGHT;
	var snkLeft = Direction.LEFT;
	var snkUp = Direction.UP;
	var snkDown = Direction.DOWN;
  
	var result1 = Direction.flip(snkRight);
	var result2 = Direction.flip(snkLeft);
	var result3 = Direction.flip(snkUp);
	var result4 = Direction.flip(snkDown);

	assert.equal(result1, Direction.LEFT);
	assert.equal(result2, Direction.RIGHT);
	assert.equal(result3, Direction.DOWN);
	assert.equal(result4, Direction.UP);
});

QUnit.test("Check if grid was created correctly", function(assert) {
  var space = document.getElementById('cell-0x0');
  var space2 = document.getElementById('cell-'+(WIDTH-1)+'x'+(HEIGHT-1));

  assert.ok(space != null);
  assert.ok(space2 != null);
});

// QUnit.test("Check if snake can incrament score", function(assert) {
//   var scr = SCORE;
//   assert.equal(0,scr);
//   scr = AddScore(scr);
//   assert.equal(1, scr);
// });

// QUnit.test("Check if snake length increases and score goes up", function(assert) {
//  // var scr = SCORE;
//   var xPos = 0;
//   var yPos = 0;
//   var xFood = 0;
//   var yFood = 0;

//   var snake = []
//   for (var i = SNAKELENGTH; i>=0; i--) {
//           snake.push({x:i, y:0});
//       }  
//   assert.equal(3,snake.length);
//   assert.equal(0,SCORE);

//   checkCollision(xPos,yPos,xFood,yFood);//collsion with food

//   assert.equal(4,SNAKELENGTH);
//   assert.equal(1,SCORE);
// });

// QUnit.test("Check if snake died", function(assert) {
//   var snkLength = 

// });

function checkCollision (x1 ,y1, x2, y2){
  if (x1 == x2) && (y1 == y2){
    SCORE++;
    SNAKELENGTH++;
  }
}



function addScore(num) {
  return num++
}

// 

