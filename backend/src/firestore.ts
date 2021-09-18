import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { User } from "catcus";


// Set the configuration for your app
const firebaseConfig = require('../firebase.config.json');

export default class FirestoreDb {

    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore();

    async findUserById(id: string): Promise<User | null> {
        const docRef = doc(this.db, "users", id);
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

        const usersRef = collection(this.db, "users");
        await setDoc(doc(usersRef, id), user);
        console.log("Document written with ID: ",  id);

        return user;
    }

}