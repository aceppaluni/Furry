const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 5000

const http = require('http').createServer(app)
const io = require('socket.io')

app.use(cors)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const jwt = require('jsonwebtoken');
const Pup = require('./models/user');
//const Chat = require('./models/chat')

const url = 'mongodb://localhost:27017/pupsdb'
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log('Connected to server')
})
.catch((error) => {
    console.log('Error connecting to MongoDB', error)
}); 

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})


// endpoint to register pup to backend 
app.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check if pup is already registered
        const existingUser = await Pup.findOne({email})
        if(existingUser) {
            return res.status(404).json({message: 'Pup already registered'})
        }

        //create a new pup
        const newUser = new Pup({
            name,
            email,
            password
        })

        //generate verification token for new pup
        newUser.verificationToken = crypto.randomBytes(20).toString('hex')

        //saving pup to DB
        await newUser.save()

        sendVerficationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({message: 'Pup registered successfully', userId: newUser._id})
        // may not be user may need to be pup
    } catch (error) {
        res.status(404).json({message: 'Registration failed'});
    }
});

const sendVerficationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aceppaluni@gmail.com',
            pass: '#'
        }
    })

    const mailOptions = {
        from: 'furrypals.com',
        to: email,
        subject: 'Verification Email',
        text: `Please use the link provided to verify your email : http://localhost:3000/verify/${verificationToken}`
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending verification email')
    }
}