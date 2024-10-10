const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    hrId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the HR model
        required: true,
        ref: 'Job' // Change 'HR' to your actual HR model name if different
    },
    company:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    jobDescription:{
        type: String,
        required: true
    },
    experienceRequired:{
        type: String,
        required: true
    },
    package:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("addJob", jobSchema)