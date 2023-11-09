const express = require('express');
const uploadImageController = require('../controllers/uploadImage');
const router = express.Router();
const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "--" + file.originalname);
    }
})

const upload = multer({ storage: imageStorage })

router.post('/upload', upload.single('image'), uploadImageController.uploadImage);

module.exports = router;