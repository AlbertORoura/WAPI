require('../mongo')
const jwt = require('jsonwebtoken')
const Women = require('../Model/Women')
const bcrypt = require('bcrypt')
const User = require('../Model/User')
const womenLocalDB = require('../women.json')

async function restore(u) {
    const user = await User.findById(u)

    for(let womanDB in womenLocalDB) {
        const newWoman = new Women({
            firstName: womenLocalDB[womanDB].firstName,
            lastName: womenLocalDB[womanDB].lastName,
            birthDate: womenLocalDB[womanDB].birthDate,
            history: womenLocalDB[womanDB].history,
            userId: u
        })

        try {
            let newW = await newWoman.save()
            user.womenId.push(newW._id)
            await user.save()
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = {

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

    <h2>Please, find below the <a href="https://www.google.es" target="_blank">SWAGER</a> link for documentation.</h2>

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

    login: async (req, res, next) => {
        const { body } = req;
        const { username, password } = body

        const user = await User.findOne({ username })

        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            res.status(401).json({
                error: 'invalid user or password'
            })
        } else {

            const userForToken = {
                id: user._id,
                username: user.username
            }

            const token = jwt.sign(userForToken, process.env.SECRET)
            await restore(user._id)
            res.send({
                name: user.name,
                username: user.username,
                token: token
            })
        }
    },

    getAll: async (req, res, next) => {
        const { userId } = req
        const women = await Women.find({ userId }).populate('userId')
        res.status(200).json(women)
    },

    getAllUsers: async (req, res, next) => {
        const users = await User.find({}).populate('womenId', {
            firstName: 1,
            lastName: 1,
            birthDate: 1,
            history: 1
        })
        res.status(200).json(users)
    },

    newWoman: async (req, res, next) => { //POST
        const { firstName, lastName, birthDate, history } = req.body;

        if (firstName && lastName && birthDate && history) {
            const { userId } = req
            const newWoman = new Women({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                history: req.body.history,
                userId: userId
            })

            const user = await User.findById(userId)

            try {
                let newW = await newWoman.save()
                user.womenId.push(newW._id)
                await user.save()
                res.status(201).json(newW._id)
            } catch (error) {
                next(error);
            }
        } else {
            res.status(400).json({ success: false, error: 'data missing, please, provide firstName, lastName, birthDate and history' });
        }
    },

    restore: (req, res, next) => {

        //res.status(201).json('data base restored');
        next();
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
            next(err);
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
                if (!woman) return res.status(404).json({ success: false, error: 'id not found' });
                return res.status(204).json(woman);
            } else {
                res.status(404).json({ success: false, error: 'does not match id format' });
            }
        } catch (err) {
            next(err)
        }
    },

    newUser: async (req, res, next) => { //POST TODO CONTROL DE USUARIOS REPETIDOS
        const { body } = req
        const { username, name, password } = body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()

        res.status(201).send({
            name: savedUser.name,
            username: savedUser.username
        })
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