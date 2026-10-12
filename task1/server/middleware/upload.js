const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (allowed.test(ext) && allowed.test(file.mimetype.split('/')[1])) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
