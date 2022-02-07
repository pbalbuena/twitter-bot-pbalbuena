const functions = require("firebase-functions");


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//step 1
exports.auth = functions.https.onRequest(
    (request, response) => {}
);
//step 2
exports.callback = functions.https.onRequest(
    (request, response) => {}
);
//step 3
exports.tweet = functions.https.onRequest(
    (request, response) => {}
);