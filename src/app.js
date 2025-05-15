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
app.use(express.json());
app.use(cookieParser());

//adding new user
app.post("/signUp", async (req,res) => {

    
try{
//validation of data
validateSignUpData(req);
//encrypt the password
const {password} = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
req.body.password = hashedPassword;
console.log(req.body);
const user = new User(req.body);

await user.save(); 
res.send("user saved successfully");
} catch (err) {
res.status(400).send("error occured while saving the user: "+ err);
}
})

//logging the user

app.post("/login", async(req,res)=> {

    try{
    const {emailId,password} = req.body;
    if(!emailId || !password){
        throw new Error("emailid and password is mandatory");
    }
    const userObject = await User.findOne({emailId: emailId});
    if(!userObject){
        throw new Error("Invalid credentials");
    }
    const isValidPasword = bcrypt.compare(password, userObject.password);
    if(isValidPasword){
        const token = createJwtToken(userObject._id);
        res.cookie("token", token,{
            expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
          });
        res.send("user logged in successfully");
    }else{
        throw new Error("Invalid credentials");
    }
} catch (err) {
    res.status(400).send("error while logging in: "+ err);
    }
})

//getting users for matched filter
app.get("/user", userAuth, async (req,res) => {
const userEmail = req?.body?.emailId;

try{
const users = await User.find({emailId: userEmail});
if(users.length ===0){
res.status(404).send("User not found");
} else{
res.send(users);
}
} catch(err) {
res.status(500).send("Something went wrong");
}

})

app.get("/profile", userAuth,async (req,res) => {
    const userEmail = req?.body?.emailId;
    
    try{
    const cookies = req.cookies;
    console.log(cookies);
    const users = await User.find({emailId: userEmail});
    if(users.length ===0){
    res.status(404).send("User not found");
    } else{
    res.send(users);
    }
    } catch(err) {
    res.status(500).send("Something went wrong");
    }
    
    })

//getting all the users
app.get("/feed", async (req,res) => {

try {
const users = await User.find({});
res.send(users);
}catch(err) {
res.status(500).send("Something went wrong");
}
})

//delete the user
app.delete("/user", async (req,res) => {
const userId = req?.body?.userId;

try{
// await User.deleteOne({_id: userId});

await User.findByIdAndDelete(userId);
res.send("deleted successfully");
} catch(err) {
res.status(404).send("user not found");
}
})

//update the user
app.patch("/user/:userEmail",async (req,res) => {
const userEmail = req.params?.userEmail;
//const userEmail = req?.body?.emailId;
//console.log(req.body);
const data = req.body;

try{
const ALLOWED_UPDATES = ["age", "phoneNumber", "gender", "photoURL", "skills", "bio"];

const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));

if(!isUpdateAllowed){
throw new Error("update not allowed!");
}

const updatedUser = await User.findOneAndUpdate({emailId: userEmail}, data,
    {returnDocument:'after',
    runValidators: true
});
//console.log(updatedUser);
res.send(updatedUser);
} catch(err) {
res.status(500).send("Unable to update the user: "+ err.message);
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
