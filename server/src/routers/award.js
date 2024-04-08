const express = require('express');
const router = express.Router();

const awardController = require('../app/controllers/AwardController');

router.get('/respond', awardController.respond);
router.get('/', awardController.submission);

module.exports = router;
