const jwt = require("jsonwebtoken");
const createJwtToken = (user) => {
    const token = jwt.sign({ id: user._id }, "DEVTINDER@2000", {
        expiresIn: "30d",
    });
    return token;
}

const verifyJwtToken = (token) => {
    try {
        const decoded = jwt.verify(token, "DEVTINDER@2000");
        const { id } = decoded;
        return id;
    } catch (err) {
        return null;
    }
}

module.exports = {
    createJwtToken,
    verifyJwtToken
}