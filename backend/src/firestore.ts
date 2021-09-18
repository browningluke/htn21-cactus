import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import dot from "dot-object";

import { RecursivePartial, User } from "cactus";

// Set the configuration for your app
const firebaseConfig = require('../firebase.config.json');

export default class FirestoreDb {

    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore();
    userRef = collection(this.db, "users");

    async findUserById(id: string): Promise<User | null> {
        const docRef = doc(this.userRef, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as User;
            //console.log("Document data:", docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return null;
        }
    }


    async findOrCreate(id: string, discordUsername: string): Promise<User> {
        const foundUser = await this.findUserById(id);
        if (foundUser) return foundUser;

        console.log("Not found user, creating new user.");

        const user: User = {
            id: id,
            name: discordUsername,
            currentPlant: {
                dateTimeCreated: new Date().toISOString(),
                spokenPhrases: [],
                growth: 0
            },
            garden: []
        }

        await setDoc(doc(this.userRef, id), user);
        console.log("Document written with ID: ",  id);

        return user;
    }

    async updateUser(id: string, user: RecursivePartial<User>) {
        // const foundUser = await this.findUserById(id);
        // if (!foundUser) throw new Error("No user in the database!");

        let tgt = {};
        dot.keepArray = true;
        dot.dot(user, tgt);

        // @ts-ignore
        Object.keys(tgt).forEach(key => tgt[key] === undefined ? delete tgt[key] : {});
        console.log(tgt);

        // Assume user already exists in db.
        await updateDoc(doc(this.userRef, id), tgt);
        console.log("Document updated with ID: ", id);
    }

}