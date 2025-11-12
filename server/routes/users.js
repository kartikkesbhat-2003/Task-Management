const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { listUsers, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', auth, authorize('admin'), listUsers);
router.put('/:id', auth, authorize('admin'), updateUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
