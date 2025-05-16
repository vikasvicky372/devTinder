const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
firstName: {
type: String,
required: true,
minLength: 4,
maxLength: 50
},
lastName: {
type: String,
minLength: 4,
maxLength: 50
},
emailId: {
type: String,
required: [true, 'email id is mandatory'],
unique: true,
lowercase: true,
trim: true,
validate(email) {
    if(!validator.isEmail(email)){
        throw new Error("Inavalid email", email);
    }
}
},
age: {
type: Number,
min: 18,
},
phoneNumber: {
type: String,
required: true,
// match: [/^[0-9]{10}$/, "Phone Number is not valid"]
validate(phoneNumber) {
    if(!validator.isMobilePhone(phoneNumber ,'en-IN')){
        throw new Error("Invalid phone number", phoneNumber);
    }
}
},
password: {
type: String,
required: true,
validate(password) {
    if(!validator.isStrongPassword(password)){
        throw new Error("enter strong password", password);
    }
}

},
gender: {
type: String,
required: true,
},
photoURL: {
type: String,
default: "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
validate(value) {
    if(!validator.isURL(value)){
        throw new Error("Invalid url", value);
    }
}
},
skills: {
type: [String],
validate(skills) {
    if(skills.length>10){
        throw new Error("you can add up to 10 skills maximum");
    }
}
},
bio: {
type: String,
default: "This is the default bio"
}
},
{ timestamps: true });
userSchema.methods.getJwtToken =  function() {
    const user = this;
    const token =  jwt.sign({ id: user._id }, "DEVTINDER@2000", {
        expiresIn: "1d",
    });
    return token;
    };
userSchema.methods.validatePassword = async function(passwordSentByUser) {
    const user = this;
    const isMatch = await bcrypt.compare(passwordSentByUser, user.password);
    return isMatch;
}
userSchema.methods.hashPassword = async function(plainPassword) {
    const user = this;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return hashedPassword;
}


module.exports = mongoose.model("User", userSchema);