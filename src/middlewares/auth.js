const {verifyJwtToken} = require("../utils/jwtToken");
const User = require("../models/user");
const adminAuth = (req,res,next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
};

const userAuth = async (req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("token is invalid");
        }
    const id = verifyJwtToken(token);
    const userId = await User.findById(id);
    if(!userId){
      throw new Error("User not found");
    }
    next();
    } catch(err){
        res.status(401).send("Error: " + err);
    }
    
};

module.exports = {
    adminAuth,
    userAuth
}