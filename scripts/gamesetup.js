// This file acts as the link between the game core and 
// the html/css code

"use strict";

var WIDTH = 40;
var HEIGHT = 30;

/**
 * Selects every cell
 */
function grid() {
  return new Group($('.cell'));
}

/**
 * If x2 specified:
 *   Selects all rows between y1 (inclusive) and y2 (inclusive)
 * 
 * If y2 not specified:
 *   Selects a single row at y1
 */
function row(y1, y2) {
  if (y2 === undefined) {
    return new Group($('.row-' + y1));
  } else {
    if (y2 < y1)
      [y1, y2] = [y2, y1]
    var selection = $('.row-' + y1);
    for (var i = y1+1; i <= y2; i++) {
      selection = selection.add('.row-' + i);
    }
    return new Group(selection);
  }
}

/**
 * If x2 specified:
 *   Selects all columns between x1 (inclusive) and x2 (inclusive)
 * 
 * If x2 not specified:
 *   Selects a single column at x1
 */
function col(x1, x2) {
  if (x2 === undefined) {
    return new Group($('.col-' + x1));
  } else {
    if (x2 < x1)
      [x1, x2] = [x2, x1]
    var selection = $('.col-' + x1);
    for (var i = x1+1; i <= x2; i++) {
      selection = selection.add('.col-' + i);
    }
    return new Group(selection);
  }
}

/**
 * Selects a single cell
 */
function cell(x, y) {
  return new Group($('#cell-' + x + 'x' + y));
}
/**
 * Gets an empty group
 */
function empty() {
  return new Group($());
}

var Group = function(cells) {
  this.cells = cells;
}

/**
 * Gets the number of cells in the group
 */
Group.prototype.size = function() {
  return this.cells.length;
}

/**
 * Gets the x coordinate (i.e the column) of the
 * first cell in the group
 */
Group.prototype.x = function() {
  return $(this.cells.first()).data('x');
}

/**
 * Gets the x coordinate (i.e the column) of the
 * first cell in the group
 */
Group.prototype.y = function() {
  return $(this.cells.first()).data('y');
}

/**
 * Loops through all cells in a group
 * Function should be in the form of: function(cell, [x], [y])
 */
Group.prototype.each = function(func) {
  this.cells.each(function() {
    var ele = $(this);
    var group = new Group(ele);
    func(group, ele.data('x'), ele.data('y'));
  });
}

/**
 * Gets the union of the selections
 * returns a new grouping of the union
 */
Group.prototype.add = function(group) {
  return new Group(this.cells.add(group.cells));
}

/**
 * Removes the other group from this group
 * returns a new grouping without the other cells
 */
Group.prototype.not = function(group) {
  return new Group(this.cells.not(group.cells));
}

/**
 * Removes all cells except those that are in both groups
 * Returns a new grouping with only the intersection
 */
Group.prototype.intersect = function(group) {
  return new Group(this.cells.filter(group.cells));
}

/**
 * If color is specified:
 *   Sets the text color of the cells.
 *   returns this
 * 
 * If color not specified:
 *   Gets the text color of the first cell in the selection
 */
Group.prototype.color = function(clr) {
  if (clr === undefined) {
    return $(this.cells.first()).css('color');
  } else {
    this.cells.each(function(i, cell) {
      $(cell).css('color', clr);
    });
    return this;
  }
}

/**
 * If color is specified:
 *   Sets the background color of the cells.
 *   returns this
 * 
 * If color not specified:
 *   Gets the backgrount color of the first selected cell
 */
Group.prototype.back = function(clr) {
  if (clr === undefined) {
    return $(this.cells.first()).css('background-color');
  } else {
    this.cells.each(function(i, cell) {
      $(cell).css('background-color', clr);
    });
    return this;
  }
}

/**
 * If ch (short for 'character') is specified:
 *   Sets the content of each cell to ch. ch should be a single
 *   character
 *   returns this
 * 
 * If ch not specified:
 *   Gets the content of the first selected cell
 */
Group.prototype.char = function(ch) {
  if (ch === undefined) {
    return $(this.cells.first()).text();
  } else {
    this.cells.each(function(i, cell) {
      $(cell).text(ch);
    });
    return this;
  }
}

/**
 * Removes any text from the selection
 * Returns this
 */
Group.prototype.clear = function() {
  this.char('');
  return this;
}

/**
 * If text is specified:
 *   Writes the text in each subsequent cell. Does not 
 *   overwrite cells where the text does not reach
 *   returns a new grouping which only contains the cells 
 *   which something was written in
 * 
 * If text not specified:
 *   Gets the concatinated text of every cell. White space is
 *   not striped
 */
Group.prototype.text = function(content) {
  if (content === undefined) {
    content = '';
    this.cells.each(function(i, cell) {
      content += $(cell).text();
    });
    return content;
  } else {
    var selection = $();
    this.cells.each(function(i, cell) {
      var char = content[i]
      $(cell).text(char);
      if (char !== undefined)
        selection = selection.add(cell);
    });
    return new Group(selection);
  }
}

/**
 * Same as text() but will center the text and will strip 
 * white space characters before returning
 */
Group.prototype.centerText = function(content) {
  if (content === undefined) {
    return $.trim(this.text())
  } else {
    var offset = Math.floor((this.cells.length - content.length) / 2);
    var textSelection = $();
    this.cells.each(function(i, cell) {
      var char = content[i-offset];
      $(cell).text(char);
      if (char !== undefined)
        textSelection = textSelection.add(cell);
    });
    return new Group(textSelection);
  }
}

/** Adds a listener to the Up button */
function onButtonUp(listener) {
  $('#up').click(listener);
}

/** Adds a listener to the Down button */
function onButtonDown(listener) {
  $('#down').click(listener);
}

/** Adds a listener to the Right button */
function onButtonRight(listener) {
  $('#right').click(listener);
}

/** Adds a listener to the Left button */
function onButtonLeft(listener) {
  $('#left').click(listener);
}

/** Adds a listener to the A button */
function onButtonA(listener) {
  $('#a').click(listener);
}

/** Adds a listener to the B button */
function onButtonB(listener) {
  $('#b').click(listener);
}

/* reserved for going to the main menu */
//function onButtonStart(listener) {
//  $('#start').click(listener);
//}

/** Adds a listener to the select button */
function onButtonSelect(listener) {
  $('#select').click(listener);
}

/**
 * Writes the multiline text with the top left
 * corner at position (x,y).
 * The text can be either a string with linebreaks
 * or an array of strings.
 * Returns a group of the cells which text was written to
 */
function writeText(x, y, text) {
	var textArray;
	if (text.constructor == Array)
		textArray = text;
	else
		textArray = text.split(/\n/);
	var group = empty();
	for (var i = 0; i < textArray.length; i++) {
	  var line = textArray[i];
		var writting = row(y).not(col(0, x-1)).text(line);
		group = group.add(writting);
		y++;
	}
	return group;
}

/**
 * Fetches the raw text out of a file asyncrously.
 * If there is an error reading the text file, an
 * empty string will be passed to the callback.
 * 
 * The file path is relative to the HTML file loaded
 * The callback should be a function which accepts a
 * single string as an argument
 * 
 * returns nothing
 */
function loadText(file, callback) {
	$.ajax({
    url: file,
    dataType: "text"
  }).done(function(data) {
    callback(data);
  })
  .fail(function() {
    callback('');
  });
}

var generateGrid = function() {
  var window = $('#game-window');
  for (var j = 0; j < HEIGHT; j++) {
    var row = $('<div></div>'); 
    for (var i = 0; i < WIDTH; i++) {
      var cell = $('<span></span>');
      cell.attr('id', 'cell-' + i + 'x' + j);
      cell.addClass('row-'+j);
      cell.addClass('col-'+i);
      cell.addClass('cell');
      cell.data('x', i);
      cell.data('y', j);
      row.append(cell);
    }
    window.append(row);
  }
}

var setupKeyCodes = function() {
  $(document).keydown(function(event) {
    if (event.key == 'ArrowUp')
      $('#up').trigger('click');
    if (event.key == 'ArrowDown')
      $('#down').trigger('click');
    if (event.key == 'ArrowLeft')
      $('#left').trigger('click');
    if (event.key == 'ArrowRight')
      $('#right').trigger('click');
    if (event.key == 'Enter')
      $('#a').trigger('click');
    if (event.key == 'Shift')
      $('#a').trigger('click');
    if (event.key == 'Control')
      $('#b').trigger('click');
  });
  
  $('#start').click(function() {
    window.location.href = 'index.html';
  });
}

$(function() {
  generateGrid();
  setupKeyCodes();
});
