import express from 'express';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Profile, Scope, Strategy, VerifyCallback } from '@oauth-everything/passport-discord';
import FirestoreDb from "./firestore";
import dotenv from 'dotenv';

import { User } from "catcus";

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

// Connect passport to express/connect/etc
app.get("/auth/discord", passport.authenticate("discord"));
app.get("/auth/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/failed",
    successRedirect: "/info"
}));

app.get('/info', checkAuth, function(req, res) {
    res.json(req.user);
});

app.get('/failed', function(req, res) {
    res.send('Failed to login!')
});

app.get('/logout', function(req, res) {
    req.logout();
    res.send("Logged out");
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


function checkAuth(req: any, res: any, next: any) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}