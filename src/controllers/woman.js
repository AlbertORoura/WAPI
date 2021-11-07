require('../mongo')

const Women = require('../Model/Women')
const bcrypt = require('bcrypt')
const User = require('../Model/User')

module.exports = {

    restore: (req, res, next) => {

        //res.status(201).json('data base restored');
        next();
    },

    getAll: async (req, res, next) => {
        const women = await Women.find({}).populate('userId')
        res.status(200).json(women)
    },

    getAllUsers: async (req, res, next) => {
        const users = await User.find({}).populate('womenId',{
            firstName: 1,
            lastName: 1,
            birthDate: 1,
            history: 1
        })
        res.status(200).json(users)
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

    newWoman: async (req, res, next) => { //POST
        const { firstName, lastName, birthDate, history, userId } = req.body;
        const user = await User.findById(userId)
        console.log(user)
        if (firstName && lastName && birthDate && history) {
            const newWoman = new Women({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                history: req.body.history,
                userId: user._id
            })
            console.log(newWoman)
            try {
                let newW = await newWoman.save()
                user.womenId.push(newW._id)
                await user.save()
                console.log(user)
                res.status(201).json(newW._id)
            } catch (error) {
                next(error);
            }
        } else {
            res.status(400).json({ success: false, error: 'data missing, please, provide firstName, lastName, birthDate and history' });
        }
    },

    getWoman: (req, res, next) => { //GET:Id
        let { id } = req.params;

        Women.findById(id).then(woman => {
            if (woman != undefined) {
                res.status(200).json(woman);
            } else {
                res.status(404).json({ success: false, error: 'id not found' });
            }
        }).catch(err => {
            console.log('entra en el catch')
            next(err); //TODO: next(err)
        })
    },

    replaceWoman: (req, res, next) => { //PUT
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

    updateWoman: (req, res, next) => { //PATCH
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

    deleteWoman: async (req, res, next) => { //DELETEE
        let { id } = req.params;

        try {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const woman = await Women.findByIdAndDelete(id)
                console.log(woman)
                if (!woman) return res.status(404).json({ success: false, error: 'id not found' });
                return res.status(204).json(woman);
            } else {
                res.status(404).json({ success: false, error: 'does not match id format' });
            }
        } catch (err) {
            next(err)
        }
    },

    newUser: async (req, res, next) => { //POST
        const { body } = req
        const { username, name, password } = body

        const saltRounds = 10
        const passordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passordHash
        })

        const savedUser = await user.save()

        res.json(savedUser)
    },

    notFound: (err, req, res, next) => {
        console.error('estoy en el notfound')
        // console.error(error)
        // console.log(error.name)
        if (err.name === 'CastError') {
            res.status(400)
        } else {
            res.status(404).json({ success: false, error: 'bad path' });
        }
    }
};