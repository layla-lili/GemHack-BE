const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./media", //starts from app.js >> the destination where we will save our images
  filename: (req, file, cb) => {
    console.log("🚀 ~ file: multer.js ~ line 6 ~ file", file);
    cb(null, `${Date.now()}-${req.body.name}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
