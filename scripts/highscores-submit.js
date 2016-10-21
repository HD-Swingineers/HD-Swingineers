/**
 * File for displaying the highscore submit page.
 * Depends on highscores-common.js
 */
 
"use strict";

/**
 * Does the work of listening to the users input
 * and getting the players name. Once the player
 * has typed their name, the score is submitted
 */
var inputName = function(gameid, score) {
  display(gameid);
  
  var line = 24;
  
  row(line).clear().color('white').color('yellow');
  writeText(8, line, 'Enter Name:');
  
  var name = '';
  onKeyPressed(function(key) {
    if (key == 'Backspace')
      name = name.slice(0, -1);
    else if (key.length == 1)
      name += key.toUpperCase();
    else
      return;
    writeText(20, line, name+'_   ').color('yellow');
    
  });
  
  onButtonA(function() {
    submitScore(gameid, name, score);
    window.location = 'highscores.html';
  });
}

$(function() {
  var score = '120';//localStorage.getItem('input-score');
  var game = 'nc';//localStorage.getItem('input-game');  
  localStorage.removeItem('last-place-'+game);
  localStorage.removeItem('input-score');
  localStorage.removeItem('input-game');
  
  localStorage.setItem('last-game', game);
  
  var scores = getHighscores(game);
  var madeIt = scores.length < MAX_SCORES;
  console.log(scores);
  for (var i in scores) {
    console.log(score + ' > ' + scores[i].score)
    console.log(score > scores[i].score);
    if (scores[i].score < score) {
      madeIt = true;
      break;
    }
  }
  if (madeIt)
    inputName(game, score);
  else
    window.location = 'highscores.html';
    
});
