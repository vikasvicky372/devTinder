//importing express 
const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");
//creating server from express
const app = express();

app.use(express.json());

app.post("/signUp", async (req,res) => {

console.log(req.body);
const user = new User(req.body);

try{
await user.save(); 
res.send("user saved successfully");
} catch (err) {
res.status(400).send("error occured while saving the user"+ err);
}
})

app.get("/user", async (req,res) => {
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
app.patch("/user",async (req,res) => {
    const userEmail = req?.body?.emailId;
    //console.log(req.body);

    try{
        const updatedUser = await User.findOneAndUpdate({emailId: userEmail}, req.body,{returnDocument:'after'});
        //console.log(updatedUser);
        res.send(updatedUser);
    } catch(err) {
        res.status(500).send("Unable to update the user");
    }
})

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
