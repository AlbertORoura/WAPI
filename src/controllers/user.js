const bcrypt = require('bcrypt')
const { request, response } = require('express')
const userRoutes = require('express-promise-router')()
const User = require('../Model/Users')

userRoutes.post('/', async (request, response) ={
    const {body} = request
    const {username, name, password} = body

    const saltRounds = 10
    const passordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})