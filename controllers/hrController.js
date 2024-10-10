// controllers/hrController.js
const HR = require('../models/hr/register'); // Ensure this is the correct model
const bcrypt = require('bcrypt');

// HR registration handler
const registerHR = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received password:", password); // Log the received password

  try {
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newHR = new HR({ name, email, password: hashedPassword });
    const savedHR = await newHR.save();

    res.status(201).json({ message: 'HR registered successfully', hr: savedHR });
  } catch (error) {
    console.error("Error during HR registration:", error); // Log the full error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// HR login handler
const loginHR = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hr = await HR.findOne({ email });
    if (!hr) {
      return res.status(404).json({ message: 'HR not found' });
    }

    const match = await bcrypt.compare(password, hr.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', hr });
  } catch (error) {
    console.error("Error during HR login:", error); // Log the full error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the functions
module.exports = {
  registerHR,
  loginHR,
};
