const mongoose = require("mongoose");
const Image = require("../Models/ImageModel");
const bcrypt = require("bcrypt");

module.exports.uploadImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({ sub: req.body.sub });

    console.log(req.body);

    if (!image) {
      const newImage = await Image.create({
        sub: req.body.sub,
        images: req.body.images,
      });
      res.status(201).json({ newImage });
    } else {
      image.images.push(req.body.images);
      await image.save();
      res.status(201).json({ image });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.getAllImage = async (req, res, next) => {
  try {
    const image = await Image.find({ sub: req.params.sub });
    res.status(200).json({ image });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
