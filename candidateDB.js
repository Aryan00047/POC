require("dotenv").config();
const connectDB = require('./db/connect.js');
const candidateSignUp = require("./models/candidate/register.js");
const candidateSignUpJson = require("./candidateSignUp.json")

const start = async() => {
    try{
        await connectDB(process.env.MONGODB_URL);
        console.log("connected to DB");
        await candidateSignUp.create(candidateSignUpJson);
        console.log(candidateSignUpJson)
        console.log("Success");
    }catch(error){
        console.log("Error:",error.message);
        console.log(error);
    }
}

start()