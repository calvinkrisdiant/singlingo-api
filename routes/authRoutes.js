const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser, getUsers, logoutUser, getUserById } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser); // Endpoint untuk logout
router.get('/users/:id', getUserById); // Endpoint untuk mendapatkan pengguna berdasarkan ID, dilindungi oleh authMiddleware
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);

module.exports = router;
