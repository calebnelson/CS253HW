const fs = require("fs")

function* lines(filename){
    const book = fs.readFileSync(filename, 'utf8').toLowerCase().split('\n');
    for (line of book){
        yield line;
    }    
}

function* all_words(filename){
    let line_gen = lines(filename)
    let line = { done: false }
    while (!line.done){
        line = line_gen.next()
        if (line.value){
            for (word of line.value.split(/[^a-zA-Z]/)){
                yield word;
            }
        }
    }
}

function* non_stop_words(filename){
    stop_words = fs.readFileSync('../stop_words.txt', 'utf8').toLowerCase().split(",");
    let all_words_gen = all_words(filename);
    let words = { done: false };
    let word = "a";
    while (!words.done){
        words = all_words_gen.next();
        word = words.value;
        if (word && word.length > 1 && !stop_words.includes(word)){
            yield word;
        }
    }
}

function* count_and_sort(filename){
    let freqs = {};
    let nsw_gen = non_stop_words(filename);
    let nsw = { done: false }
    let word = "";
    while (!nsw.done){
        nsw = nsw_gen.next();
        word = nsw.value;
        if (freqs[word] === undefined){
          freqs = {
            ...freqs,
            [word]: 1
          };
        }
        else{
          freqs[word] = freqs[word] + 1
        }
    }
    yield Object.keys(freqs).map(key => {
      return { key: key, value: freqs[key] };
    }).sort((p1, p2) => p2.value - p1.value)
}

let sorted_data = count_and_sort(process.argv[2]).next().value
console.log(sorted_data.slice(0,25).map(word => {
  return(word.key.concat(" - ").concat(word.value));
}))