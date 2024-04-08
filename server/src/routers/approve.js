const express = require('express');
const router = express.Router();

const approveController = require('../app/controllers/ApproveController');
const verifyRole = require('../app/middlewares/verifyRole');

router.use(verifyRole.isManager);
router.patch('/:id', approveController.update);
router.get('/:id', approveController.detail);

module.exports = router;
