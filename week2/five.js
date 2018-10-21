const read_data = (full_path) => {
  // create the file reader
  const fs = require('fs');
  require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };
  book = fs.readFileSync(full_path.concat('pride-and-prejudice.txt'), 'utf8').toLowerCase().split(/[^a-zA-Z]/);
  stop_words = fs.readFileSync(full_path.concat('stop_words.txt'), 'utf8').toLowerCase().split(",");
  return {book, stop_words}
}

const create_word_map = () => {
  const data = read_data("./");
  return data.book.reduce((words, word) => {
    if (!(data.stop_words.includes(word)) && word.length > 1){
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
  const words = create_word_map();
  return Object.keys(words).map(key => {
    return { key: key, value: words[key] };
  }).sort((p1, p2) => p2.value - p1.value);
}

const print_top_N = n => {
  const top_words = create_top_words();
  console.log(top_words.slice(0, n).map(word => {
    return(word.key.concat(" - ").concat(word.value));
  }));
}

module.exports = () => {
  print_top_N(25);
}