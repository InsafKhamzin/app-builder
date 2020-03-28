const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const AuthService = require('../../services/auth');
const auth = require('../middlewares/auth');

const authService = new AuthService();

// @route POST api/auth/register
// @desc register user

router.post('/register',
    [
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


// @route POST api/auth/login
// @desc login user

router.post('/login',
    [
        check('email', 'Email is required').notEmpty(),
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

// @route PUT api/auth/refresh
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