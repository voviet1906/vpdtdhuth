const express = require('express');
const router = express.Router();

const certificationController = require('../app/controllers/CertificationController');
const verify = require('../app/middlewares/verifyToken');
const verifyRole = require('../app/middlewares/verifyRole');
// const verifyReCAPTCHA = require('../app/middlewares/verifyReCAPTCHA');

router.post('/search', certificationController.getByStudentId);

router.use(verify);
router.use(verifyRole.isUser);
router.delete('/', certificationController.destroyByActivity);
router.post('/', certificationController.createCertification);
router.get('/:id', certificationController.getByActivity);

module.exports = router;
