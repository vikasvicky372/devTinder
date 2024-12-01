//importing express 
const express = require("express");

//creating server from express
const app = express();

const {adminAuth,userAuth} = require("./middlewares/auth");

const data = {
    author: "Vikas Thulasi",
    app: "DevTinder"
}
//request handlers

// app.use("/hello", (req,res) => {
//     res.send("hello");
// });

// app.use("/hello2", (req,res) => {
//     res.send("hello2");
// });

// app.use("/hello/2", (req,res) => {
//     res.send("hello/2");
// });



// /user?userId=123  req.query = { userId: '1234' }
// /user?userId=1234&password=vikas   { userId: '1234', password: 'vikas' }
// app.get("/user",(req,res) => {
//     console.log(req.query);
//     res.send("success");
// });
// //  /user/1234/vikas/pass   req.params = { userId: '1234', name: 'vikas', password: 'pass' }
// app.get("/user/:userId/:name/:password", (req,res) => {
//     console.log(req.params);
//     res.send(req.params);
// })

// app.get("/user",(req,res) => {
//     res.send(JSON.stringify(data));
// });

// app.post("/user",async (req,res) => {
//     const body =  req.body;
//     console.log(body);
//     res.send("success");
// })

// //any url that contains a  /cab , /cat , /ab , /aa , /a
// app.get(/a/, (req,res) => {
//     res.send("hello");
// });

// app.use("/",(req,res) => {
//     res.send("Hello from DevTinder");
// });


app.use("/admin",adminAuth);


app.get("/admin/getAllData", (req,res,next) => {
    res.send("All data returned");
});

app.get("/admin/deleteUser", (req,res,next) => {
    res.send("deleted a user");
});

app.get("/user", userAuth, (req,res) => {
    res.send("User data")
})

// listening to the incoming requests

app.listen(1234, () => {
    console.log("server is succesfully running on port 1234");
});