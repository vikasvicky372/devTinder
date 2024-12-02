const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
firstName: {
    type: String,
    required: true,
    minLength: 4
},
lastName: {
    type: String
},
emailId: {
    type: String,
    required: [true, 'email id is mandatory'],
    unique: true,
    lowercase: true,
    trim: true
},
age: {
    type: Number,
    min: 18,
},
phoneNumber: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
gender: {
    type: String,
    validate(value) {
        if (!["male", "female", "others"].includes(value)) {
            throw new Error("Gender is not valid");
        }
    },
},
photoURL: {
    type: String,
    default: "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg"
},
skills: {
    type: [String]
},
bio: {
    type: String,
    default: "This is the default bio"
}
},
{ timestamps: true });


module.exports = mongoose.model("User", userSchema);