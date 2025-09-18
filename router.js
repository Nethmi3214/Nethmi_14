const express = require('express'); 
const router = express.Router();
const controller = require('./controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.get('/claims', controller.getClaims);
router.get('/claims/:id', controller.getEdit);
router.post('/addClaims', upload.single('file'), controller.addClaims); 
router.post('/updateClaims', upload.single('file'), controller.updateClaims);
router.post('/deleteClaims', controller.deleteClaims);
router.get('/searchBar', controller.searchBar);
router.get('/match', controller.match);

module.exports = router;
