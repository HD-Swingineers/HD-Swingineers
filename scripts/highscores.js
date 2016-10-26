/**
 * File for displaying the highscore screen.
 * Depends on highscore-common.js
 */
"use strict";

/**
 * The order that the games display in
 */
var _order = [
  GameID.Nacs,
  GameID.HangMan,
  GameID.TextAdventure,
  GameID.MazeGame,
  GameID.Pacman,
  GameID.Snake
];

var _showingIndex = 0;

/**
 * Displays a game by index
 */
var showIndex = function(index) {
  // loop the id around
  index = parseInt(index);
  if (index < 0)
    index += _order.length;
  if (index >= _order.length)
    index -= _order.length;
  
  _showingIndex = index;
  
  var gameid = _order[index];
  display(gameid);
}


$(function() {
  grid().char('').back('#111').color('white');
  
  // look up if there is a specific game to start at
  var lastGame = localStorage.getItem('last-game');
  var index = 0;
  for (var i in _order) {
    if (_order[i] == lastGame) {
      index = i;
      break;
    }
  }
  
  // display the game
  showIndex(index);
  
  
  // setup arrow key movement
  onButtonLeft(function() {
    showIndex(_showingIndex-1);
  });
  
  onButtonRight(function() {
    showIndex(_showingIndex+1);
  });
  
  onButtonA(function() {
    showIndex(_showingIndex+1);
  });
  
  onButtonB(function() {
    showIndex(_showingIndex-1);
  });
});
