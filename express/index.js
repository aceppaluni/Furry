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
const bcrypt = require('bcryptjs');

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
            //console.log('Email already registered')
            return res.status(404).json({message: 'Pup already registered'})
        }

        //create a new pup
        const newUser = new User({
            name,
            email,
            password,
        })
        console.log("register point", newUser)
        
        //generate verification token for new pup
        newUser.verificationToken = crypto.randomBytes(20).toString('hex')

        //saving pup to DB
        await newUser.save()

        sendVerficationEmail(newUser.email, newUser.verificationToken);
    
        res.status(200).json({message: 'Pup registered successfully', userId: newUser._id})
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
            user: 'darrel96@ethereal.email',
            pass: 'V6EhZ9xyF6py2hSUs9'
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
};


//endpoint to verify user 
app.get('/verify/:token',async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({verificationToken: token});
        //console.log("User", user)

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

const generateSecrectKey = (id) => {
    
    const secretkey = crypto.randomBytes(32).toString('hex')

    return secretkey
}

const secretkey = generateSecrectKey()

//endpoint to login user 
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        
        if(!user) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        if(user.password !== password) {
            return res.json({message: 'Invlaid Password'})
        }

        const token = jwt.sign({userId: user._id,}, secretkey)

        res.status(200).json({token})
    } catch (error) {
        res.status(404).json({message: 'Failed to login'})
    }
})

//endpoint to get the data of a user 
app.get('/users/:userId', async (req, res) => {
    try {
        const {userId} = req.params

        const user = await User.findById(userId)

        if(!user) {
            return res.status(404).json({message: "User not found"})
        }

        return res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: "Failed to load users"})
    }
    //res.send('Hello')
})

// endpoint to update the user gender 
app.put('/users/:userId/gender', async(req, res) => {
    try {
        const {userId} = req.params
        const {gender} = req.body

        const user = await User.findByIdAndUpdate(userId, {gender: gender}, {new: true})
        console.log('gender:',user.gender)
        if(!user) {
            res.status(404).json({message: 'user not found'})
        }

        return res.status(200).json({message: 'user gender updated successfully'})
    } catch (error) {
        res.status(500).json({message: 'Failed to update gender'})
    }
}); 

//endpoint to update the user description 
app.put('/users/:userId/description', async(req, res) => {
    try {
        const {userId} = req.params;
        const {description} = req.body; 

        const user = await User.findByIdAndUpdate(userId, {description: description}, {new: true});

        if(!user) {
            res.status(404).json({message: 'user not found'})
        }

        return res.status(200).json({message: 'User description updated successfully'})
    } catch (error) {
        res.status(400).json({message: 'Failed to update description' })
    }
});

//endpoint to update user photos 
app.post("/users/:userId/profile-images", async(req, res) => {
    try {
        const {userId} = req.params;
        const {imageUrl} = req.body; 

        const user = await User.findById(userId)
        console.log(user)
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        user.profileImages.push(imageUrl);

        await user.save()

        return res.status(200).json({message: 'Images saved successfully', user})
    } catch (error) {
        res.status(500).json({ message: "Error updating images"})
    }
});

// endpoint to add looking for 
app.put('/users/:userId/looking-for', async(req, res) => {
    try {
        const {userId} = req.params;
        const {lookingFor} = req.body;

        const user = await User.findByIdAndUpdate(userId, {$addToSet: {lookingFor: lookingFor}}, {new: true})
        
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        await user.save()

        return res.status(200).json({message: 'selections updated successfully'})
    } catch (error) {
        res.status(500).json({ message: "Error updating looking for"})
    }
}); 

// endpoint to remove looking for 
app.put('/users/:userId/looking-for/remove', async(req, res) => {
    try {
        const {userId} = req.params;
        const {lookingFor} = req.body;

        const user = await User.findByIdAndUpdate(userId, {$pull: {lookingFor: lookingFor}}, {new: true})

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json({message: 'selections removed successfully'})
    } catch (error ) {
        res.status(500).json({message: 'Error removing looking for '})
    }
}); 

// below are new endpoints 


// endpoint to fetch user profiles 
app.get('/profiles', async (req, res) => {
    const {userId, gender, lookingFor} = req.query;
    try {
        let filter = {gender: gender === 'male' ? 'female' : 'male'} // for gender filtering 

        // add filtering based on lookingFor array - filtering to what logged in user is looking for 
        if(lookingFor) {
            filter.lookingFor = {$in: lookingFor}
        }

        const currentUser = await User.findById(userId)
        //.populate('matches', '_id')
        //.populate('crushes', "_id")
        console.log( 'user',currentUser)
        //extract the user ids of matches
       //const matchesIds = currentUser.matches.map((match) => match._id);
        
        //const friendIds = currentUser.matches.includes((friend) => friend._id); 
        //console.log('Matches:', currentUser.matches);

        // extracting user ids of crushes 
        //const crushesIds = currentUser.crushes.map((crush) => crush._id); 

        // getting user profiles 
        const profiles = await User.find(filter).where('_id').nin([userId])
        //console.log(profiles)
        return res.status(200).json({profiles})
        
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({message: 'Error fetching user profiles '})
    }
});

// endpoint to send a like to a user 
app.put('/send-like', async(req, res) => {
    const {currentUserId, selectedUserId} = req.body;

    try {
        await User.findByIdAndUpdate(selectedUserId, {$push: {recievedLikes: currentUserId}}); 
        await User.findByIdAndUpdate(selectedUserId, {$push: {crushes: selectedUserId}});

        res.sendStatus(200)
    } catch (error) {
        res.status(500).json({message: 'Error sending like'})
    }
}); 

//endpoint to get details of the received likes of users
app.get('/received-likes/:userId/details', async(req, res) => {
    const {userId }= req.params
    try {
        const user = await User.findById(userId); 

        if(!user) {
            return res.status(404).json({message: 'User not found'})
        }
        // fetch details of users who liked the current user 
        const receivedLikesDetails = [];
        for (const likedUserId of user.recievedLikes) {
            const likedUser = await User.findById(likedUserId); 
            if(!likedUserId) {
                receivedLikesDetails.push(likedUser)
            }
        }

        res.status(200).json({receivedLikesDetails})
    } catch (error) {
        res.status(500).json({message: 'error fetching received likes'})
    }
}); 

// endpoint to create match between two people 
app.post('/create-match', async(req, res) => {
    try {
        const {currentUserId, selectedUserId} = req.body; 

        //updates selected users crushes and matches array 
        await User.findByIdAndUpdate(selectedUserId, {
            $push: {matches: currentUserId},
            $pull: {crushes: currentUserId}
        }); 

        //updates current users and matches and received likes array 
        await User.findByIdAndUpdate(currentUserId, {
            $push: {matches: selectedUserId},
            $pull: { receivedLikes: selectedUserId}
        }); 
    } catch (error) {
        res.status(500).json({message: 'error creating match'})
    }
}); 

//endpoint to get all the matches of a user
app.get('/users/:userId/matches', async(req, res) => {
    try {
        const {userId} = req.params; 
        const user = await User.findById(userId); 

        if(!user) {
            return res.status(404).json({message: 'user not found '})
        }

        const matchIds = user.matches;
        const matches = await User.find({_id: {$in: matchIds}});
        //console.log( 'matches',matches)

        res.status(200).json({matches})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'error fetching user matches'})
    }
});

//users/65c92583070ea6dbb959d753/profile-images
  