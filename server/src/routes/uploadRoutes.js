const express = require("express");
const multer = require("multer");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|svg/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  // Convert buffer to base64 data URI
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  res.send({
    message: "Image uploaded and converted to persistent format",
    image: dataURI,
  });
});

module.exports = router;