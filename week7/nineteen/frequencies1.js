const top25 = (word_list) => {
    const freqs = word_list.reduce((words, word) => {
        if (words[word] === undefined){
          words = {
            ...words,
            [word]: 1
          };
        }
        else{
          words[word] = words[word] + 1
        }
        return words
    }, {})
    return Object.keys(freqs).map(key => {
      return { key: key, value: freqs[key] };
    }).sort((p1, p2) => p2.value - p1.value).slice(0, 25);
}

module.exports = {
    top25
}