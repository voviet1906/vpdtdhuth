const express = require('express');
const router = express.Router();

const activitiesController = require('../app/controllers/ActivitiesController');
const verifyRole = require('../app/middlewares/verifyRole');

router.get('/unit/:id', verifyRole.isManager, activitiesController.getActivitiesByUnit);

router.get('/approve', verifyRole.isUser, activitiesController.getActivitiesApprove);
router.get('/year/:id', verifyRole.isUser, activitiesController.getActivitiesByYear);
router.get('/:id/report', verifyRole.isUser, activitiesController.getReport);
router.patch('/:id/report', verifyRole.isUser, activitiesController.reportActivity);

router.get('/:id', verifyRole.isManagerOrUser, activitiesController.getActivity);

router.use(verifyRole.isUser);
router.patch('/:id', activitiesController.updateActivity);
router.delete('/:id', activitiesController.deleteActivity);
router.post('/', activitiesController.createActivity);

module.exports = router;
