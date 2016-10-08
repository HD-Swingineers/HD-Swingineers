// Test gamesetup.js

// Test grid generation code

QUnit.test("Cells generated with ids", function(assert) {
  var cell = document.getElementById('cell-4x5');
  assert.ok(cell != null);
});

QUnit.test("Cells generated with classes", function(assert) {
  var cell = $('#cell-4x5');
  assert.ok(cell.hasClass('row-5'));
  assert.ok(cell.hasClass('col-4'));
});

QUnit.test("Cells have coord data set", function(assert) {
  var cell = $('#cell-5x7');
  
  assert.equal(cell.data('x'), 5)
  assert.equal(cell.data('y'), 7)
});

QUnit.test("Grid generated to correct size", function(assert) {
  var cell1 = document.getElementById('cell-0x0');
  var cell2 = document.getElementById('cell-'+(WIDTH-1)+'x'+(HEIGHT-1));
  var cell3 = document.getElementById('cell-'+WIDTH+'x'+HEIGHT);
  // these two should be inside
  assert.ok(cell1 != null);
  assert.ok(cell2 != null);
  // this one should be outside
  assert.ok(cell3 == null);
});

// Test selection code

QUnit.test("Cell selection correct", function(assert) {
  var group = cell(5, 7);
  
  assert.equal(group.size(), 1)
  assert.equal(group.x(), 5)
  assert.equal(7, group.y())
});

QUnit.test("Row selection correct", function(assert) {
  var group = row(5);
  
  assert.equal(group.size(), WIDTH)
  group.each(function(cell) {
    assert.equal(cell.y(), 5)
  });
});

QUnit.test("Col selection correct", function(assert) {
  var group = col(5);
  
  assert.equal(group.size(), HEIGHT)
  group.each(function(cell) {
    assert.equal(cell.x(), 5)
  });
});

QUnit.test("Entire grid is selected", function(assert) {
  var group = grid();
  assert.equal(group.size(), HEIGHT*WIDTH)
});

QUnit.test("Empty selection selects nothing", function(assert) {
  var group = empty();
  assert.equal(group.size(), 0)
});

QUnit.test("Multi row selector", function(assert) {
  // should select rows 3, 4 and 5
  var group = row(3, 5);
  assert.equal(group.size(), WIDTH * 3)
});

QUnit.test("Multi col selector", function(assert) {
  // should select cols 3, 4 and 5
  var group = col(3, 5);
  assert.equal(group.size(), HEIGHT * 3)
});

// Test combination selections

QUnit.test("Add non intersecting selections", function(assert) {
  var cell1 = cell(1, 2);
  var cell2 = cell(3, 5);
  var combined = cell1.add(cell2);
  
  // should not modify cell1 or cell2
  assert.equal(cell1.size(), 1)
  assert.equal(cell2.size(), 1)
  
  // combined group should have both
  assert.equal(combined.size(), 2)
});

QUnit.test("Add intersecting selections", function(assert) {
  var r = row(3);
  var c = col(5);
  var combined = r.add(c);
  
  // combined group should have both but -1 because of
  // the overlapping cell
  assert.equal(combined.size(), WIDTH + HEIGHT - 1)
});

QUnit.test("Add keeps groups immutable", function(assert) {
  var cell1 = cell(1, 2);
  var cell2 = cell(3, 5);
  cell1.add(cell2);
  
  // should not modify cell1 or cell2
  assert.equal(cell1.size(), 1)
  assert.equal(cell2.size(), 1)
});

QUnit.test("Not removes cells", function(assert) {
  var r = row(4);
  var notified = r.not(cell(7, 4));
  
  assert.equal(r.size(), WIDTH)
  assert.equal(notified.size(), WIDTH-1)
});

QUnit.test("Intersect gets intersection", function(assert) {
  var rows = row(4, 5);
  var cols = col(2, 3);
  
  var intersect = rows.intersect(cols);
  
  assert.equal(rows.size(), WIDTH*2)
  assert.equal(cols.size(), HEIGHT*2)
  assert.equal(intersect.size(), 4)
});

// Test setting/getting commands
QUnit.test("Text color", function(assert) {
  var c = cell(4, 5);
  grid().color('rgb(1, 2, 3)')
  c.color('rgb(10, 20, 30)');
  
  assert.equal(cell(4,5).color(), 'rgb(10, 20, 30)')
  assert.equal(cell(3,5).color(), 'rgb(1, 2, 3)')
});

QUnit.test("Back color", function(assert) {
  var c = cell(4, 5);
  grid().back('rgb(1, 2, 3)')
  c.back('rgb(10, 20, 30)');
  
  assert.equal(cell(4,5).back(), 'rgb(10, 20, 30)')
  assert.equal(cell(3,5).back(), 'rgb(1, 2, 3)')
});

QUnit.test("Set character", function(assert) {
  var c = cell(4, 5);
  grid().char('a')
  c.char('b');
  
  assert.equal(cell(4,5).char(), 'b')
  assert.equal(cell(3,5).char(), 'a')
});

QUnit.test("Set text", function(assert) {
  grid().char('');
  var cells = cell(4, 5).add(cell(5, 5)).add(cell(6, 5));
  var group = cells.text('ab');
  
  assert.equal(cell(4,5).text(), 'a')
  assert.equal(cell(5,5).text(), 'b')
  assert.equal(cell(6,5).text(), '')
  assert.equal(group.size(), 2)
});

QUnit.test("Set centered text", function(assert) {
  grid().char('');
  var cells = row(3);
  var group = cells.centerText('123');
  
  assert.equal(cell(Math.floor(WIDTH/2)-2,3).text(), '1')
  assert.equal(cell(Math.floor(WIDTH/2)-1,3).text(), '2')
  assert.equal(cell(Math.floor(WIDTH/2)-0,3).text(), '3')
  assert.equal(group.size(), 3)
});

QUnit.test("Loop through each cell", function(assert) {
  var group = row(2);
  var index = 0;
  group.each(function(cell, x, y) {
    assert.equal(x, index);
    assert.equal(y, 2);
    assert.equal(cell.x(), x);
    assert.equal(cell.y(), y);
    index++;
  });
});

QUnit.test('Test write multiline', function(assert) {
  var group = writeText(3, 5, 'Hello\nWorld');
  assert.equal(cell(3,5).char(), 'H');
  assert.equal(cell(4,5).char(), 'e');
  
  assert.equal(cell(3,6).char(), 'W');
  assert.equal(cell(4,6).char(), 'o');
  
  assert.equal(group.size(), 10);
});
