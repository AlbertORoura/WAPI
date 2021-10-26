const admin = require('firebase-admin');
const serviceAccount = require('../../wapi-329713-3d8005075c7b.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
let backUpDB;

async function getBackup(client) {
    console.log('creating backUp');
    return await test;
}

module.exports = {

    restore: async (req, res, next) => {
        let backUp = await backUpDB;

        res.status(201).json('data base restored');
    },

    index: async (req, res, next) => {
        const snapshot = await db.collection('women').get();
        let response = [];
        snapshot.forEach((doc) => {
            response.push({
                "firstName": doc.data().firstName,
                "lastName": doc.data().lastName,
                "history": doc.data().history,
                "birthDate": doc.data().birthDate,
                "id": doc.id
            });
        });
        res.json(response);
    },

    newUser: async (req, res, next) => { //POST
        const { firstName, lastName, birthDate, history } = req.body;

        if (birthDate && firstName && lastName) {
            const docRef = await db.collection('women').add({
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
                history: history
            });
            res.status(201).json("register created with ID: " + docRef.id);
        } else {
            res.json('data missing, please, provide birthDate, firstName and lastName');
        }
    },

    getUser: async (req, res, next) => { //GET:Id
        let { id } = req.params;
        const snapshot = await db.collection('women').get();
        let response = [];
        snapshot.forEach((doc) => {
            if (doc.id == id) {
                response.push({
                    "firstName": doc.data().firstName,
                    "lastName": doc.data().lastName,
                    "history": doc.data().history,
                    "birthDate": doc.data().birthDate,
                    "id": doc.id
                });
            }
        });
        if (response.length > 0) {
            res.status(200).json(response[0]);
        } else {
            res.status(404).json('Not found');
        }
    },

    replaceUser: async (req, res, next) => { //PUT
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
    },

    updateUser: async (req, res, next) => { //PATCH
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
    },

    deleteUser: async (req, res, next) => { //DELETE
        let { id } = req.params;
        const snapshot = await db.collection('women').get();
        let response = [];
        snapshot.forEach((doc) => {
            if (doc.id == id) {
                response.push(doc.id);
            }
        });

        if (response.length > 0) {
            db.collection('women').doc(response[0]).delete();
            res.status(200).json('register ' + response[0] + ' erased');
        } else {
            res.status(404).json('Not found');
        }

    }
};