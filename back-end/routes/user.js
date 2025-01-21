const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser } = require('../controllers/registerAndLoginController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/logout", logoutUser);

module.exports = router;
