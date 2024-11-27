//importing express 
const express = require("express");

//creating server from express
const app = express();

const data = {
    author: "Vikas Thulasi",
    app: "DevTinder"
}
//request handlers

app.use("/user",(req,res) => {
    res.send(JSON.stringify(data));
});

app.use("/",(req,res) => {
    res.send("Hello from DevTinder");
});

// listening to the incoming requests

app.listen(1234, () => {
    console.log("server is succesfully running on port 1234");
});