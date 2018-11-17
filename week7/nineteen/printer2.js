const print = (word_freqs) => {
    for (pair of word_freqs) {
        console.log(pair.key.concat(" - ").concat(pair.value));
    }
}

module.exports = {
    print
}