// Code for hang man
$(function() {
  grid().clear().color('white').back('#111');
  
  // example of writting text loaded from a file
  loadText('scripts/hello (copy).txt', function(text) {
      writeText(7, 5, text).color('red');
  });
  
  // hangman code goes here
  row(16).centerText('INSERT GAME HERE');

});

"use strict";

var gOutputImageIndex = 0;

const gOutputImage =
[
	"Branch",
	"Rope",
	"Head",
	"Torso",
	"Arms",
	"Legs",
]

var gHangManWordStatic = "default";

var gHangManWordFlexible = gHangManWordStatic;

var gGameOver = false;

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

function setHangmanWord() 
{
	const easyWords = 
	[
		"light",
		"early",
		"trees",
		"forshadow",
		"parkdale",
		"forlorne"
	]

	gHangManWordStatic = easyWords[Math.round(Math.random() * (easyWords.length - 1))];	
	
	gHangManWordFlexible = gHangManWordStatic;
}

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

function addLetter(word, letterToRemove)
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

function hangmanFillLetter(letter) 
{
	var result = "";

	var initialString = document.getElementById("hangManWordOut").innerHTML;

	var i = 0;

	while(i < gHangManWordStatic.length)
	{
		if(gHangManWordStatic[i] == letter)
		{
			result += letter;
		}

		else
		{
			result += initialString[i];
		}

		i += 1;
	}

	document.getElementById("hangManWordOut").innerHTML = result;
}

function hangMan()
{
	setHangmanWord();

	 // example of writting text loaded from a file
	  loadText('../graphics/7th last.txt', function(text) {
	      writeText(7, 5, text).color('red');
	  });

	document.getElementById("hungman").innerHTML = gOutputImage[gOutputImageIndex];

	document.getElementById("hangManWordOut").innerHTML = underscoreWord(gHangManWordStatic);

	document.addEventListener("keydown", 
		function(event) 
		{
			if ((event.keyCode >= 65) && (event.keyCode <= 90) && !(gGameOver))
			{	
				const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
				
				var tempString = removeLetter(gHangManWordFlexible, alpha[event.keyCode - 65]);

				if((gHangManWordFlexible.length - tempString.length) != 0)
				{
					gHangManWordFlexible = tempString;

					hangmanFillLetter(alpha[event.keyCode - 65]);

					if (countLetter(document.getElementById("hangManWordOut").innerHTML, "_") == 0) 
					{
						gGameOver = true;
						document.getElementById("ending").innerHTML = "!!YOU WON!!";
					}				
				}
				
				else
				{
					gOutputImageIndex += 1;

					document.getElementById("hungman").innerHTML = gOutputImage[gOutputImageIndex];

					if (gOutputImageIndex == gOutputImage.length - 1) 
					{
						gGameOver = true;
						document.getElementById("ending").innerHTML = "--YOU LOST--";
					}
				}
			}
		});
}