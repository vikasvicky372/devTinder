
const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const {status, toUserId} = req.params;
        const allowedStatuses = ["interested","ignored"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                message: "invalid status type: " + status
            });
        }
        const fromUserId = req.user._id;
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingRequest){
            return res.status(400).json({
                message:`Request already exists`
            })
        }
        const user = await User.findOne({
            _id: toUserId
        });
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await request.save();
        const response = await sendEmail.run();
        console.log(response);
        res.status(201).json({
            message: `${req.user.firstName} is ${status} in ${user.firstName}`,
            data
        });
    }catch(err){
        res.status(400).send("Something went wrong: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try{
        const {status, requestId} = req.params;
    const allowedStatuses = ["accepted","rejected"];
    if(!allowedStatuses.includes(status)){
        return res.status(400).json({
            message: " Status is not allowed: " + status
        });
    }
    const loggedInUser = req.user._id;
    const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested"
    });
    if(!request){
        return res.status(404).json({
            message: "Connection request is not found"
        });
    }
    request.status = status;
    const data = await request.save();
    res.status(200).json({
        message: `Connection request is ${status} by ${req.user.firstName}`,
        data
    });
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    
});

module.exports = requestRouter;