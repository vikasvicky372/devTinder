const mongoose = require("mongoose");

const connectDB = async ()  =>{
await mongoose.connect("mongodb+srv://vaddevaibhav8:uWODjKZ5MHFmldgH@namstenode.uetgi.mongodb.net/devTinder");
}

module.exports = {
    connectDB,
}
