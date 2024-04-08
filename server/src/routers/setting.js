const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/SettingController');
const verify = require('../app/middlewares/verifyToken');
const verifyRole = require('../app/middlewares/verifyRole');

router.use(verify);
router.post('/', verifyRole.isAdmin, userController.create);
router.patch('/', verifyRole.isAdmin, userController.update);
router.get('/:id', verifyRole.isAdminOrManager, userController.getOne);
router.get('/', verifyRole.isAdminOrManager, userController.get);

module.exports = router;
