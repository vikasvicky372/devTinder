const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    status: {
        type: String,
        required: true,
        enum: ["interested","ignored", "accepted", "rejected"],
        messge: '{VALUE} is not a valid status'
    }
},
{
    timestamps: true
}
);

//creating indexes for the connection request
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", async function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a request to yourself");
    }
    next();
});


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
