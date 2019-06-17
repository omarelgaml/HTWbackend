const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Record = new Schema({
    name:{
        type:String,
        required:true,        
    },
    grade:{
        type:Number,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    seconds:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Record',Record);