const fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const book_string = fs.readFileSync(path.resolve('.', 'pride-and-prejudice.txt'), 'utf8').toLowerCase();
const book = book_string.split(/[^a-zA-Z]/);

const stop_words_string = fs.readFileSync(path.resolve('.', 'stop_words.txt'), 'utf8').toLowerCase();
const stop_words = stop_words_string.split(",");

const words = book.reduce((words, word) => {
  if (!(stop_words.includes(word)) && word.length > 1){
    if (words[word] === undefined){
      words = {
        ...words,
        [word]: 1
      };
    }
    else{
      words[word] = words[word] + 1
    }
  }
  return words
}, {})

const top_25 = Object.keys(words).map(key => {
  return { key: key, value: words[key] };
}).sort((p1, p2) => p2.value - p1.value).slice(0, 25);

top_25.map(word => {
  return(word.key.concat(" - ").concat(word.value));
})
