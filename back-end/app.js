require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');
const cors = require("cors");
const candidateRoutes = require('./routes/candidates');
const userRoutes = require('./routes/user');
const hrRoutes = require('./routes/hr');
const adminRoutes = require('./routes/admin');
const { createAdminAccount } = require('./controllers/adminController'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/hr', hrRoutes);  // Ensure all routes have `/api/` prefix for consistency
app.use('/api/admin', adminRoutes);  // Correct the route to `/api/admin` for consistency

// Root route
app.get('/', (req, res) => {
  res.send('Job Portal API is running...');
});

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL); // Connect to MongoDB
    await createAdminAccount(); // Ensure the admin account is created
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
  }
};

start();
