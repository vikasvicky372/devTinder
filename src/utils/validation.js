const validator = require("validator");
const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are mandatory");
    } else if(firstName.length < 4 || firstName.length >= 50){
        throw new Error("First name should be between 4 and 50 characters");
    } else if(lastName.length < 4 || lastName.length >= 50){
        throw new Error("Last name should be between 4 and 50 characters");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email id");
    }
}

module.exports = {
    validateSignUpData
}