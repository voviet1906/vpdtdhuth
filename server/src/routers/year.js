const express = require('express');
const router = express.Router();

const yearController = require('../app/controllers/YearController');
const verifyRole = require('../app/middlewares/verifyRole');

router.get('/', yearController.index);

router.delete('/:id', verifyRole.isAdmin, yearController.destroy);
router.post('/', verifyRole.isAdmin, yearController.create);

module.exports = router;
