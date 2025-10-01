const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
       type:String,
       trim:true,
       unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);