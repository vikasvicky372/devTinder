//importing express 
const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
//creating server from express
const app = express();
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const {createJwtToken} = require("./utils/jwtToken");
const { userAuth } = require("./middlewares/auth");
const user = require("./models/user");
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

//using the routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



//getting all the users
app.get("/feed", async (req,res) => {

try {
const users = await User.find({});
res.send(users);
}catch(err) {
res.status(500).send("Something went wrong");
}
})

//getting only one user
app.get("/oneUser", async (req,res) => {
const userEmail = req?.body?.emailId;

try{
const user = await User.findOne({emailId: userEmail});

res.send(user);

} catch(err) {
res.status(500).send("Something went wrong");
}

})

connectDB().then(()=>{
console.log("database connected succesfully")
app.listen(1234, () => {
console.log("server is succesfully running on port 1234");
});
}).catch(
err => {
console.log("database connection is not established..")
}
)

// listening to the incoming requests
