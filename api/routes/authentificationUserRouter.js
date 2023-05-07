var express = require('express');
var router = express.Router();
const authController = require('../controllers/authentificationUserController');

router.post('/login', authController.getAuthentificationToken);

module.exports = router;