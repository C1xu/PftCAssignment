const Firestore = require("@google-cloud/firestore");

exports.queueListener = (event, context) => {
    const data = Buffer.from(event.data, "base64").toString();
    const jsonData = JSON.parse(data);
};