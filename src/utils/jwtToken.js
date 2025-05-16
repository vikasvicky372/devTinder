const jwt = require("jsonwebtoken");
const createJwtToken = (user) => {
const token = jwt.sign({ id: user._id }, "DEVTINDER@2000", {
    expiresIn: "0d",
});
return token;
}

const verifyJwtToken = (token) => {
    const decoded = jwt.verify(token, "DEVTINDER@2000");
    const { id } = decoded;
    return id;
}

module.exports = {
createJwtToken,
verifyJwtToken
}