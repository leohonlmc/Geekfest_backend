const { googleRegister, getUser } = require("../Controllers/AuthControllers");
const { uploadImage, getAllImage } = require("../Controllers/ImageControllers");

const router = require("express").Router();

router.post("/google/register", googleRegister);
router.get("/user/:id", getUser);

router.post("/upload/image", uploadImage);

router.get("/allImages/:sub", getAllImage);

module.exports = router;
