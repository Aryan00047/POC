require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json()); // To parse incoming JSON requests

const connectDB = require("./db/connect.js");

const PORT = process.env.PORT || 5000;

const candidates_routes = require("./routes/candidates");

app.get("/",(req,res)=>{
    res.send("Server Connected")
}); 

//middleware or to set router
app.use("/api/candidates", candidates_routes); 

const start = async () => {
    try{
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () =>{
           console.log(` Connected server at ${PORT}`);
        })
    }
    catch(error){
        console.log(error)
    }
};

start();