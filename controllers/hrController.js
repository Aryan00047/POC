const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HR = require('../models/hr/register');  // Adjust model name if necessary
const Job = require('../models/hr/postJob');  // Adjust model name if necessary

// HR Registration
const registerHR = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newHR = new HR({ name, email, password: hashedPassword });
        const savedHR = await newHR.save();
        res.status(201).json({ message: 'HR registered successfully', hr: savedHR });
    } catch (error) {
        console.error("Error during HR registration:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// HR Login
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
        // Include name and email in the token
        const token = jwt.sign({ id: hr._id, name: hr.name, email: hr.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, hr: { id: hr._id, name: hr.name, email: hr.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Post Job (accepting hrId in the route)
const postJob = async (req, res) => {
    const { hrId } = req.params; // Extract hrId from route params
    const { company, role, jobDescription, experienceRequired, package } = req.body;
    const hrTokenId = req.hr.id; // Extract HR ID from token

    if (hrId !== hrTokenId) {
        return res.status(403).json({ message: 'Access denied. You can only post jobs for your account.' });
    }

    try {
        // Automatically associate the HR's details with the job posting
        const newJob = new Job({
            hrId,  // Use hrId from the route
            name: req.hr.name,  // Automatically include HR's name
            email: req.hr.email,  // Automatically include HR's email
            company,
            role,
            jobDescription,
            experienceRequired,
            package
        });

        const savedJob = await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: savedJob });
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerHR, loginHR, postJob };
