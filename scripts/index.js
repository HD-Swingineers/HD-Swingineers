// a list of all games
const options = [
  { name: 'NOUGHTS AND CROSSES', page: 'GameView.html' },
  { name: 'HANGMAN',             page: 'Hangman.html' },
  { name: 'TEXT ADVENTURE',      page: 'GameView.html' },
  { name: 'MAZE GAME',           page: 'maze.html' },
  { name: 'HIGH SCORES',         page: 'highscores.html' },
];

const OPTIONS_START = 16;

var selected = 0;

var displayMenu = function() {
  grid().clear().color('white');
  
  var line = 3;
  row(line++).centerText('======================================').color('red');
  line++;
  row(line++).centerText(' #   #  #### ####    ####   ###  ## ##').color('white');
  row(line++).centerText('##   ## ##   ## ##  ###  # ##  # ## ##').color('yellow');
  row(line++).centerText('## # ## #### ####    ###   ##    ## ##').color('yellow');
  row(line++).centerText('## # ## ##   ## ##    ###  ##    ## ##').color('yellow');
  row(line++).centerText('####### #### ## ##  #  ### ##  # ## ##').color('orange');
  row(line++).centerText(' ## ##  #### ####    ####   ###  ## ##').color('red');
  line++;
  row(line++).centerText('======================================').color('red');
  
  line = OPTIONS_START;
  for (let game of options) {
    row(line).centerText(game.name);
    line += 2;
  }
  
  row(HEIGHT-3).centerText('A GAME BY THE SWINGINEERS').color('lightgray');
  
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
