const express = require('express');
const router = express.Router({ mergeParams: true });
const CustomerAuthService = require('../../../services/authCustomer');
const auth = require('../../middlewares/auth');
const { registerValidation, loginValidation, tokenValidation } = require('../../validators/authValidator');

const authService = new CustomerAuthService();

// @route POST auth/register
// @desc register customer

router.post('/register',
    registerValidation,
    async (req, res) => {
        const result = await authService.registerCustomer(req.body);
        res.json(result);
    });

// @route POST auth/login
// @desc login user

router.post('/login',
    loginValidation,
    async (req, res) => {
        const result = await authService.loginCustomer(req.body);
        res.json(result);
    });

// @route PUT auth/refresh
// @desc refresh token

router.put('/refresh',
    [
        auth,
        tokenValidation
    ],
    async (req, res) => {
        const { refreshToken } = req.body;
        const customerId = req.user.id;
        const result = await authService.refresh({ refreshToken, customerId });
        res.json(result);
    });

// @route DELETE auth/revoke
// @desc revoke token

router.delete('/revoke',
    [
        auth,
        tokenValidation
    ],
    async (req, res) => {
        const { refreshToken } = req.body;
        const customerId = req.user.id;

        await authService.revokeToken({ refreshToken, customerId });
        res.status(200).send();
    });

module.exports = router;