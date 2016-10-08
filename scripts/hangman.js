// Code for hang man
$(function() {
  grid().clear().color('white').back('#111');
  
  // example of writting text loaded from a file
  loadText('scripts/hello.txt', function(text) {
      writeText(7, 5, text).color('red');
  });
  
  // hangman code goes here
  row(16).centerText('INSERT GAME HERE');

});
