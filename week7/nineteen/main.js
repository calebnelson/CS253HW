const plugin = require("./plugin")

//load plugins
const words = plugin.words
const frequencies = plugin.frequencies
const printer = plugin.printer

printer.print(frequencies.top25(words.extract_words(process.argv[2])))