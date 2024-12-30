const mongoose = require("mongoose")

const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("CANDIDATE", candidateSchema)