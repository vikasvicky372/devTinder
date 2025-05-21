const jwt = require("jsonwebtoken");
const createJwtToken = (user) => {
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "0d",
});
return token;
}

const verifyJwtToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decoded;
    return id;
}

module.exports = {
createJwtToken,
verifyJwtToken
}