const { Schema, model } = require("mongoose");

const womenSchema = new Schema({
    // id: String,
    firstName: String,
    lastName: String,
    birthDate: String,
    history: String,
    userId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

womenSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.userId
    }
})

const Woman = model('Woman',womenSchema)

module.exports = Woman