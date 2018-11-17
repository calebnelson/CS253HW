const fs = require('fs');

const extract_words = (path) => {
    const book = fs.readFileSync(path, 'utf8').toLowerCase().split("\n");
    const stop_words = fs.readFileSync('../../stop_words.txt', 'utf8').toLowerCase().split(",");
    const reducer = (list = [], line) => {
        for (word of line.split(/[^a-zA-Z]/)){
            if (!stop_words.includes(word) && word.length > 1){
                list.push(word)
            }
        }
        return list
    }
    return book.reduce(reducer, [])
}

module.exports = {
    extract_words
}