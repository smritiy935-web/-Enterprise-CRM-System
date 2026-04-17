let multer;
try {
  multer = require('multer');
} catch (e) {
  console.error('CRITICAL: multier is not installed. Run "npm install multer" to enable photo uploads.');
}

const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

let upload;

if (multer) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
  });

  upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) return cb(null, true);
      cb(new Error("Error: File upload only supports images!"));
    }
  });
} else {
  // Fallback if multer missing (Prevent Crash)
  upload = {
    single: () => (req, res, next) => {
      console.warn('Upload attempted but multer is ignored/missing.');
      next();
    }
  };
}

module.exports = upload;
