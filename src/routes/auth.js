const express = require("express");

const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoURL skills bio";
//adding new user
authRouter.post("/signUp", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    //encrypt the password
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    console.log(req.body);
    const user = new User(req.body);

    const data = await user.save();
    const token = data.getJwtToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.json({ message: "Sign up successfull", data });
  } catch (err) {
    res.status(400).send("error occured while saving the user: " + err);
  }
});

//logging the user

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("emailid and password is mandatory");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPasword = await user.validatePassword(password);
    if (isValidPasword) {
      const token = user.getJwtToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.json({
        user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error while logging in: " + err);
  }
});

//logging out the user
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).send("error while logging out: " + err.message);
  }
});

//getting users for matched filter
authRouter.get("/user", userAuth, async (req, res) => {
  const userEmail = req?.body?.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = authRouter;
