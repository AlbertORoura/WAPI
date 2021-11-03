const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('../mongo')

const Women = require('../Model/Women')


let backUpDB;

async function getBackup() {
    console.log('creando backUp');

}

const convertArrayToObject = (array) => {
    let dataToImport = [];
    for (var i = 1; i < array.length; i++) {
        var myObj = new Object();
        for (var z = 0; z < array[0].length; z++) {
            var a = array[0][z];
            var b = array[i][z];
            myObj[a] = b;
        }
        dataToImport.push(myObj);
    }
    return dataToImport;
};

module.exports = {

    restore: (req, res, next) => {

        //res.status(201).json('data base restored');
        next();
    },

    getAll: (req, res, next) => {
        Women.find({}).then(result => {
            res.status(200).json(result)
        }).catch(err => {
            next(err);
        })
    },

    index: (req, res, next) => {
        res.send(`
        <html>

<head>
    <Title>Woman API project</Title>
</head>

<body>
    <h1>
        The aim of that project is to provide an API for testing purposes.
    </h1>

    <h2>You can make a CRUD in database, and also you can restore it if needed.</h2>

    <h2>
        The endpoints are:
    </h2>
    <ul>
        <li>Get all database -> GET /api/women</li>
        <li>Get 1 concrete register -> GET by ID /api/woman/:id</li>
        <li>Create a new register in database -> POST /api/woman</li>
        <li>Edit a concrete register in database -> PUT /api/woman/:id</li>
        <li>Edit a concrete register in database -> PATCH /api/woman/:id</li>
        <li>Delete 1 concrete register in database -> DELETE /api/woman/:id</li>
        <li>Restore database -> PUT /api/woman/</li>
    </ul>

    <h2>If this project has been helpful to you, you can thank me by making a donation to any organization for the study
        of diseases related to women.</h2>

</body>
</html>
        `);
        next();
    },

    newUser: async (req, res, next) => { //POST
        const { firstName, lastName, birthDate, history } = req.body;

        if (firstName && lastName && birthDate && history) {
            const newWoman = new Women({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                history: req.body.history
            })
            let newId = await newWoman.save().then(saveWoman => {
                return saveWoman._id
            })
            res.status(201).json(newId);
        } else {
            res.status(400).json('data missing, please, provide firstName, lastName, birthDate and history');
        }
        next();
    },

    getUser: (req, res, next) => { //GET:Id
        let { id } = req.params;

        Women.findById(id).then(woman => {
            if (woman != undefined) {
                res.status(200).json(woman);
            } else {
                res.status(404).json({ success: 'id not found' });
            }
        }).catch(err => {
            console.log('entra en el catch')
            next(err); //TODO: next(err)
        })
    },

    replaceUser: (req, res, next) => { //PUT
        const { id } = req.params
        const newWomaninfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            history: req.body.history
        }

        Women.findByIdAndUpdate(id, newWomaninfo, { new: true })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                next(err);
            })
    },

    updateUser: (req, res, next) => { //PATCH
        const { id } = req.params
        const newWomaninfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            history: req.body.history
        }
        console.log(newWomaninfo)
        Women.findByIdAndUpdate(id, newWomaninfo, { new: true })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                next(err);
            })
    },

    deleteUser: (req, res, next) => { //DELETEE
        let { id } = req.params;

        Women.findByIdAndDelete(id).then(woman => {
            if (woman != undefined) {
                res.status(204).json(woman);
            } else {
                res.status(404).json({ success: 'id not found' });
            }
        }).catch(err => {
            next(err);
        })
    },

    notFound: (err, req, res, next) => {
        console.error('estoy en el notfound')
        // console.error(error)
        // console.log(error.name)
        if (err.name === 'CastError') {
            res.status(400)
        } else {
            res.status(404).json({ error: 'bad path' });
        }
    }
};