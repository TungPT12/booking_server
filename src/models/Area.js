const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const areaSchema = new Schema({
    name: { type: String, require: true },
    backgroundImage: { type: String, require: false },
})

module.exports = mongoose.model('Area', areaSchema);