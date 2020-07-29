const express = require('express');
const router = express.Router();
const AppService = require('../../../services/app');
const { appIdValidation } = require('../../validators/appValidator');
const auth = require('../../middlewares/auth');
const { route } = require('./compilation');

const appService = new AppService();

// @route POST app/set
// @desc Create app styles

router.post('/', async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ errors: [{ msg: 'Body is empty' }] });
        }
        const app = await appService.createApp(JSON.stringify(req.body));
        res.json(app);
        
    } catch (error) {
        next(error);
    }
});

// @route POST app/set
// @desc Update app styles

router.put('/:appId', appIdValidation, async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ errors: [{ msg: 'Body is empty' }] });
        }

        const app = await appService.updateApp(JSON.stringify(req.body), req.params.appId);
        res.json(app);
    } catch (error) {
        next(error);
    }
});

router.get('/:appId', appIdValidation, async (req, res, next) => {
    try {
        const app = await appService.getApp(req.params.appId);
        res.json(app);
    } catch (error) {
        next(error);
    }
});

router.put('/:appId/link',
    [
        auth,
        appIdValidation
    ], async (req, res, next) => {
        try {
            const appId = req.params.appId;
            const userId = req.user.id;

            const app = await appService.linkToUser({ appId, userId });
            res.json(app);
        } catch (error) {
            next(error);
        }
    });

router.get('/:appId/main', appIdValidation, async (req, res) =>{
    const result = await appService.getMain(req.params.appId);
    res.json(result);
});


module.exports = router;