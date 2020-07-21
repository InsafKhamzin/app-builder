const cache = require('memory-cache');

const putCache = (key, value) => {
    //cache expiration 24 hour
    const expires = 24 * 60 * 60 * 1000;
    cache.put(key, value, expires);
}

const getCache = (key) => {
    return cache.get(key);
}

const deleteCache = (key) =>{
    cache.del(key);
}

module.exports = { putCache, getCache, deleteCache }