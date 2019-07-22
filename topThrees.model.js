const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let topThreesRecord = new Schema({
    name:{
        type:String,
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
    }
});

module.exports = mongoose.model('topThreesRecord',topThreesRecord);