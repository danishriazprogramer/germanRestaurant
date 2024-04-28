import multer from 'multer';

const fileUpload = async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/products/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
  });

  const upload = multer({ storage: storage }).single('img');
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'File upload failed' });
    }
    next();
  });
};

export { fileUpload };
