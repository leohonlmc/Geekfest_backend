const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.googleRegister = async (req, res, next) => {
  try {
    const password = "NA";
    const loginType = "google";
    const { sub, username, firstName, lastName, email, icon } = req.body;

    const findUser = await User.findOne({ sub });
    const findEmail = await User.findOne({ email });

    if (!findUser && findEmail) {
      //return error
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (!findUser) {
      const user = await User.create({
        sub,
        username,
        firstName,
        lastName,
        email,
        password,
        icon,
        loginType,
      });
    }

    const user = await User.findOne({ sub });

    const token = createToken(user.sub);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
      sameSite: "none",
    });

    res.status(200).json({
      user: user.sub,
      status: true,
      token: token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ sub: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};