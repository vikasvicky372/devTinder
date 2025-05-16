const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoURL skills bio";
userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try{

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA);

        res.status(200).json({
            connectionRequests
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        //vikas -> virat accepted
        // virat => vikas accepted
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            data
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/feed", userAuth, async(req, res) => {
    try{
        //get all user except the logged in user
        //get all users who are not in the connection list
        //get all the user who are previously rejected or accepted
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(row => {
            hideUsersFromFeed.add(row.fromUserId.toString());
            hideUsersFromFeed.add(row.toUserId.toString());
        });

        const filteredUsers = await User.find({
            $and:[{_id:{ $nin: Array.from(hideUsersFromFeed) }},
                {_id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.status(200).json({
            data:filteredUsers
        });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;