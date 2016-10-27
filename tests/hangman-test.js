QUnit.test('underscore word', function(assert) {
  var word = 'Hello';
  
  var result = underscoreWord(word);
  
  assert.equal(result, '_____');
});

QUnit.test('remove letter', function(assert) {
  var word = 'Hello there';
  
  var result =  removeLetter(word, 'e');
  
  assert.equal(result, 'Hllo thr');
});

QUnit.test('count letter', function(assert) {
  var word = 'Hello there';
  
  var result =  countLetter(word, 'e');
  
  assert.equal(result, 3);
});

QUnit.test('remove underscores from word', function(assert) {
  var word     = 'Hello there';
  var part     = '__ll___h___';
  var expected = '_ell___he_e';
  
  var result = removeUnderscores(word, part, 'e');
  
  assert.equal(result, expected);
});
