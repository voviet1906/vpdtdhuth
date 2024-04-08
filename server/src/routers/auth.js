const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');
const verify = require('../app/middlewares/verifyToken');

router.post('/login', authController.login);
router.get('/refresh-token', authController.refreshToken);
router.use(verify);
router.delete('/logout', authController.logout);

module.exports = router;
