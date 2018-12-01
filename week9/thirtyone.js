const fs = require('fs');   
        
const partition = (data, numLines) => {
    const lines = data.split('\n');
    const result = [];
    for (let i = 0; i < lines.length; i = i + numLines) {
        let next = ' ';
        for (let y = i; y < i + numLines; y = y + 1) {
            if (lines[y]) {
                next = next.concat(lines[y]);
            }
        }
        result.push(next);
    }
    return result;
};
    
const splitWords = (data) => {
    const stopWords = fs.readFileSync('../stop_words.txt', 'utf8').toLowerCase().split(",");
    const wordList = data.toLowerCase().split(/[^a-zA-Z]/).filter(word => 
        !stopWords.includes(word) && word.length > 1
    );
    return wordList
};
    
const regroup = (listOfListOfWords) => {
    const mapping = {
        'a-e': [],
        'f-j': [],
        'k-o': [],
        'p-t': [],
        'u-z': []
    };
    listOfListOfWords.map(listOfWords => {
        listOfWords.map(word => {
            const firstLetter = word.charCodeAt(0);
            if (firstLetter >= 97 && firstLetter <= 101) {
                mapping['a-e'].push({[word]:0});
            }
            else if (firstLetter >= 102 && firstLetter <= 106) {
                mapping['f-j'].push({[word]:0});
            }
            else if (firstLetter >= 107 && firstLetter <= 111) {
                mapping['k-o'].push({[word]:0});
            }
            else if (firstLetter >= 112 && firstLetter<= 116) {
                mapping['p-t'].push({[word]:0});
            }
            else {
                mapping['u-z'].push({[word]:0});
            }
        });
    });
    return mapping;
};

const countWords = (mapping) => {
    return {
        'a-e': mapping['a-e'].length,
        'f-j': mapping['f-j'].length,
        'k-o': mapping['k-o'].length,
        'p-t': mapping['p-t'].length,
        'u-z': mapping['u-z'].length
    };
};

const data = fs.readFileSync(process.argv[2], 'utf8')
const partitionedData = partition(data, 200);
const splits = partitionedData.map(splitWords);
const splitsPerWord = regroup(splits);
const printMe = countWords(splitsPerWord);

console.log('a-e  -  '.concat(printMe['a-e']))
console.log('f-j  -  '.concat(printMe['f-j']))
console.log('k-o  -  '.concat(printMe['k-o']))
console.log('p-t  -  '.concat(printMe['p-t']))
console.log('u-z  -  '.concat(printMe['u-z']))