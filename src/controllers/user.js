const { req, res } = require('express')
require('../mongo')

const userRoutes = require('express-promise-router')()
const bcrypt = require('bcrypt')
const User = require('../Model/Users')

module.exports = {
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
    }
}