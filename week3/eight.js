const fs = require('fs');

const read_file = (full_path, func) => {
  // create the file reader
  require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };
  const data = fs.readFileSync(full_path, 'utf8')
  func(data, remove_stop_words)
}

const filter_book = (str_data, func) => {
  func(str_data.toLowerCase().split(/[^a-zA-Z]/), frequencies)
}

const remove_stop_words = (word_list, func) => {
  const stop_words = fs.readFileSync('./stop_words.txt', 'utf8').toLowerCase().split(",")
  func(word_list.filter(word => !stop_words.includes(word) && word.length > 1), sort)
}

const frequencies = (word_list, func) => {
  const wf = word_list.reduce((wf, word) => {
    if (wf[word] === undefined){
      wf = {
        ...wf,
        [word]: 1
      };
    }
    else{
      wf[word] = wf[word] + 1
    }
    return wf
  })
  func(wf, print_text)
}

const sort = (wf, func) => {
  func(Object.keys(wf).map(key => {
    return { key: key, value: wf[key] };
  }).sort((p1, p2) => p2.value - p1.value), no_op);
}

const print_text = (wf, func) => {
  console.log(wf.slice(1, 26).map(word => {
    return(word.key.concat(" - ").concat(word.value));
  }));
}

const no_op = (func) => {
  return
}

module.exports = () => {
  read_file("./pride-and-prejudice.txt", filter_book)
}