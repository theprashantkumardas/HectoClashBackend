const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
