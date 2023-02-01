const { SendEmailCommand } = require("@aws-sdk/client-sesv2");
const sesv2 = require("@aws-sdk/client-sesv2");

const sesClient = new sesv2.SESv2Client(
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

// yuck
const formatMessage = (message, cart) => {
  let data = `Bestelling\n\n${message} \n\n #  Product\n`;

  cart.forEach((product) => {
    data += ` ${product.quantity}  ${product.id}`;
  });

  return data;
};

/* Ideally replaced with a custom field in stripe */
const sendMail = async (message, cart) => {
  const formattedMessage = formatMessage(message, cart);
  const subject = "Bestelling | haverklapbloemen";

  const params = {
    Content: {
      Simple: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: "test",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: formattedMessage,
        },
      },
    },
    Destination: {
      ToAddresses: ["hiddevbavel@gmail.com"],
    },
    FromEmailAddress: "hiddevanbavel@hotmail.com",
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));

    console.log(`send Mail`);
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { sendMail };
