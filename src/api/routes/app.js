const express = require('express');
const router = express.Router();
const AppService = require('../../services/app');
const ObjectId = require('mongoose').Types.ObjectId;
const auth = require('../middlewares/auth');

const appService = new AppService();

// @route POST app/set
// @desc Create app styles

router.post('/', async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ msg: 'Body is empty' });
        }
        const app = await appService.createApp(JSON.stringify(req.body));
        res.json(app);
    } catch (error) {
        next(error);
    }
});

// @route POST app/set
// @desc Update app styles

router.put('/:appId', async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ msg: 'Body is empty' });
        }

        if (!ObjectId.isValid(req.params.appId)) {
            return res.status(400).json({ msg: 'Invalid app id' })
        }
        const app = await appService.updateApp(JSON.stringify(req.body), req.params.appId);
        res.json(app);
    } catch (error) {
        next(error);
    }
});

router.get('/:appId', async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.appId)) {
            return res.status(400).json({ msg: 'Invalid app id' })
        }
        const app = await appService.getApp(req.params.appId);
        res.json(app);
    } catch (error) {
        next(error);
    }
});

router.put('/:appId/link', [auth], async (req, res, next) => {
    try {
        const appId = req.params.appId;
        const userId = req.user.id;

        if (!ObjectId.isValid(req.params.appId)) {
            return res.status(400).json({ msg: 'Invalid app id' })
        }

        const app = await appService.linkToUser({appId, userId});
        res.json(app);
    } catch (error) {
        next(error);
    }
});


module.exports = router;