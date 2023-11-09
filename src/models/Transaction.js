const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Hotel'
    },
    rooms: [{ type: Number, required: true }],
    // rooms: [
    //     {
    //         roomId: {
    //             type: Schema.Types.ObjectId,
    //             required: true,
    //             ref: "Room"
    //         },
    //         roomName: {
    //             type: String,
    //             required: true
    //         },
    //         roomNumber: {
    //             type: Number,
    //             required: true
    //         },

    //     }
    // ],
    dateStart: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Transaction', roomSchema);