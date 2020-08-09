const express = require('express');
const router = express.Router();
const AppService = require('../../../services/app');

const appService = new AppService();

router.get('/', async (req, res) =>{
    const result = await appService.getMain(req.params.appId);
    res.json(result);
});

module.exports = router;