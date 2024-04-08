const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const verifyRole = require('../app/middlewares/verifyRole');

router.patch('/change-password', userController.changePassword);
router.get('/get-user', verifyRole.isManager, userController.getUser);

router.use(verifyRole.isAdmin);
router.get('/:id', userController.detail);
router.patch('/:id', userController.update);
router.patch('/:id/reset-password', userController.resetPassword);
router.get('/', userController.getManagerOrUser);
router.post('/', userController.create);

module.exports = router;
