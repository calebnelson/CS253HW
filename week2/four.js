// create the file reader
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

global.book = []
global.stop_words = []
global.words = {}
global.top_words = []

const read_book = (full_path) => {
  book = fs.readFileSync(full_path, 'utf8').toLowerCase().split(/[^a-zA-Z]/);
}

const read_stop_words = () => {
  stop_words = fs.readFileSync('../stop_words.txt', 'utf8').toLowerCase().split(",");
}

const create_word_map = () => {
  words = book.reduce((words, word) => {
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
}

const create_top_words = () => {
  top_words = Object.keys(words).map(key => {
    return { key: key, value: words[key] };
  }).sort((p1, p2) => p2.value - p1.value);
}

const print_top_N = n => {
  console.log(top_words.slice(0, n).map(word => {
    return(word.key.concat(" - ").concat(word.value));
  }));
}

read_book(process.argv[2]);
read_stop_words();
create_word_map();
create_top_words();
print_top_N(25);