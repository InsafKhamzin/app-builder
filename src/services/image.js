const ImageEntity = require('../models/Image');
const { uploadToCloud, getResized, getCompressed } = require('../utils/cloudinary');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

module.exports = class ImageService {
    async uploadAndSave(buffer) {
        try {
            const imageId = mongoose.Types.ObjectId();
            const uploadedImage = await uploadToCloud(buffer, imageId);
            const imageName = `${uploadedImage.public_id}.${uploadedImage.format}`;            
            const small =  getResized(imageName, 540, 405);
            const compressed = getCompressed(imageName);
            
            const newImage = new ImageEntity({
                _id: imageId,
                original: uploadedImage.url,
                original_low: compressed,
                small: small
            });

            const image = await newImage.save();

            return image;

        } catch (error) {
            logger.error(`ImageService uploadAndSave ex: ${error.message}`);
            throw error;
        }
    }
};