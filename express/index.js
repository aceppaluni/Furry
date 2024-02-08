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

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const jwt = require('jsonwebtoken');
const User = require('./models/user');
//const Chat = require('./models/chat')

const url = 'mongodb://localhost:27017/pupsdb'
mongoose.connect(url, {
    //useUnifiedTopology: true,
    //useNewUrlParser: true,
})
.then(() => {
    console.log('Connected to server')
})
.catch((error) => {
    console.log('Error connecting to MongoDB', error)
}); 

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});

app.get('/', (req, res) => {
    res.send('hi')
});


// endpoint to register pup to backend 
app.post('/register', async (req, res) => {
    try {
        
        const {name, email, password} = req.body;

        //check if pup is already registered
        const existingUser = await User.findOne({email})
        
        if(existingUser) {
            return res.status(404).json({message: 'Pup already registered'})
        }

        //create a new pup
        const newUser = new User({
            name,
            email,
            password
        })
        console.log(newUser)
        //generate verification token for new pup
        newUser.verificationToken = crypto.randomBytes(20).toString('hex')

        //saving pup to DB
        await newUser.save()

        sendVerficationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({message: 'Pup registered successfully', userId: newUser._id})
        // may not be user may need to be pup
    } catch (error) {
        //res.status(404).json({message: 'Registration failed'});
        res.send(error)
    }
});

const sendVerficationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aceppaluni@gmail.com',
            pass: 'jewels19'
        }
    })

    const mailOptions = {
        from: 'furrypals.com',
        to: email,
        subject: 'Verification Email',
        text: `Please use the link provided to verify your email : http://localhost:5000/verify/${verificationToken}`
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending verification email')
    }
}

//endpoint to verify user 
app.get('verify/:token',async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({verificationToken: token});

        if(!user) {
           return res.status(404).json({message: "Invalid verification token"})
        }

        user.verified = true;
        user.verificationToken = undefined;

        await user.save()

        res.status(200).json({message: 'Email successfully verified'})
    } catch (error) {
        res.status(404).json({message: "Email verification failed"})
    }
})

const generateSecrectKey = () => {
    const secretkey = crypto.randomBytes(32).toString('hex')

    return secretkey
}

const secretkey = generateSecrectKey()