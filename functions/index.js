const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { ref } = require("firebase-functions/v1/database");
admin.initializeApp();

const dbRef = admin.firestore().doc('tokens/demo');

//initialize twitter api
const twitterApi = require('twitter-api-v2').default;
const twitterClient = new twitterApi({
    clientId: 'enRVWE1hVXhkVlAtcHNNMW04S1E6MTpjaQ',
    clientSecret: '2fF1WuOfEWaBgjnEIBJda0M7yCvwAOumqRJT89PtaZjuJQvY3m',
});

const callbackURL = 'http://127.0.0.1:5000/twitter-bot-pbalbuena/us-central1/callback';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// STEP 1 - Auth URL
exports.auth = functions.https.onRequest(async (request, response) => {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );
  
    // store verifier
    await dbRef.set({ codeVerifier, state });
  
    response.redirect(url);
  });

//step 2    
exports.callback = functions.https.onRequest(async (request, response) => {
        const {state, code } = request.query;

        const dbSnapshot = await dbRef.get();
        const { codeVerifier, state: storedState } = dbSnapshot.data();

        console.log(state)
        console.log(storedState)

        if(state !== storedState){
            return response.status(400).send('Stored tokens do not match!')
        }

        const {
            client: loggedClient,
            accessToken,
            refreshToken,
        } = await twitterClient.loginWithOAuth2({
            code, 
            codeVerifier,
            redirectUri: callbackURL,
        });

        dbRef.set({
            accessToken, refreshToken
        });

        response.sendStatus(200);
    }
);
//step 3
exports.tweet = functions.https.onRequest(async (request, response) => {
    const {refreshToken} = (await  dbRef.get()).data();
    const {
        client: refreshedClient,
        accessToken,
        refreshToken: newRefreshToken,
    } = await twitterClient.refreshOAuth2Token(refreshToken);

    await dbRef.set({
        accessToken, refreshToken: newRefreshToken
    });

    const {data} = await refreshedClient.v2.me();
    response.send(data);
}
);