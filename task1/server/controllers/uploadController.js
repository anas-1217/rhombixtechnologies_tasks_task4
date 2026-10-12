exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
};
