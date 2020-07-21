const logger = require('../utils/logger');
const App = require('../models/App');
const Category = require('../models/Category')
const ClientError = require('../common/clientError');
const { getDefaultCategoryTree } = require('../utils/categoryTree');

module.exports = class AppService {

    async createApp(config) {
        try {
            const newApp = new App({
                config
            });
            const app = await newApp.save();

            //create default catefory tree
            const defaultCategoryTree = await getDefaultCategoryTree(app._id);

            await Category.insertMany(defaultCategoryTree);

            return app;
        } catch (error) {
            logger.error(`AppService createApp ex: ${error.message}`);
            throw error;
        }
    }

    async updateApp(config, appId) {
        try {
            const app = await App.findById(appId);
            if (!app) {
                throw new ClientError('App not found', 404);
            }
            app.config = config;
            await app.save();

            return app;
        } catch (error) {
            throw error;
        }
    }

    async getApp(appId) {
        try {
            const app = await App.findById(appId);
            if (!app) {
                throw new ClientError('App not found', 404);
            }
            return app;
        } catch (error) {
            throw error;
        }
    }

    async linkToUser({ appId, userId }) {
        try {
            const app = await App.findById(appId);
            if (!app) {
                throw new ClientError('App not found', 404);
            }
            if (app.user) {
                throw new ClientError('App already linked', 400);
            }
            app.user = userId;
            await app.save()

            return app;
        } catch (error) {
            throw error;
        }
    }
}