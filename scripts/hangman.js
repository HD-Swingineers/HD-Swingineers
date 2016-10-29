"use strict";

// michaels unnit testing crap
var SCORE = 0;
var SNAKELENGTH = 3;

function addScore(num) {
    SCORE ++;
}


function checkCollision (x1 ,y1, x2, y2){
  // if (x1 == x2) && (y1 == y2){
    SCORE = SCORE + 1;
    SNAKELENGTH = SNAKELENGTH + 1;
  // }
}


var frames = [
  [
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '                             ',
    '  *                       *  ',
    '_\\|______________________\\|/_'
  ],
    [
    '                             ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ],
  [
    '      ╒======================',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ],
  [
    '      ╒======================',
    '      ||            |        ',
    '      ||            |        ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ],
  [
    '      ╒======================',
    '      ||            |        ',
    '      ||            |        ',
    '      ||            ..       ',
    '      ||             >       ',
    '      ||            __       ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '      ||                     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ],
  [
    '      ╒======================',
    '      ||            |        ',
    '      ||            |        ',
    '      ||            ..       ',
    '      ||             >       ',
    '      ||            __       ',
    '      ||            |        ',
    '      ||           /|\\       ',
    '      ||            |        ',
    '      ||                     ',
    '      ||                     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ],
  [
    '      ╒======================',
    '      ||            |        ',
    '      ||            |        ',
    '      ||            ..       ',
    '      ||             >       ',
    '      ||            __       ',
    '      ||            |        ',
    '      ||           /|\\       ',
    '      ||            |        ',
    '      ||           / \\       ',
    '      ||          /_  \\_     ',
    '  *   ||                  *  ',
    '_\\|___╨╨_________________\\|/_'
  ]
]

/**
 * Strips all occurances of a letter from a word
 */
function removeLetter(word, letterToRemove)
{
  var i = 0;

  while(i < word.length)
  {
    if((word[i] == letterToRemove))
    {
      var start = "";

      if(i > 0)
      {
        start = word.slice(0, i);
      }

      var end = "";

      if((word.length > 0) && (i != word.length))
      {
        end = word.slice(i + 1, word.length);
      }

      word = start + end;
    }

    else
    {
      i += 1;
    }
  }

  return word;
}

/**
 * Creates a random word
 */
function generateWord() 
{
  var words = [
    "light",
    "early",
    "trees",
    "forshadow",
    "parkdale",
    "forlorne"
  ];
  return words[Math.floor(Math.random() * (words.length))];  
}

/**
 * Counts the occurances of a letter in a word
 */ 
function countLetter(string, letter) 
{
  var result = 0;

  var i = 0;

  while(i < string.length)
  {
    if(string[i] == letter)
    {
      result += 1;
    }
    i += 1;
  }

  return result;
}

/**
 * Converts a word into a series of underscores
 */
function underscoreWord(word) 
{
  var result = "";

  var i = 0;

  while(i < word.length)
  {
    result += "_";
    i += 1;
  }

  return result;
}

/**
 * Removes underscores from a word.
 */
function removeUnderscores(revealed, partial, letter) {
  var result = partial;
  for (var i = 0; i < revealed.length; i++) {
    if (revealed[i] == letter) {
      // replace the undescore with the letter
      result = result.substr(0, i) + letter + result.substr(i+1);
    }
  }
  return result;
}

/**
 * Draws a frame to the screen 
 */
function drawFrame(frame) {
  for (var i = 0; i < frame.length; i++) {
    row(4+i).centerText(frame[i]);
  }
}

/**
 * Draws the guesses that the player has taken
 */
function drawGuesses(guessed) {
  var string = '';
  for (var i = 0; i < guessed.length; i++) {
    string += guessed[i].toUpperCase() + ' ';
  }
  row(22).centerText(string);
}

/**
 * Designed for when the player looses the game.
 * This draws the compelted word with the
 * unguessed letters in a different color;
 */ 
function completeWord(partial, complete) {
  var index = 0;
  row(20).centerText(partial.toUpperCase()).each(function(theCell, x, y) {
    if (theCell.char() == '_')
      theCell.color('red').char(complete[index].toUpperCase());
    index++;
  });
}

/**
 * Draws the partially completed word
 */
function drawPartial(partial) {
  row(20).centerText(partial.toUpperCase()).color('orange');
}

function hangMan()
{
  grid().clear().color('white').back('#111')
  // the word being guessed
  var word = generateWord();
  // the current frame being displayed
  var frameIndex = 0;
  // the partially guessed word
  var partial = underscoreWord(word);

  var guessed = [];

  drawFrame(frames[frameIndex]);
  drawPartial(partial);
  
  var gameOver = false;
  var won = false;
  
  onKeyPressed(function(key) {
    if (gameOver) {
      if (won) {
        submitHighScore(GameID.HangMan, (10-guessed.length)*10);
      } else {
        location.reload();
      }
    } else if (/^[a-zA-Z]$/.test(key)) {  
      key = key.toLowerCase();
      if (countLetter(word, key)) {
        // a letter has been guessed correctly
        partial = removeUnderscores(word, partial, key);
        drawPartial(partial);
        
        if (countLetter(partial, '_') == 0) {
          row(24).centerText('--- YOU WIN ---').color('yellow');
          gameOver = won = true;
          row(26).centerText('Press any key to submit score').color('#aaa');
        }
      } else if (guessed.indexOf(key) == -1) {
        guessed.push(key);
        drawGuesses(guessed);
        frameIndex++;
        drawFrame(frames[frameIndex]);

        if (frameIndex == frames.length-1) {
          row(24).centerText('---  YOU LOSE ---').color('yellow');
          row(26).centerText('Press any key to restart').color('#aaa');
          
          completeWord(partial, word);
          
          gameOver = true;
        }
      }
    }
  });
}

onKeyPressed(function(key) {
  console.log(key);
});

$(hangMan);
