const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    company:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("addCompany", companySchema)