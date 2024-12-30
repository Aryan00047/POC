const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require('../controllers/registerAndLoginController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
