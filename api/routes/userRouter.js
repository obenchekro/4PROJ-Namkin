var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('../middleware/authentificationToken');

router.get('/', jwt.authenticateToken, userController.getAllUsers);
router.get('/:id', jwt.authenticateToken, userController.getUserById);
router.post('/', jwt.authenticateToken, userController.createUser);
router.post('/many-users', jwt.authenticateToken, userController.createManyUsers)
router.delete('/:id', jwt.authenticateToken, userController.deleteUserById);
router.patch('/:id/username', jwt.authenticateToken, userController.updateUsernameById);
router.patch('/:id/first-name', jwt.authenticateToken, userController.updateFirstNameById);
router.patch('/:id/last-name', jwt.authenticateToken, userController.updateLastNameById);
router.patch('/:id/email', jwt.authenticateToken, userController.updateUserEmailById);
router.patch('/:id/password', jwt.authenticateToken, userController.updateUserPasswordById);
router.patch('/:id/is-admin', jwt.authenticateToken, userController.updateUserIsAdminById);

module.exports = router;