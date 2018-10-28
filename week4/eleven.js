const fs = require("fs");

class DataStorageManager{
    constructor(){
        this.data = [];
    }
    
    init(path_to_file){
        const book = fs.readFileSync(process.argv[2], 'utf8').toLowerCase();
        this.data = book.split(/[^a-zA-Z]/);
    };
    
    dispatch(message){
        if (message[0] === "init"){
            return this.init(message[1]);
        }
        if (message[0] === "words"){
            return this.data;
        }
        return "Message not understood"
    }
}

class StopWordManager{
    constructor(){
        this.stop_words = []
    }
    
    init(){
        const stop_words = fs.readFileSync("../stop_words.txt", 'utf8').toLowerCase();
        this.stop_words = stop_words.split(/[^a-zA-Z]/);
    };
    
    is_stop_word(word){
        return this.stop_words.includes(word);
    }
    
    dispatch(message){
        if (message[0] === "init"){
            return this.init();
        }
        if (message[0] === "is_stop_word"){
            return this.is_stop_word(message[1]);
        }
        return "Message not understood"
    }
}

class WordFrequencyManager{
    constructor(){
        this.word_freqs = {}
    }
    
    increment(word){
        if (this.word_freqs[word] === undefined){
            this.word_freqs = {
                ...this.word_freqs,
                [word]: 1
            }
        }
        else{
            this.word_freqs[word] = this.word_freqs[word] + 1
        }
    }
    
    sorted(){
        return Object.keys(this.word_freqs).map(
            key => { return { key: key, value: this.word_freqs[key] }; }
        ).sort((p1, p2) => p2.value - p1.value);
    }
    
    dispatch(message){
        if (message[0] === "increment"){
            return this.increment(message[1]);
        }
        if (message[0] === "sorted"){
            return this.sorted();
        }
        return "Message not understood"
    }
}

class WordFrequencyController{
    init(path_to_file){
        this.dsm = new DataStorageManager();
        this.swm = new StopWordManager();
        this.wfm = new WordFrequencyManager();
        this.dsm.dispatch(["init", path_to_file]);
        this.swm.dispatch(["init"])
    }
    
    run(){
        this.dsm.dispatch(["words"]).map(w => {
            if (!this.swm.dispatch(["is_stop_word", w]) && w.length > 1){
                this.wfm.dispatch(["increment", w])
            }
        })
        const top_25 = this.wfm.dispatch(["sorted"]).slice(0, 25);
        console.log(top_25.map(word => {
          return(word.key.concat(" - ").concat(word.value));
        }))
    }
    
    dispatch(message){
        if (message[0] === "init"){
            return this.init(message[1]);
        }
        if (message[0] === "run"){
            return this.run();
        }
        return "Message not understood"
    }
}

const wfc = new WordFrequencyController();
wfc.dispatch(["init", process.argv[2]]);
wfc.dispatch(["run"])