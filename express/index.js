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
        
        const {name, email, password, verified} = req.body;

        //check if pup is already registered
        const existingUser = await User.findOne({email})
        
        if(existingUser) {
            console.log('Email already registered')
            return res.status(404).json({message: 'Pup already registered'})
        }

        //create a new pup
        const newUser = new User({
            name,
            email,
            password,
            verified
        })
        console.log("register point", newUser)
        
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
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'herta.nienow@ethereal.email',
            pass: 'Tayt8FkUy7cnukwSpb'
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
        
        //console.log('Email sent!')
    } catch (error) {
        console.log('Error sending verification email')
    }
};

//endpoint to verify user 
app.get('/verify/:token',async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({verificationToken: token});
        console.log("User", user)

        if(!user) {
           return res.status(404).json({message: "Invalid verification token"})
        }

        user.verified = true;
        user.verificationToken = undefined;

        await user.save()
        console.log('User', user)

        res.status(200).json({message: 'Email successfully verified'})
    } catch (error) {
        res.status(404).json({message: "Email verification failed"})
    }
});

const generateSecrectKey = () => {
    const secretkey = crypto.randomBytes(32).toString('hex')

    return secretkey
}

const secretkey = generateSecrectKey()

//endpoint to login user 
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        console.log("login", user)
        if(!user) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        if(user.password !== password) {
            return res.status(401).json({message: 'Invlaid Password'})
        }

        const token = jwt.sign({userId: user._id,}, secretkey)

        res.status(200).json({token})
    } catch (error) {
        res.status(404).json({message: 'Failed to login'})
    }
})