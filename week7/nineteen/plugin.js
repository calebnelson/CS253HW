const words1 = require("./words1")
const words2 = require("./words2")
const frequencies1 = require("./frequencies1")
const frequencies2 = require("./frequencies2")
const printer1 = require("./printer1")
const printer2 = require("./printer2")

// to change which option the plugin chooses, simply change
// words1 to words2 or vice versa,
// frequencies1 to frequencies2 or vice versa,
// or printer1 to printer2 or vice versa
module.exports = {
    words: words2,
    frequencies: frequencies2,
    printer: printer2,
}