const plugin = require("./plugin")

const words = plugin.words
const frequencies = plugin.frequencies
const word_freqs = frequencies.top25(words.extract_words(process.argv[2]))

console.log(word_freqs.map(word => {
  return(word.key.concat(" - ").concat(word.value));
}))