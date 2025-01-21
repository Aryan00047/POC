// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");

// // Register User
// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Validate request body
//   if (!name || !email || !password || !role) {
//     console.log("All fields are required...")
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   const validRoles = ["admin", "hr", "candidate"];
//   if (!validRoles.includes(role.toLowerCase())) {
//     console.log("Invalid role specified...")
//     return res.status(400).json({ message: "Invalid role specified." });
//   }

//   try {
//     // Check if the user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       console.log("User already exists...")
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role.toLowerCase(),
//     });

//     // Save the user to the database
//     const savedUser = await newUser.save();
//     console.log("User registered sucessfully: ",user)
//     res.status(201).json({
//       message: "User registered successfully.",
//       user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };

// // Login User
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   // Validate request body
//   if (!email || !password) {
//     console.log("Email and password are required.")
//     return res
//       .status(400)
//       .json({ message: "Email and password are required." });
//   }

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found...")
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Invalid credentials...")
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     console.log("Login successful...")
//     res.status(200).json({
//       message: "Login successful.",
//       token,
//       role: user.role,
//       userId: user._id,
//     });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };

// module.exports = { registerUser, loginUser, logoutUser};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    console.log("All fields are required...");
    return res.status(400).json({ message: "All fields are required." });
  }

  const validRoles = ["admin", "hr", "candidate"];
  if (!validRoles.includes(role.toLowerCase())) {
    console.log("Invalid role specified...");
    return res.status(400).json({ message: "Invalid role specified." });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists...");
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser);

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Email and password are required.");
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found...");
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials...");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful...");
    res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};

// Logout User
const logoutUser = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Optionally, add the token to a blacklist here for invalidation

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
