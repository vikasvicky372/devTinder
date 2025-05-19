
const express = require('express');

const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth,async (req,res) => {
    
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
profileRouter.put("/profile/edit",userAuth,async (req,res) => {
    
    try{
    const ALLOWED_UPDATES = ["age", "phoneNumber", "gender", "photoURL", "skills", "bio","firstName", "lastName"];
    
    const isUpdateAllowed = Object.keys(req.body).every(key => ALLOWED_UPDATES.includes(key));
    
    if(!isUpdateAllowed){
    throw new Error("update not allowed!");
    }
    
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
    loggedInUser[key] = req.body[key];
    });
    loggedInUser.save();
    res.json({
    message: `${loggedInUser.firstName}, your profile updated successfully`,
    user: loggedInUser
    });
    } catch(err) {
    res.status(500).send("Unable to update the user: "+ err.message);
    }
    })
//update the user password
profileRouter.patch("/profile/changePassword", userAuth, async (req,res) => {
    try{
    const {oldPassword, newPassword} = req.body;
    const user = req.user;
    const isValidPassword = await user.validatePassword(oldPassword);
    if(!isValidPassword){
    throw new Error("old password is incorrect");
    }
    if(oldPassword === newPassword){
    throw new Error("old password and new password should not be same");
    }
    if(validator.isStrongPassword(newPassword)){
    throw new Error("new password should be strong");
    }
    const hashedPassword = await user.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.send("password changed successfully");
}catch(err){
    res.status(400).send("error while changing password: "+ err.message);
    }
});
    
module.exports = profileRouter;