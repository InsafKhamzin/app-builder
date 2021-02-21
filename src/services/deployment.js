const Deployment = require('../models/Deployment');
const ClientError = require('../common/clientError');
const { sendMessage } = require('../utils/botUtil');

module.exports = class DeploymentService {
    async addDeployment({ name, description, icon, screenshots, notifyBot }, appId) {
        const newDeployment = new Deployment({
            app: appId,
            name: name,
            description: description,
            icon: icon,
            screenshots: screenshots
        });
        await newDeployment.save();
        const deployment = await newDeployment
            .populate('icon')
            .populate('screenshots')
            .execPopulate();

        if (notifyBot === true) {
            var screensUrls = deployment.screenshots.map(screen=>screen.original).join('\n');

            const msg = `Deployment request...\n`+
            `App Id: ${appId}\n`+
            `App Name: ${name}\n`+
            `Description: ${description}\n`+
            `Icon:\n${deployment.icon.original}\n`+
            `Screenshots:\n${screensUrls}`;

            sendMessage(msg);
        }

        return deployment;
    }
}