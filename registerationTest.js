const mongoose = require('mongoose');
const Register = require('./models/candidate/register'); // Adjust the path as necessary

// Load environment variables from .env file
require('dotenv').config();

// Use the MongoDB connection string from the environment variable
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async (url) => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');

    // Test data
    const testCandidate = new Register({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword',
    });

    await testCandidate.save();
    console.log('Candidate saved successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation
  }
};

connectDB(MONGODB_URL);
