const sesv2 = require("@aws-sdk/client-sesv2");

const ses = new sesv2.SESv2Client(
  !process.env.IS_OFFLINE
    ? {}
    : {
        endpoint: "http://localhost:8005",
        region: "aws-ses-v2-local",
        credentials: {
          accessKeyId: "ANY_STRING",
          secretAccessKey: "ANY_STRING",
        },
      }
);

const getCommand = (message) => ({
  FromEmailAddress: "hiddevanbavel@hotmail.com",
  Destination: { ToAddresses: ["hiddevanbavel@hotmail.com"] },
  Content: {
    Simple: {
      Subject: { Data: "This is the subject" },
      Body: { Text: { Data: "This is the email contents" } },
    },
  },
});

/* Ideally replaced with a custom field in stripe */
const sendMail = async (message) => {
  const result = await ses.send(
    new sesv2.SendEmailCommand(getCommand(message))
  );

  console.log(result);
  return result;
};

module.exports = { sendMail };
