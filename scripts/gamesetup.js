// This file asks as the link between the game core and 
// the html/css code

"use strict";

const WIDTH = 40;
const HEIGHT = 30;

/**
 * Selects every cell
 */
function grid() {
  return new Group($('.cell'));
}

/**
 * If x2 specified:
 *   Selects all rows between y1 (inclusive) and y2 (exclusive)
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
    for (let i = y1+1; i < y2; i++) {
      selection = selection.add('.row-' + i);
    }
    return new Group(selection);
  }
}

/**
 * If x2 specified:
 *   Selects all columns between x1 (inclusive) and x2 (exclusive)
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
    for (let i = x1+1; i < x2; i++) {
      selection = selection.add('.col-' + i);
    }
    return new Group(selection);
  }
}

/*
 * Selects a single cell
 */
function cell(x, y) {
  return new Group($('#cell-' + x + 'x' + y));
}

var Group = function(cells) {
  this.cells = cells;
}

/**
 * Gets the union of the selections
 * returns this
 */
Group.prototype.add = function(group) {
  this.cells = this.cells.filter(group.cells);
  return this;
}

/**
 * Removes the other group from this group
 * returns this 
 */
Group.prototype.not = function(group) {
  this.cells = this.cells.not(group.cells);
  return this;
}

/**
 * Removes all cells except those that are in both groups
 */
Group.prototype.intersect = function(group) {
  this.cells = this.cells.filter(group.cells);
  return this;
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

function onButtonUp(listener) {
  $('#up').click(listener);
}

function onButtonDown(listener) {
  $('#down').click(listener);
}

function onButtonRight(listener) {
  $('#right').click(listener);
}

function onButtonLeft(listener) {
  $('#left').click(listener);
}

function onButtonA(listener) {
  $('#a').click(listener);
}

function onButtonB(listener) {
  $('#b').click(listener);
}

/* reserved for going to the main menu */
//function onButtonStart(listener) {
//  $('#start').click(listener);
//}

function onButtonSelect(listener) {
  $('#select').click(listener);
}

var generateGrid = function() {
  var window = $('#game-window');
  for (let j = 0; j < HEIGHT; j++) {
    let row = $('<div></div>'); 
    for (let i = 0; i < WIDTH; i++) {
      let cell = $('<span></span>');
      cell.attr('id', 'cell-' + i + 'x' + j);
      cell.addClass('row-'+j);
      cell.addClass('col-'+i);
      cell.addClass('cell');
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
  });
  
  $('#start').click(function() {
    window.location.href = 'index.html';
  });
}

$(function() {
  generateGrid();
  
  setupKeyCodes();
});