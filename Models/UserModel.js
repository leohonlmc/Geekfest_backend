const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is Required"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "First name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },

  icon: {
    type: String,
    default: "user.jpeg",
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },

  sub: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  secret: {
    type: String,
  },
  qrcode: {
    type: String,
  },
});

module.exports = mongoose.model("Users", userSchema);
