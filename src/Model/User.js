const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: String,
    name: String,
    passordHash: String,
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

        delete returnedObject.passordHash
    }
})

const User = model('User', userSchema)

module.exports = User