const express = require('express');
const router = express.Router({ mergeParams: true });
const DeploymentService = require('../../../services/deployment');
const { deploymentAddValidator} = require('../../validators/deploymentValidator');

const deploymentService = new DeploymentService();

router.post('/', deploymentAddValidator, async (req, res) => {
    const appId = req.params.appId;
    const result = await deploymentService.addDeployment(req.body, appId);
    res.json(result);
});

module.exports = router;