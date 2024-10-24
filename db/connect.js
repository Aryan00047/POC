const mongoose = require("mongoose");
// const { options } = require("../routes/candidates");

//const uri = <connection string> it is used in .env for security reasons

//%40 is url encoded for @. Since @ is a reserved character in a URI, it needs to be URL-encoded to avoid misinterpretation.

const connectDB = (uri) =>{
    // console.log("connect db");
    return mongoose.connect(uri, {});//useNewUrlparser and useUnifiedTopology are depriciate
};

module.exports = connectDB