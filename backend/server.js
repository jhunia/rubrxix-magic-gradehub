const express = require("express");
const connectDB = require("./database");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON data
app.use(cors()); // Allow API access from frontend

// Connect to MongoDB
connectDB();

// Route to post or get users
const userRoutes = require("./routes/userRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const assignmentsRoutes = require("./routes/assignmentsRoutes");
// const aiRoutes = require('./routes/ai');
app.use("/api", userRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/assignments", assignmentsRoutes);
//app.use('/api/ai', aiRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
