// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomNum = Math.floor(Math.random() * 1e16);
    const filename = `cat-${Date.now()}-${randomNum}${ext}`;
    cb(null, filename);
  }
});

// Only images allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;