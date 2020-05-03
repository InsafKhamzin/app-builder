const express = require('express');
const router = express.Router({ mergeParams: true });
const { check, param, validationResult } = require('express-validator');
const AuthService = require('../../../services/authCustomer');
const auth = require('../../middlewares/auth');

const authService = new AuthService();

// @route POST auth/register
// @desc register customer

router.post('/register',
    [
        param('appId').isMongoId(),
        check('email', 'Invalid email format').isEmail(),
        check('password', 'Password is required').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await authService.registerUser(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });


// @route POST auth/login
// @desc login user

router.post('/login',
    [
        check('email', 'Invalid email format').isEmail(),
        check('password', 'Password is required').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array });
            }

            const result = await authService.loginUser(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route PUT auth/refresh
// @desc refresh token

router.put('/refresh',
    [
        auth,
        check('refreshToken', 'Refresh token is required').notEmpty(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { refreshToken } = req.body;
            const userId = req.user.id;

            const result = await authService.refresh({ refreshToken, userId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route DELETE auth/revoke
// @desc revoke token

router.delete('/revoke',
    [
        auth,
        check('refreshToken', 'Refresh token is required').notEmpty(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { refreshToken } = req.body;
            const userId = req.user.id;

            await authService.revokeToken({ refreshToken, userId });
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });


module.exports = router;