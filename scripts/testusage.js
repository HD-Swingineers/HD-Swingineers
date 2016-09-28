// Testing/demonstration of grid functionallity.

$(function() {
  // select entire grid
  grid().char('').color('white').back('#212');

  // select multiple rows/cols
  row(6).char('H');
  col(20).char('|');
  col(5, 10).char('L');
  
  // select union of multiple selectors
  col(16).add(row(14)).color('red');
  cell(20, 20).add(cell(21, 20)).add(cell(21, 20)).text('01234');

  // remove one selection from another
  row(28).not(col(20, 28)).char('1');

  // get the intersection of two selections
  col(29).intersect(row(15)).char('5');
  
  // write text
  row(4).text('Look over here!');
  
  row(11, 16).clear().color('red');
  row(11).centerText('X~~~~~~~~~~~~~~~~~~~~~~~~X').back('black');
  row(12).centerText('{                        }').back('black');
  row(13).centerText('}                        {').back('black');
  row(14).centerText('{                        }').back('black');
  row(15).centerText('X~~~~~~~~~~~~~~~~~~~~~~~~X').back('black');
  row(13).centerText('The Swingineers!').color('white');
  
});
