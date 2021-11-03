const { Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    name: String,
    passordHash: String,
    womenDB: [{
        type: Schema.Types.ObjectId,
        ref: 'Women'
    }]
});

