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
});

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });

//   if (user) {
//     if (user.regStatus === "Pending") {
//       throw Error("User is not verified");
//     }

//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect password");
//   }
//   throw Error("incorrect email");
// };

module.exports = mongoose.model("Users", userSchema);
