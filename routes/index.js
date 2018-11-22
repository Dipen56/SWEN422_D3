var express = require('express');
var router = express.Router();

var controller = require('../controllers/main.controller');

router.get('/', controller.index);

router.get('/q1', controller.q1);

router.get('/q2', controller.q2);

router.get('/q3', controller.q3);

router.get('/data', controller.get_data);

module.exports = router;
