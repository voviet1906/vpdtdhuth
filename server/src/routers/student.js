const express = require('express');
const router = express.Router();

const studentController = require('../app/controllers/StudentController');
const verifyRole = require('../app/middlewares/verifyRole');
const upload = require('../app/middlewares/uploadMulter');

router.get('/certification/:id', verifyRole.isUser, studentController.getBasicById);

router.use(verifyRole.isAdmin);
router.post('/file', upload.single('file'), studentController.addFromFile);
router.delete('/:id', studentController.delete);
router.get('/:id', studentController.getById);
router.put('/:id', studentController.update);
router.post('/', studentController.add);
router.get('/', studentController.get);

module.exports = router;
