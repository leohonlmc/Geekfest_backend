const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const imagesSchema = new mongoose.Schema({
  sub: {
    type: String,
  },
  images: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Images", imagesSchema);
