const express = require('express');
const router = express.Router();

const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');
const ImageService = require('../../../services/image');
const imageService = new ImageService();

router.post('/upload', auth, (req, res, next) => {
    upload(req, res, async(err) => {
        //multer errors
        if(err) {
            return res.json({ errors: [{ msg: err.message }] });
        }
        try {
            const result = await imageService.uploadAndSave(req.file.buffer);
            
            res.json(result);
        } catch(error) {           
            next(error);
        }
    })
}); 

module.exports = router;
