const mongoose = require('mongoose');
// const uri = 'mongodb+srv://TungPT:BoyPham1204@mongodbdemo.yxxsulj.mongodb.net/booking_project?retryWrites=true&w=majority';
const uri = 'mongodb+srv://TungPT:BoyPham1204@mongodb.y8qiteb.mongodb.net/booking_project?retryWrites=true&w=majority'

const connectMongo = (callback) => {
    mongoose.connect(uri).then(() => {
        callback();
    }).catch((error) => {
        console.log(error)
        throw "Error connect mongoose"
    })
}

module.exports = connectMongo;