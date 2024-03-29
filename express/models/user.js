const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  verified: {
    type: Boolean,
    required: false,
  },
  verificationToken: String,
  age: {
    type: String,
  },
  crushes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  recievedLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
  },
  profileImages: [
    {
      type: String,
    },
  ],
  lookingFor: [
    {
      type: String,
    },
  ],
});

const Usermodel = mongoose.model("User", Userschema);
module.exports = Usermodel;
