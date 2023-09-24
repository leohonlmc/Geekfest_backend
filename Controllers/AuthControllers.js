const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const { toDataURL } = require("qrcode");

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

module.exports.generateSecret = async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.params.id });

    if (user.verified === false) {
      //generate QR code
      const secret = speakeasy.generateSecret({ length: 20 });
      const dataURL = await toDataURL(secret.otpauth_url);
      user.verified = true;
      user.secret = secret.base32;
      user.qrcode = dataURL;
      user.save();

      res.json({ secret: secret.base32, dataURL, verified: false });
    } else {
      res
        .status(200)
        .json({ secret: user.secret, dataURL: user.qrcode, verified: true });
    }
  } catch (error) {
    console.error("Error generating secret:", error);
    res.status(500).json({ error: "Error generating secret" });
  }
};

module.exports.verifyToken = async (req, res) => {
  try {
    const { token, secret } = req.body;

    if (!token || !secret) {
      return res.status(400).json({ error: "Token and secret are required" });
    }

    // Assuming 'sub' is the unique identifier for the user.
    const user = await User.findOne({ sub: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });

    if (verified) {
      // Optionally update the user's verification status in the database.
      user.verified = true;
      await user.save();
      res.json({ verified });
    } else {
      res.status(200).json({ message: "fake" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Error verifying token" });
  }
};
