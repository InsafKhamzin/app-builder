const express = require('express');
const router = express.Router();
const AuthService = require('../../../services/authUser');
const auth = require('../../middlewares/auth');

const {
    registerValidation,
    loginValidation,
    tokenValidation
} = require('../../validators/authValidator');

const authService = new AuthService();

// @route POST auth/register
// @desc register user

router.post('/register', registerValidation,
    async (req, res, next) => {
        try {
            const result = await authService.registerUser(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });


// @route POST auth/login
// @desc login user

router.post('/login', loginValidation,
    async (req, res, next) => {
        try {

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
        tokenValidation,
    ],
    async (req, res, next) => {
        try {
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
        tokenValidation,
    ],
    async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const userId = req.user.id;

            await authService.revokeToken({ refreshToken, userId });
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });


module.exports = router;