/**
 * Common functions for displaying the highscore screen
 * Depends on gamesetup.js
 */
"use strict";

/**
 * The display names of the games
 */
var _names = {
  [GameID.Nacs]:          'NOUGHTS AND CROSSES',
  [GameID.HangMan]:       'HANG MAN',
  [GameID.TextAdventure]: 'TEXT ADVENTURE',
  [GameID.MazeGame]:      'MAZE GAME',
  [GameID.Pacman]:        'PACMAN',
  [GameID.Snake]:         'SNAKE'
}

var MAX_SCORES = 5;

/**
 * Writes a score to storage
 */
var submitScore = function(gameid, name, score) {
  var scores = getHighscores(gameid);
  
  // determine place in the scores
  var place = scores.length;
  for (var i = 0; i < scores.length; i++) {
    var s = parseInt(scores[i].score);
    if (s < score) {
      place = i;
      break;
    }
  }
  
  localStorage.setItem('last-place-'+gameid, place+1);
  
  // shift the scores down
  scores.splice(place, 0, {'name': name, 'score': score});
  saveHighscores(gameid, scores);
}

/**
 * Saves a list of scores to storage
 */
var saveHighscores = function(gameid, scores) {
  for (var i = 0; i < scores.length; i++) {
    if (i >= MAX_SCORES)
      return;
    localStorage.setItem('name-'+gameid+'-'+i, scores[i].name);
    localStorage.setItem('score-'+gameid+'-'+i, scores[i].score);
  }
}

/**
 * Reads out the scores from storage
 */
var getHighscores = function(gameid) {
  var scores = [];
  var index = 0;
  var name = localStorage.getItem('name-'+gameid+'-'+index);
  while (name != null && index < MAX_SCORES) {
    var score = localStorage.getItem('score-'+gameid+'-'+index);
    var entry = {
      'name': name,
      'score': score
    };
    scores.push(entry);
    index++;
    name = localStorage.getItem('name-'+gameid+'-'+index);
  }
  
  while (scores.length < MAX_SCORES) {
    scores.push({
      'name': 'nobody',
      'score': 0
    });
  }
  
  return scores;
}

/**
 * Draws the spcified game
 */
var display = function(gameid) { 
  grid().clear();
  
  drawBackgroundGraphic();
  var gameName = _names[gameid];
  row(4).centerText('============================').color('#F40');
  row(6).centerText(gameName).color('yellow');
  row(8).centerText('============================').color('#F40');
  cell(7, 6).char('◂');
  cell(WIDTH-8, 6).char('▸');
  
  var lastPlace = localStorage.getItem('last-place-'+gameid);
  
  var startLine = 12;
  var scores = getHighscores(gameid);
  var center = Math.floor(WIDTH/2)+4;
  for (var i = 0; i < scores.length; i++) {
    var line  = startLine + i * 2;
    var place = i+1;
    var data  = scores[i];
    var name  = data.name;
    var score = data.score;
    
    var placeText = place;
    switch(place) {
      case 1: placeText += 'ST'; break;
      case 2: placeText += 'ND'; break;
      case 3: placeText += 'RD'; break;
      default: placeText += 'TH'; break;
    }
    var color = 'white';
    if (place == lastPlace)
      color = 'yellow';
    writeText(12, line, placeText).color(color);
    writeText(17, line, score.toString()).color(color);
    writeText(21, line, name.toUpperCase()).color(color);
  }
  
  row(26).centerText('============================').color('#F40');
}

/**
 * Draws the cup background
 */
var drawBackgroundGraphic = function() {
  var background = [
    '  ####;              ;####  ',
    ' #   ;################;   # ',
    '#    ########  ########    #',
    '#    ####### # ########    #',
    '#    ###### ## ########    #',
    '#    ######### ########    #',
    '#    ;######## #######"    #',
    ' ##   ######## #######   ## ',
    '  "###"#####     ####"###"  ',
    '       "############"       ',
    '          "######"          ',
    '            ####            ',
    '             ##             ',
    '             ##             ',
    '             ##             ',
    '           ######           ',
    '        #####  #####        '
  ];
  
  for (var i = 0; i < background.length; i++) {
    var line = background[i];
    row(i+9).centerText(line).color('#221');
  }
}
