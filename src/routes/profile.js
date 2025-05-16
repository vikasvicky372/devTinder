
const express = require('express');

const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/profile", userAuth,async (req,res) => {
    
    try{
    const cookies = req.cookies;
    console.log(cookies);
    const user = req.user;
    res.send(user);
    } catch(err) {
    res.status(500).send("Something went wrong");
    }
    
    })
//delete the user
profileRouter.delete("/user", async (req,res) => {
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
profileRouter.patch("/user/:userEmail",async (req,res) => {
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
module.exports = profileRouter;