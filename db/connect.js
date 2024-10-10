const mongoose = require("mongoose");
// const { options } = require("../routes/candidates");

//const uri = <connection string> it is used in .env for security reasons

//%40 is url encoded for @. Since @ is a reserved character in a URI, it needs to be URL-encoded to avoid misinterpretation.

const connectDB = (uri) =>{
    // console.log("connect db");
    return mongoose.connect(uri, {});//useNewUrlparser and useUnifiedTopology are depriciate
};

module.exports = connectDB


















// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://aryan_2k1:<db_password>@poc.hf6zp.mongodb.net/?retryWrites=true&w=majority&appName=POC";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
