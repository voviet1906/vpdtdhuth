const express = require('express');
const router = express.Router();

const semesterController = require('../app/controllers/SemesterController');
const verify = require('../app/middlewares/verifyToken');
const verifyRole = require('../app/middlewares/verifyRole');

router.get('/', semesterController.index);

router.use(verify);
router.delete('/:id', verifyRole.isAdmin, semesterController.destroy);
router.post('/', verifyRole.isAdmin, semesterController.create);

module.exports = router;
