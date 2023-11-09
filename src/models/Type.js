const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const typeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: { type: String, require: false },
});

module.exports = mongoose.model('Type', typeSchema);