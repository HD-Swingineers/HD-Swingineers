QUnit.test("Check if snake can incrament score", function(assert) {
  var scr = SCORE;
  assert.equal(0,scr);
  AddScore();
  assert.equal(1, scr);
});

QUnit.test("Check if snake length increases and score goes up", function(assert) {
 // var scr = SCORE;
  var xPos = 0;
  var yPos = 0;
  var xFood = 0;
  var yFood = 0;

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