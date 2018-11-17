const fs = require('fs');

const extract_words = (path) => {
    const book = fs.readFileSync(path, 'utf8').toLowerCase().split(/[^a-zA-Z]/);
    const stop_words = fs.readFileSync('../../stop_words.txt', 'utf8').toLowerCase().split(",");
    return book.filter(word => !stop_words.includes(word) && word.length > 1)
}

module.exports = {
    extract_words
}