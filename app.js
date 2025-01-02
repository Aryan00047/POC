require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');
const candidateRoutes = require('./routes/candidates');
const userRoutes = require('./routes/user');
const hrRoutes = require('./routes/hr')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', userRoutes); // Corrected to include leading slash
app.use('/api/candidate', candidateRoutes);
app.use('/api/hr', hrRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});

// Start server
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL); // Connect to MongoDB
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error.message);
    }
};

start();
