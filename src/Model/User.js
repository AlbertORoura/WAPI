const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: String,
    name: String,
    passwordHash: String,
    womenId: [{
        type: Schema.Types.ObjectId,
        ref: 'Woman'
    }]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passorddHash
    }
})

const User = model('User', userSchema)

module.exports = User