const logger = require('../utils/logger');
const App = require('../models/App');
const ClientError = require('../common/clientError');

module.exports = class AppService{

    async createApp(config){
        try {
            const newApp = new App({
                config
            });
            const app = await newApp.save();
            return app;
        } catch (error) {
            logger.error(`AppService createApp ex: ${error.message}`);
            throw error;
        }
    }

    async updateApp(config, appId){
        try {
            const app = await App.findById(appId);
            if(!app){
                throw new ClientError('App not found', 404);
            }
            app.config = config;
            await app.save();

            return app;
        } catch (error) {
            throw error;
        }
    }

    async getApp(appId){
        try {
            const app = await App.findById(appId);
            if(!app){
                throw new ClientError('App not found', 404);
            }
            return app;
        } catch (error) {
            throw error;
        }
    }
}