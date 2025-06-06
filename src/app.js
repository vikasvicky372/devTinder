
require("dotenv").config();
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
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
require("./utils/cronJob");
const {createServer} = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
//using the routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);



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

const server = createServer(app);
initializeSocket(server);


connectDB().then(()=>{
console.log("database connected succesfully")
server.listen(1234, () => {
console.log("server is succesfully running on port 1234");
});
}).catch(
err => {
console.log("database connection is not established..")
}
)

// listening to the incoming requests
