
var mycanvas = document.getElementById('game-window2');
var ctx = mycanvas.getContext('2d');
var w = 640;
var h = 480;
var score = 0;
var gameSpeed = 100;
var snake;
var snakeSize = 10;
var food;


//event driven function suck as
//key presses and onscreen buttons

(function () {

  document.onkeydown = function(event) {

        keyCode = event.keyCode;

        switch(keyCode) {

        case 13: 
        //location.reload();
        submitHighScore(GameID.sk, this.score);
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

  onButtonUp(function() {
  if (direction != 'down') {
    direction = 'up';
    }
  });

  onButtonDown(function() {
  if (direction != 'up') {
    direction = 'down';
    }
  });

  onButtonLeft(function() {
  if (direction != 'right') {
    direction = 'left';
    }
  });

  onButtonRight(function() {
  if (direction != 'left') {
    direction = 'right';
    }
  });

})(window, document, drawModule);

///----///

var drawModule = (function () { 

var init = function(){
      direction = 'down';
      
      drawSnake();
      scoreText();
      createFood();
      drawBorder();

      //set the game to loop forver unless the paint funciton returns
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
    ctx.font="15px Calibri";
    ctx.fillText(score_text, 280, h);
  }

  var drawSnake = function() {
      var length = 3;
      snake = [];
      for (var i = length-1; i>=0; i--) {
          snake.push({x:i, y:0});
      }  
  }

    var drawBorder = function () {
        var x = 0;
        var y = 0;

        while(x <= 640)
        {
          ctx.fillStyle = 'white';
          ctx.font="15px Calibri";
          ctx.fillText("#",x,10);
          if ((x<270) || (x > 340))
              ctx.fillText("#",x,480);
          x+=10;
        }

        while(y <= 480)
        {
          ctx.fillStyle = 'white';
          ctx.font="15px Calibri";
          ctx.fillText("#",0,y);
          ctx.fillText("#",630,y);
          y+=10;
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

        //check if the snake eats itself or hits a wall
        endGameCheck(snakeX, snakeY);
        
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
        drawBorder(); 
        scoreText();
  }

  var endGameCheck = function(snakeX, snakeY){
    //wall detection 
   if (snakeX == 0 || snakeX == 63 || snakeY == 0 || snakeY == 48 || checkCollision(snakeX, snakeY, snake)) { 
      
          // //restart the game
          gameloop = clearInterval(gameloop);

          var score_text = "Final Score: " + score;
          ctx.fillStyle = 'white';
          ctx.font="30px Calibri";
          ctx.fillText(score_text, 230, h-240);
          submitHighScore(GameID.Snake, this.score);
          score = 0;
   
          return;
        }

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

  //snake iteself collsion
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
