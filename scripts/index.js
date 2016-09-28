// a list of all games
const options = [
  { name: 'NOUGHTS AND CROSSES', page: 'GameView.html' },
  { name: 'HANGMAN',             page: 'GameView.html' },
  { name: 'TEXT ADVENTURE',      page: 'GameView.html' },
  { name: 'MAZE',                page: 'GameView.html' },
  { name: 'HIGH SCORES',         page: 'Highscores.html' },
];

const OPTIONS_START = 16;

var selected = 0;

var displayMenu = function() {
  grid().clear().color('white');
  
  var line = 3;
  row(line++).centerText('====================================').color('red');
  line++;
  row(line++).centerText('  WWWW   W       W   W  W     W').color('white');
  row(line++).centerText('WWWW  W  W       W   W  WW   WW').color('yellow');
  row(line++).centerText('WWWW     WW  W  WW   W  WW   WW').color('yellow');
  row(line++).centerText(' WWWWW   WW  W  WW   W  WWW  WW').color('yellow');
  row(line++).centerText('   WWWW  WWW W WWW  WW  WW W WW').color('orange');
  row(line++).centerText('W  WWWW   WWW WWW   WW  WW  WWW').color('orange');
  row(line++).centerText(' WWWW     WW   WW   WW  WW   WW').color('red');
  line++;
  row(line++).centerText('====================================').color('red');
  
  line = OPTIONS_START;
  for (let game of options) {
    row(line).centerText(game.name);
    line += 2;
  }
  
  row(HEIGHT-2).centerText('A GAME BY THE SWINGINEERS').color('lightgray');
  
  setSelected(0);
}

var setSelected = function(index) {
  // wrap from top-bottom
  index = (index + options.length) % options.length;
  
  // remove cursor from old selection
  var preGame = options[selected];
  row(OPTIONS_START + selected * 2).clear().color('white').centerText(preGame.name);
  
  // draw the new selection
  var newGame = options[index];
  var newRow = row(OPTIONS_START + index*2);
  newRow.clear().centerText('= ' + newGame.name + ' =').color('yellow');
  
  // update where we are
  selected = index;
}

var play = function(index) {
  window.location.href = options[index].page;
}

$(function() {
  displayMenu();
  
  onButtonUp(function() {
    setSelected(selected-1);
  });

  onButtonDown(function() {
    setSelected(selected+1);
  });

  onButtonA(function() {
    play(selected);
});
});
