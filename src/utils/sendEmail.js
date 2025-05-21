const { SendEmailCommand }= require("@aws-sdk/client-ses");
const { sesClient }= require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, body ) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "vikasvicky372@gmail.com",
    "vikas@devconnects.in",
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };