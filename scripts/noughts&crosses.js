
var mycanvas = document.getElementById('game-window');
var ctx = mycanvas.getContext('2d');
var w = 640;
var h = 480;

var selection = 0;
var player1Cells = [];//"-1","-1","-1","0","2","3","4","0","7","1"]; // -1 for nothing, other for selection number
var player2Cells = []; //= [-1,-1,-1,-1,-1,2,3,-1,-1];
var p1Score = 0;
var p2Score = 0;
var noGames = 0;
var grid = 0;
var gridSize = 480;
var selectionWidth = 14;
var PlayerTurn = true;
var goCount = 0;
var draws = 0;


var drawModule = (function () { 

var gameRules = function(){

  //end the game after 10 rounds
  if ((p1Score + p2Score) == 5){
     gameloop = clearInterval(gameloop);
      ctx.fillStyle = 'white';
      ctx.font="30px Calibri";
      if (p1Score > p2Score)
      {
        ctx.fillText("Player1 WON!", 230, h-240);
        setTimeout(function() { submitHighScore(GameID.Nacs, this.p1Score); }, 3000);
      }
      else
      {
        ctx.fillText("Player2 WON!", 230, h-240);
        submitHighScore(GameID.Nacs, this.p2Score);
      }   
  }

  if (goCount == 9)
  {
    draws++;
    resetGame("orange");
  }

  //preconfigured win cases
  var testedPlr = player1Cells;
    if (!PlayerTurn)
    {

      for(var i = 0; i<2; i++){
        if  ((testedPlr[0] == 1 && testedPlr[1] == 1 && testedPlr [2] == 1) || (testedPlr[3] == 1 && testedPlr[4] == 1 && testedPlr [5] == 1)
        || (testedPlr[6] == 1 && testedPlr[7] == 1 && testedPlr [8] == 1) || (testedPlr[0] == 1 && testedPlr[3] == 1 && testedPlr [6] == 1)
        || (testedPlr[1] == 1 && testedPlr[4] == 1 && testedPlr [7] == 1) || (testedPlr[2] == 1 && testedPlr[5] == 1 && testedPlr [8] == 1)
        || (testedPlr[0] == 1 && testedPlr[4] == 1 && testedPlr [8] == 1) || (testedPlr[2] == 1 && testedPlr[4] == 1 && testedPlr [6] == 1)
        ){
            p1Score++;
            resetGame("green");
            break;
         }
      }
    }else {
    testedPlr = player2Cells;

    for(var i = 0; i<2; i++){
       if  ((testedPlr[0] == 1 && testedPlr[1] == 1 && testedPlr [2] == 1) || (testedPlr[3] == 1 && testedPlr[4] == 1 && testedPlr [5] == 1)
      || (testedPlr[6] == 1 && testedPlr[7] == 1 && testedPlr [8] == 1) || (testedPlr[0] == 1 && testedPlr[3] == 1 && testedPlr [6] == 1)
      || (testedPlr[1] == 1 && testedPlr[4] == 1 && testedPlr [7] == 1) || (testedPlr[2] == 1 && testedPlr[5] == 1 && testedPlr [8] == 1)
      || (testedPlr[0] == 1 && testedPlr[4] == 1 && testedPlr [8] == 1) || (testedPlr[2] == 1 && testedPlr[4] == 1 && testedPlr [6] == 1)
      ){
          p2Score++;
          resetGame("red");
          break;      
        }
    }
  }
}

var resetGame = function(colour){
  player1Cells = [];
  player2Cells = [];
  ctx.fillStyle=colour;
  ctx.fillRect ( 0, 0 , w , h );
  goCount=0;
  init();

}

var drawGame = function() {
  ctx.clearRect ( 0, 0 , w , h );
  drawBorder();
  scoreText();
  drawAllTakenSpaces();
  if (PlayerTurn){
    drawInGrid("green","X", selection);
    // drawInGrid("green","box", selection);
  }
  else{
    drawInGrid("red","O", selection);
    // drawInGrid("red","box", selection);
  }

  gameRules();
}

var init = function(){
  for (var i = 0; i<9; i++)
  {
    player1Cells.push(0);
    player2Cells.push(0);
  }

    gameloop = setInterval(drawGame, 100);
  }

  var scoreText = function() {
    ctx.fillStyle = 'white';
    ctx.font="20px Calibri";
    ctx.fillText("Games " + (p1Score + p2Score) + "/5", 505, 80);
    ctx.fillText("Draws: "+ draws , 505, 50);
    ctx.fillText("Player1: " + p1Score, 505, 110);
    ctx.fillText("Player2: " + p2Score, 505, 140);
    
    if (PlayerTurn){
      ctx.fillStyle = 'green';
       ctx.fillText("Player1: " + p1Score, 505, 110);
     }
     else{
       ctx.fillStyle = 'red';
      ctx.fillText("Player2: " + p2Score, 505, 140);
    }
  }

   var drawAllTakenSpaces = function()
  {
    for (var i = 0; i < player1Cells.length; i++)
    {
      if (player1Cells[i] == 1)
        drawInGrid("#66ff66","X", i);

      if (player2Cells[i] == 1)
        drawInGrid("#ff6600","O", i);
    }   
  }

  var drawInGrid = function(colour, type, localSelection)
  {
  var xPos;
  var xCorrect = 10.7;
  var yCorrect = 10.35;

  ctx.fillStyle = colour;
  ctx.font="15px Calibri";

  if ((localSelection > 2) && (localSelection <= 5)){
    yPos = 1;
    xPos = localSelection - 3;
  }else if (localSelection > 5){
    yPos = 2;
    xPos = localSelection -6;
  }else{
    xPos = localSelection;
    yPos =  0;   
  }

    switch(type) {
        case "box":
          drawBox(xPos, yPos, xCorrect, yCorrect);
          break;
        case "X":
          drawX(xPos, yPos, xCorrect, yCorrect);
          break;
        case "O":
          drawO(xPos, yPos, xCorrect, yCorrect);
          break;
    }
  }

  var drawBox = function(xPos, yPos, xCorrect, yCorrect){

    for (var i = 0; i < selectionWidth; i++)
    {
       //top and bottom 
      ctx.fillText("+",selectionWidth*xPos*xCorrect + 20+10*i+10, selectionWidth*yPos*yCorrect + 30+10);
      ctx.fillText("+",selectionWidth*xPos*xCorrect   +20+10*i+10, selectionWidth*yPos*yCorrect + 30+120+10);

      //left and right
      if (i < selectionWidth-1)
      {
        ctx.fillText("+",selectionWidth*xPos*xCorrect +20+10,selectionWidth*yPos*yCorrect + 30+10*i+10);
        ctx.fillText("+",selectionWidth*xPos*xCorrect +20 +130+10,selectionWidth*yPos*yCorrect + 30+10*i+10);
      }
    }
  }

  var drawX = function(xPos, yPos, xCorrect, yCorrect){
    for (var i = 2; i < selectionWidth-2; i++)
    {
       //top and bottom 
      var xFix = 25+10*i+4;     
      ctx.fillText("+",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect + 35+10*i);
      ctx.fillText("+",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect + 165-10*i);
    }
  }

  var drawO = function(xPos, yPos, xCorrect, yCorrect){
     var xFix = 65;
     var yFix = 15;
      ctx.fillText(" OOOOO",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +35 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +45 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +55 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +65 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +75 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +85 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +95 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +105 + yFix);
      ctx.fillText("O           O",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +115 + yFix);
      ctx.fillText(" OOOOO",selectionWidth*xPos*xCorrect + xFix, selectionWidth*yPos*yCorrect +125 + yFix);
  }

    var drawBorder = function () {
      var x = 0;
      var y = 0;
      var border = "*";
      ctx.fillStyle = 'white';
      ctx.font="15px Calibri";
      var borderWidth = 2;

      while(x <= 640)
      {
        ctx.fillText(border,(gridSize/3)+borderWidth*10-10*i+10,x);
        ctx.fillText(border,(2*gridSize/3)-10+borderWidth*10-10*i+10,x);

        //top and bottom borders
        for (var i = 0; i < borderWidth; i++)
        {
          ctx.fillText(border,x,10+10*i);
          ctx.fillText(border,x,480-10*i);
        }
        x+=10;
      }
      while(y <= gridSize)
      {
        
        ctx.fillText(border,y,(gridSize/3)+borderWidth*10-10*i+10);
        ctx.fillText(border,y,(2*gridSize/3)+borderWidth*10-10*i);

        for (var i = 0; i < borderWidth; i++)
        {

          ctx.fillText(border,0+10*i,y);   //left wall
          ctx.fillText(border,630-10*i,y); //right wall
          ctx.fillText(border,470-10*i+20,y); //sectino dividor
         }

        y+=10;
      }
  }

    return {
      init : init
    };

}());

(function () {

   var cellClear = function(){
      if ((player1Cells[selection] == 0) && (player2Cells[selection] == 0))
        return true;
      return false;
  }

  var selectSqaure = function(){
    if (cellClear())
    {
       goCount++;
      if (PlayerTurn == true ){
         player1Cells[selection]=1;
       }else{
         player2Cells[selection]=1;
       }

      PlayerTurn = !PlayerTurn;
    }      
  }

  document.onkeydown = function(event) {
        keyCode = event.keyCode;

        switch(keyCode) {

        case 13:
          selectSqaure();
        break;
        case 37: //ef
        break;
        case 38:
        break;
        case 39:
        break;
        case 40:
        break;
        }
      }

  onButtonUp(function() {
    if (selection >= 0 && selection <= 2)
      selection = selection + 6;
    else
      selection = selection - 3;
  });

  onButtonDown(function() {
    if (selection >= 6 && selection <= 8)
      selection = selection - 6;
    else
      selection = selection + 3;
  });

  onButtonLeft(function() {
    if (selection == 0)
      selection = 8;
    else
      selection--;
  });

  onButtonRight(function() {
     if (selection == 8)
        selection = 0;
      else
        selection++;
  });

  onButtonA(function() {
    selectSqaure();
  });

})(window, document, drawModule);
