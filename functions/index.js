const dodenv = require('dotenv').config()

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { ref } = require("firebase-functions/v1/database");
admin.initializeApp();

const dbRef = admin.firestore().doc('tokens/demo');

//initialize twitter api
const twitterApi = require('twitter-api-v2').default;
const twitterClient = new twitterApi({
    clientId: process.env.TWITTER_USER,
    clientSecret: process.env.TWITTER_SECRET,
});

const callbackURL = 'http://127.0.0.1:5000/twitter-bot-pbalbuena/us-central1/callback';


//initialize openai api

const {Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_USER,
    apiKey: process.env.OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

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

    const nextTweet = await openai.createCompletion('text-davinci-001',{
        prompt: 'tweet something nice',
        max_tokens: 64,
    });

    const {data} = await refreshedClient.v2.tweet(
        nextTweet.data.choices[0].text
    )

    response.send(data);
}


);