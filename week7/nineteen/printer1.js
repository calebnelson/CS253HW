const print = (word_freqs) => console.log(word_freqs.map(word => {
  return(word.key.concat(" - ").concat(word.value));
}))

module.exports = {
    print
}