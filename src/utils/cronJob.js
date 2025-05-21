const cron = require('node-cron');
const connectionModel = require('../models/connectionRequest');
const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require('../utils/sendEmail');

cron.schedule('0 8 * * *', async () => {
    // sending emails to users

    try{
        const yesterdayDate = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterdayDate);
        const yesterdayEnd = endOfDay(yesterdayDate);
        const requests = await connectionModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(requests.map(request => request.toUserId.emailId))];
        console.log("List of emails: ", listOfEmails);
        try{

        } catch(err){
            console.log("Error in sending emails: ", err.message);
        }
        for(const email of listOfEmails){
            const res = await sendEmail.run(
                `You received a new connection request`,
                `Hi there,
              
              Someone has sent you a connection request on DevConnects.
              
              Please log in to your account (${email}) to view the request and take action — you can accept or ignore it.
              
              Happy connecting,  
              — The DevConnects Team`
              );
        }
    } catch(err){
        console.log("Error in getting emails: ", err.message);
    }
});