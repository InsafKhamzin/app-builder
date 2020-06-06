const cloudinary = require('cloudinary').v2;
const config = require('config');

cloudinary.config({
    cloud_name: config.get('cloudinary.cloudName'),
    api_key: config.get('cloudinary.apiKey'),
    api_secret: config.get('cloudinary.apiSecret')
});

const uploadStream = (buffer, name) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ public_id: name }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }).end(buffer)
    });
}


const uploadToCloud = async (buffer, name) => {
    
    const result = await uploadStream(buffer, name)
    return result;
}

const getCompressed = (imageName) => {
    return cloudinary.url(imageName, { quality: 'auto' })
}

const getResized = (imageName, height, width) => {
    return cloudinary.url(imageName, { width: width, height: height, crop: "fill" })
}

module.exports = { uploadToCloud , getResized, getCompressed }