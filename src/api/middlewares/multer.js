const multer = require('multer');
const config = require('config')

const storage = multer.memoryStorage()

module.exports = multer(
    {
        storage: storage,
        limits: { fileSize: parseInt(config.get('imageUpload.maxSizeMb')) * 1024 * 1024 },
        fileFilter: function (req, file, cb) {
            const fileRegex = new RegExp(config.get('imageUpload.allowedTypesRegex'));
            const fileName = file.originalname;

            if (!fileName.match(fileRegex)) {
                return cb(new Error('Invalid file type'));
            }
            cb(null, true);
        }
    })
    .single('image');