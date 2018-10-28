const fs = require("fs");

const extract_words = (obj, path_to_file) => {
    const book = fs.readFileSync(process.argv[2], 'utf8').toLowerCase();
    obj.data = book.split(/[^a-zA-Z]/);
    return obj;
}

const load_stop_words = (obj) => {
    const stop_words = fs.readFileSync("../stop_words.txt", 'utf8').toLowerCase();
    obj.stop_words = stop_words.split(/[^a-zA-Z]/);
    return obj;
}

const increment = (obj, word) => {
    if (obj.word_freqs === undefined){
        obj.word_freqs = {};
    }
    if (obj.word_freqs[word] === undefined){
        obj.word_freqs = {
            ...obj.word_freqs,
            [word]: 1
        }
    }
    else{
        obj.word_freqs[word] = obj.word_freqs[word] + 1
    }
    return obj;
}

const dataStorage = {
    data: [],
    init: (path_to_file) => extract_words(dataStorage, path_to_file),
}

const stopWords = {
    stop_words: [],
    init: () => load_stop_words(stopWords),
    is_stop_word: (word) => {
        return stopWords.stop_words.includes(word);
    }
}

const wordFreq = {
    word_freqs: {},
    increment: (word) => increment(wordFreq, word),  
    sorted: () => {
        return Object.keys(wordFreq.word_freqs).map(
            key => { return { key: key, value: wordFreq.word_freqs[key] }; }
        ).sort((p1, p2) => p2.value - p1.value);
    },
    top25: () => {
        Object.keys(wordFreq.word_freqs).map(
            key => { return { key: key, value: wordFreq.word_freqs[key] }; }
        ).sort((p1, p2) => p2.value - p1.value).slice(0, 25).map(word => {
          console.log(word.key.concat(" - ").concat(word.value));
        });
    }
}

dataStorage.init(process.argv[2]);
stopWords.init();

dataStorage.data.map(w => {
    if (!stopWords.is_stop_word(w) && w.length > 1){
        wordFreq.increment(w);
    }
})

wordFreq.top25();