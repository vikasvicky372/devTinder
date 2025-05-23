const  socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { verifyJwtToken } = require("./jwtToken");

const createSecretRoomId =(fromUserId, targetUserId) => {
  return crypto.createHash("sha256").update([fromUserId,targetUserId].sort().join("$")).digest("hex");
}
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket,next) => {
    const token = socket.handshake.auth.token;
    console.log("Socket Token: ", token);
    if(!token) return next(new Error("Authentication error"));
    try{
      const user = verifyJwtToken(token);
      console.log("User: ", user);
      socket.user = user;
      next();
    } catch(err){
       return next(new Error("Invalid token"));
    }
  })

  io.on("connection", (socket) => {
    //console.log(socket.handshake.auth);
    socket.on("joinChat", ({fromName,fromUserId,targetUserId}) => {
        const roomId = createSecretRoomId(fromUserId, targetUserId);
        console.log(`User ${fromName} joined room ${roomId}`);
        socket.join(roomId);
    });

    socket.on("sendMessage", ({fromName, fromUserId, targetUserId, text}) => {
      const roomId = createSecretRoomId(fromUserId, targetUserId);
      console.log(`User ${fromName} sent message to ${targetUserId}: ${text}`);
      io.to(roomId).emit("messageReceived", {fromName, text}  );
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
