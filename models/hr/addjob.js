const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    jobtype:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    package:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("addJob", jobSchema)