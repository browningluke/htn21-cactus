import express from 'express';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Profile, Scope, Strategy, VerifyCallback } from '@oauth-everything/passport-discord';
import busboy from "connect-busboy";

import dotenv from 'dotenv';
import concat from "concat-stream";

import { RecursivePartial, User } from "cactus";
import { GenericResponse, GetUser, SpeechResp } from "cactus-response";

import FirestoreDb from "./firestore";
import GoogleAPI from "./googleapi";

dotenv.config()
const db = new FirestoreDb();
const gapi = new GoogleAPI();

passport.serializeUser(function(user, done) {
    // Saving user
    console.log("Saving user");
    done(null, (user as User).id);
});
passport.deserializeUser(async function(obj: string, done) {
    console.log("Loading user with id: ", obj);

    const user = await db.findUserById(obj);

    if (user) {
        done(null, user);
    } else {
        done("No such document!", null);
    }
});

// Set up the Discord Strategy
passport.use(new Strategy(
    {
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: "http://localhost:8080/auth/discord/callback",
        // The default scope is Scope.IDENTIFY which gives basic profile information
        scope: [Scope.IDENTIFY, Scope.EMAIL]

    },
    async (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<User>) => {
        let user: User;
        try {
            user = await db.findOrCreate(profile.id, profile.username!)
            cb(null, user);
        } catch (e) {
            console.error("Error adding document: ", e);
            if (e instanceof Error) {
                cb(e);
            }
        }
    }
));

const app = express()
const port = process.env.PORT ?? 8080;

const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}

app.use(session({ secret: "asdfg" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(express.json());
app.use(busboy());

/*
    Auth Endpoints
 */

// Connect passport to express/connect/etc
app.get("/auth/discord", passport.authenticate("discord"));
app.get("/auth/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/failed",
    successRedirect: "/" // todo change this
}));

app.get('/auth/logout', (req, res) => {
    req.logout();
    console.log("Logged out")
    res.redirect('/');
});

/*
    Misc Endpoints
 */

app.get('/failed', (req, res) => {
    res.send('Failed to login!')
});

app.get('/info', checkAuth, (req, res) => {
    res.json(req.user);
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

/*
    User Endpoints
 */

app.get('/api/user', checkAuth, (req, res) => {
    const user = req.user;
    const resJson: GetUser = { user: user }
    res.json(resJson);
})

/*
    Expects data in format:
    {
        id?
        name?
        currentPlant?: {
            dateTimeCreated?
            spokenPhrases? (plz call with (user.currentPlant.spokenPhrases + new phrase element) otherwise it'll overwrite)
            growth?
        }
        garden? (plz call with (user.garden + new garden element) otherwise it'll overwrite)
    }
 */
app.patch('/api/user', checkAuth, async (req, res) => {
    const user = req.user as User;
    const reqBody = req.body;

    const newUser: RecursivePartial<User> = {
        currentPlant: {
            spokenPhrases: reqBody.currentPlant.spokenPhrases,
            growth: reqBody.currentPlant.growth,
        },
        garden: reqBody.garden
    };

    try {
        await db.updateUser(user.id, newUser);
        res.json(newUser);
        return;
    } catch (e) {
        console.log(e);
        if (e instanceof Error) {
            const errJson: GenericResponse = {
                error: e.message
            };
            res.status(500).json(errJson);
        }
    }
})

/*
    Speech-to-text endpoints
 */

app.post('/api/speech', async (req, res) => {
    const items = [
        {text: "I love you cactus.", score: 1},
        {text: "Hello cactus.", score: 0},
        {text: "I hate you cactus.", score: -1}];
    const item = items[Math.floor(Math.random()*items.length)];

    const respJson: SpeechResp = {
        text: item.text,
        score: item.score // scoreVal
    }

    res.json(respJson);
});


app.post('/api/speech-new', ((req, res) => {
    let fstream = concat(concatCallback);
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            //res.sendStatus(200);
        });
    });

    async function concatCallback(buffer: Buffer) {
        const json = await gapi.handleSpeechAnalysis(buffer);
        res.json(json);
    }
}));

// app.post('/api/speech-prod', (req, res) => {
//     let fstream = concat(convert);
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (fieldname, file, filename) {
//         console.log("Uploading: " + filename);
//
//         file.pipe(fstream);
//         fstream.on('close', function () {
//             console.log("Upload Finished of " + filename);
//             res.sendStatus(200);
//         });
//     });
//
//     function convert(buffer: Buffer) {
//         let goodStream = concat(gotData);
//
//         ffmpeg(Readable.from(buffer))
//             .format('wav')
//             .audioCodec('pcm_s16le')
//             .audioChannels(1)
//             .audioFrequency(16000)
//             .writeToStream(goodStream, { end: true });
//     }
//
//     function gotData(buffer: Buffer) {
//         let base64data = buffer.toString('base64');
//         //console.log(base64data);
//
//         speechClient.recognize({
//             config: {
//                 encoding: "LINEAR16",
//                 sampleRateHertz: 16000,
//                 languageCode: 'en-US',
//             },
//             audio: {
//                 content: base64data
//             }
//         }).then(([resp]) => {
//             // @ts-ignore
//             const transcription = resp.results.map(result => result.alternatives[0].transcript).join('\n');
//             console.log('Transcription: ', transcription);
//             res.send(transcription);
//         }).catch((err) => {
//             console.log(err);
//             res.sendStatus(500);
//         });
//     }
// });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})


function checkAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated()) return next();

    const unAuthJson: GenericResponse = {
        error: "Unauthorized. User is not logged in :("
    };
    res.status(401).json(unAuthJson);
}