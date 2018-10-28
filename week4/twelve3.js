const fs = require("fs");

const extract_words = (obj, path_to_file) => {
    const book = fs.readFileSync(process.argv[2], 'utf8').toLowerCase();
    obj["data"] = book.split(/[^a-zA-Z]/);
}

const load_stop_words = (obj) => {
    const stop_words = fs.readFileSync("../stop_words.txt", 'utf8').toLowerCase();
    obj["stop_words"] = stop_words.split(/[^a-zA-Z]/);
}

const increment = (obj, word) => {
    if (obj["word_freqs"] === undefined){
        obj["word_freqs"] = {};
    }
    obj['word_freqs'][word] = obj['word_freqs'][word] === undefined ? 1 : obj['word_freqs'][word] + 1;
}

const dataStorage = {
    data: [],
    init: (path_to_file) => extract_words(this, path_to_file),
    words: () => {
        return this['data'];
    }
}

const stopWords = {
    stop_words: [],
    init: () => load_stop_words(this),
    is_stop_word: (word) => {
        return this["stop_words"].includes(word);
    }
}

const wordFreq = {
    word_freqs: {},
    increment: (word) => increment(this, word),  
    sorted: () => {
        return Object.keys(this.word_freqs).map(
            key => { return { key: key, value: this.word_freqs[key] }; }
        ).sort((p1, p2) => p2.value - p1.value);
    }
}

dataStorage.init.bind(dataStorage, process.argv[2])();
stopWords.init.bind(stopWords)();

dataStorage.words.bind(dataStorage)().map(w => {
    if (!stopWords.is_stop_word(w) && w.length > 1){
        wordFreq.increment(w);
    }
})

const top_25 = wordFreq.sorted.bind(wordFreq)().slice(0, 25);
console.log(top_25.map(word => {
  return(word.key.concat(" - ").concat(word.value));
}))