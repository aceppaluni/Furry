const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const Userschema = new Schema({
    name: {
        type: String,
        //required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    verified: {
        type: Boolean,
        required: true
    },
    verificationToken: String,
    age: {
        type: String,
    },
    crushes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pup'
        }
    ],
    recievedLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pup'
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pup'
        }
    ],
    description: {
        type: String,
    },
    profileImage: [
        {
            type: String
        }
    ],
    lookingfor: [
        {
            type: String
        }
    ]
})

const Usermodel = mongoose.model('User', Userschema)
module.exports = Usermodel