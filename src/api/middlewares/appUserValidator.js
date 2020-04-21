//This middleware is used to check whether app belongs to user

const App = require('../../models/App');
const ClientError = require('../../common/clientError');

//use after auth middleware
module.exports = async (req, res, next) => {
    const appId = req.params.appId;
    const userId = req.user.id;
    try {
        const app = await App.findById(appId);
        if (!app) {
            throw new ClientError('App not found', 404)
        }
        if (!app.user || app.user.toString() !== userId) {
            throw new ClientError('Access denied', 403)
        } 
    } catch (error) {
        next(error);
    }    
    next();   
}