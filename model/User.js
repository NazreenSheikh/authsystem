const mongoose = require('mongoose');

const userSchema = new mongoose.Model({
    firstFname: {
        type: 'string',
        default: null,
    },
    lastname: {
        type: 'string',
        default: null,
    },
    email: {
        type: 'string',
        unique: true,
    },
    password: {
        type: 'string',
    },
    token: {
        type: 'string',
        unique: true,
    }

})

module.exports = mongoose.model('User', userSchema)