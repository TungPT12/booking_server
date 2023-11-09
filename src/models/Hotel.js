const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Type"
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    photos: [{ type: String, required: true, }],
    desc: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    isDisable: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Hotel', hotelSchema);