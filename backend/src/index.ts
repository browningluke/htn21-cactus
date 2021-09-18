import express from 'express';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Profile, Scope, Strategy, VerifyCallback } from '@oauth-everything/passport-discord';
import FirestoreDb from "./firestore";
import dotenv from 'dotenv';

import { RecursivePartial, User } from "cactus";
import { GenericResponse, GetUser } from "cactus-response";

dotenv.config()
const db = new FirestoreDb();

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

app.use(session({ secret: "asdfg" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(express.json());

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
    }

    try {
        await db.updateUser(user.id, newUser);
        res.json(newUser);
        return;
    } catch (e) {
        console.log(e);
        if (e instanceof Error) {
            const errJson: GenericResponse = {
                error: e.message
            }
            res.status(500).json(errJson);
        }
    }
})

/*
    Speech-to-text endpoints
 */

// Nothing as of yet

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})


function checkAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated()) return next();

    const unAuthJson: GenericResponse = {
        error: "Unauthorized. User is not logged in :("
    }
    res.status(401).json(unAuthJson);
}