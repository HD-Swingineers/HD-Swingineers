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
    // TODO
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
  return new Group($('.col-' + x1));
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
 * If text is specified:
 *   Writes the text in each subsequent cell (pads end with
 *   white space if needed)
 *   returns this
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
    this.cells.each(function(i, cell) {
      $(cell).text(content[i]);
    });
    return this;
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
    this.cells.each(function(i, cell) {
      $(cell).text(content[i-offset]);
    });
    return this;
  }
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
      
      cell.text(' ');
      
      row.append(cell);
    }
    window.append(row);
  }
  
  grid().char('').color('white').back('#212');
  row(5).centerText('Hello World!');
  
  col(8).char('B');
}

$(function() {
  generateGrid();
});
