const fs = require("fs");

class TFQuarantine{
    constructor(func){
        this.funcs = [func];
    }
    
    bind(func){
        this.funcs.push(func);
    }
    
    execute(){
        let output = null
        for (let f of this.funcs){
            output = f(output);
        }
        console.log(output);
    }
}

const getInput = () => {
    return (() => process.argv[2]);
}

const extractWords = (path) => {
    return (() => fs.readFileSync(path(), 'utf8').toLowerCase().split(/[^a-zA-Z]/));
}

const removeStopWords = (wordList) => {
    return (() => {
        const stopWords = fs.readFileSync("../stop_words.txt", 'utf8').toLowerCase().split(/[^a-zA-Z]/);
        return wordList().filter(word => !stopWords.includes(word))
    });
}

const frequencies = (words) => {
    return (() => words().reduce((words, word) => {
      if (word.length > 1){
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
    }, {}))
}

const top25 = (wordFreqs) => {
    const wf = wordFreqs();
    return (Object.keys(wf).map(
        key => { return { key: key, value: wf[key] }; }
        ).sort((p1, p2) => p2.value - p1.value).slice(0,25).map(word => 
        word.key.concat(" - ").concat(word.value)))
}

const tf = new TFQuarantine(getInput);
tf.bind(extractWords);
tf.bind(removeStopWords);
tf.bind(frequencies);
tf.bind(top25);
tf.execute();