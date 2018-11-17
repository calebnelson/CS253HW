const top25 = (word_list) => {
    let freqs = {}
    for (word of word_list){
        freqs[word] = (freqs[word] || 0) + 1
    }
    return Object.keys(freqs).map(key => {
      return { key: key, value: freqs[key] };
    }).sort((p1, p2) => p2.value - p1.value).slice(0, 25);
}

module.exports = {
    top25
}