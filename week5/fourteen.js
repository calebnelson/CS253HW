const fs = require("fs");

class WordFrequencyFramework{
    constructor(){
        this.load = [];
        this.doWork = [];
        this.end = [];
    }
    
    addLoadEvent(func){
        this.load.push(func);
    }
    
    addDoWorkEvent(func){
        this.doWork.push(func);
    }
    
    addEndEvent(func){
        this.end.push(func);
    }
    
    run(path){
        this.load.map(f => f(path));
        this.doWork.map(f => f());
        this.end.map(f => f());
    }
}

class DataStorage{
    constructor(){
        this.data = []
        this.stopWordFilter = null
        this.wordEvents = []
    }
    
    load(path){
        const book = fs.readFileSync(path, 'utf8').toLowerCase();
        this.data = book.split(/[^a-zA-Z]/);
    }
    
    produceWords(){
        this.data.map(w => {
            if (!this.stopWordFilter.isStopWord(w) && w.length > 1){
                this.wordEvents.map(f => f(w));
            }
        })
    }
    
    addWordEvent(func){
        this.wordEvents.push(func);
    }
    
    init(wf, swf){
        this.stopWordFilter = swf;
        wf.addLoadEvent(this.load.bind(this))
        wf.addDoWorkEvent(this.produceWords.bind(this))
    };
}

class StopWordFilter{
    constructor(){
        this.stopWords = []
    }
    
    init(wf){
        wf.addLoadEvent(this.load.bind(this));
    }
    
    load(){
        const stop_words = fs.readFileSync("../stop_words.txt", 'utf8').toLowerCase();
        this.stopWords = stop_words.split(/[^a-zA-Z]/);
    }
    
    isStopWord(word){
        return this.stopWords.includes(word);
    }
}

class WordFrequencyCounter{
    constructor(){
        this.wordFreqs = {}
    }
    
    init(wf, ds){
        ds.addWordEvent(this.increment.bind(this))
        wf.addEndEvent(this.printFreqs.bind(this))
    }
    
    increment(word){
        if (this.wordFreqs[word] === undefined){
            this.wordFreqs = {
                ...this.wordFreqs,
                [word]: 1
            }
        }
        else{
            this.wordFreqs[word] = this.wordFreqs[word] + 1
        }
    }
    
    printFreqs(){
        console.log(Object.keys(this.wordFreqs).map(
            key => { return { key: key, value: this.wordFreqs[key] }; }
            ).sort((p1, p2) => p2.value - p1.value).slice(0,25).map(word => 
            word.key.concat(" - ").concat(word.value)))
    }
}

class zCounter{
    constructor(){
        this.wordFreqs = []
    }
    
    init(wf, ds){
        ds.addWordEvent(this.increment.bind(this))
        wf.addEndEvent(this.printFreqs.bind(this))
    }
    
    increment(word){
        if (word.indexOf("z") > -1 && !this.wordFreqs.includes(word)){
            this.wordFreqs.push(word)
        }
    }
    
    printFreqs(){
        console.log(this.wordFreqs)
    }
}

const wf = new WordFrequencyFramework();
const swf = new StopWordFilter();
swf.init(wf);

const ds = new DataStorage();
ds.init(wf, swf);

const wfc = new WordFrequencyCounter();
wfc.init(wf, ds);

const z = new zCounter();
z.init(wf, ds);

wf.run(process.argv[2])