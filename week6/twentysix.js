const fs = require("fs")

const all_words = [null, null]
const stop_words = [null, null]
const non_stop_words = [null, () => {
    return all_words[0].filter(word => word.length > 1 && !stop_words[0].includes(word))
}]

const counts = [null, () => {
    return non_stop_words[0].reduce((words, word) => {
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
}]

const sorted_data = [null, () => {
   return Object.keys(counts[0]).map(key => {
      return { key: key, value: counts[0][key] };
    }).sort((p1, p2) => p2.value - p1.value)
}]

const all_columns = [all_words, stop_words, non_stop_words, counts, sorted_data]

all_columns[0][0] = fs.readFileSync(process.argv[2], 'utf8').toLowerCase().split(/[^a-zA-Z]/);
all_columns[1][0] = fs.readFileSync('../stop_words.txt', 'utf8').toLowerCase().split(",");

all_columns.map(c => {
    if (c[1]){
        c[0] = c[1]()
    }
})

console.log(sorted_data[0].slice(0,25).map(word => {
  return(word.key.concat(" - ").concat(word.value));
}))