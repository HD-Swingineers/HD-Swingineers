

var mycanvas = document.getElementById('mycanvas');
var ctx = mycanvas.getContext('2d');
var snakeSize = 10; 
var w = 640;
var h = 480;
var score = 0;
var gameSpeed = 100;
var snake;
var snakeSize = 10;
var food;

(function () {

  document.onkeydown = function(event) {

        keyCode = event.keyCode;

        switch(keyCode) {

        case 13: 
        drawModule.init()
        gameloop = clearInterval(gameloop);
        score = 0;
        break;
        
        case 37: 
          if (direction != 'right') {
            direction = 'left';
          }
          break;

        case 39:
          if (direction != 'left') {
          direction = 'right';
          }
          break;

        case 38:
          if (direction != 'down') {
          direction = 'up';
          }
          break;

        case 40:
          if (direction != 'up') {
          direction = 'down';
          }
          break;
          }
      }

})(window, document, drawModule);

///----///

var drawModule = (function () { 

var start = function(){
  var score_text = "Final Score: " ;
          ctx.fillStyle = 'white';
          ctx.font="30px Calibri";
           alert('ok');
}  

var init = function(){
      direction = 'down';
      drawSnake();
      createFood();
      gameloop = setInterval(paint, gameSpeed);
  }

  var bodySnake = function(x, y) {
 		ctx.fillStyle = 'white';
  		ctx.font="10px Calibri";
  		ctx.fillText("@",x*snakeSize,y*snakeSize);
  }

  var drawFood = function(x, y) {
        ctx.fillStyle = 'yellow';
        ctx.font="10px Calibri";
  		ctx.fillText("@",x*snakeSize,y*snakeSize);
  }

  var scoreText = function() {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'white';
    ctx.font="20px Calibri";
    ctx.fillText(score_text, 280, h-5);
  }

  var drawSnake = function() {
      var length = 3;
      snake = [];
      for (var i = length-1; i>=0; i--) {
          snake.push({x:i, y:0});
      }  
  }
    
  var paint = function(){
      ctx.fillStyle = '#101';
      ctx.fillRect(0, 0, w, h);
      var snakeX = snake[0].x;
      var snakeY = snake[0].y;

      if (direction == 'right') { 
        snakeX++; }
      else if (direction == 'left') { 
        snakeX--; }
      else if (direction == 'up') { 
        snakeY--; 
      } else if(direction == 'down') { 
        snakeY++; }

      if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
      
          //restart the game
          gameloop = clearInterval(gameloop);

          var score_text = "Final Score: " + score;
      	  ctx.fillStyle = 'white';
      	  ctx.font="30px Calibri";
        	ctx.fillText(score_text, 230, h-240);
          score = 0;

          return;          
        }
        
        if(snakeX == food.x && snakeY == food.y) {
          var tail = {x: snakeX, y: snakeY}; 
          score ++;
          
          createFood();
        } else {
          var tail = snake.pop();
          tail.x = snakeX; 
          tail.y = snakeY;
        }
      
        snake.unshift(tail); 

        for(var i = 0; i < snake.length; i++) {
          bodySnake(snake[i].x, snake[i].y);
        } 
        
        drawFood(food.x, food.y); 
        scoreText();
  }

  var createFood = function() {
      food = {
        x: Math.floor((Math.random() * 30) + 1),
        y: Math.floor((Math.random() * 30) + 1)
      }

      for (var i=0; i>snake.length; i++) {
        var snakeX = snake[i].x;
        var snakeY = snake[i].y;
      
        if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
          food.x = Math.floor((Math.random() * 30) + 1);
          food.y = Math.floor((Math.random() * 30) + 1);
        }
      }
  }

  var checkCollision = function(x, y, array) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].x === x && array[i].y === y)
        return true;
      } 
      return false;
  }
    return {
      init : init
    };
    
}());
