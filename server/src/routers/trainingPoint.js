const express = require('express');
const router = express.Router();

const trainingPointController = require('../app/controllers/TrainingPointController');
const verify = require('../app/middlewares/verifyToken');
const verifyRole = require('../app/middlewares/verifyRole');

router.get('/', trainingPointController.getAll);

router.use(verify);
router.use(verifyRole.isAdmin);
router.patch('/:id', trainingPointController.update);
router.get('/:id', trainingPointController.getTrainingPoint);
router.post('/', trainingPointController.create);

module.exports = router;
