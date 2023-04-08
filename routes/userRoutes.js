const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/protected', userController.protected);
//router.get('/protected', authenticateUser, authorizeUser(['admin']), userController.protected);

module.exports = router;
