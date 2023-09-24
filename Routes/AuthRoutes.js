const {
  googleRegister,
  getUser,
  generateSecret,
  verifyToken,
} = require("../Controllers/AuthControllers");
const { uploadImage, getAllImage } = require("../Controllers/ImageControllers");

const router = require("express").Router();

router.post("/google/register", googleRegister);
router.get("/user/:id", getUser);
router.get("/generate", generateSecret);
router.post("/verify", verifyToken);

router.post("/image/import", uploadImage);

router.get("/allImages/:sub", getAllImage);

module.exports = router;
