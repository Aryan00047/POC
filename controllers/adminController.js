const jwt = require('jsonwebtoken');
require('dotenv').config();

// Admin login
const loginAdmin = async (req, res) => {
  console.log("Login Amin requested ...");
  const { email, password } = req.body;

  try {
    // Fetch email and password from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail) {
      console.log("Admin not found");
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (password !== adminPassword) {
        console.log("Invalid credentials");
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials match, generate a JWT token
    const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log("Admin logged in successfully");
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        email: adminEmail
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
    loginAdmin,
}