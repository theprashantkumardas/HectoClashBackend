const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { Server } = require("socket.io");
const http = require("http");

// require("./src/routes/userRoutes")

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Import Routes
// app.use("/api/auth", require("./src/routes/authRoutes"));
// app.use("/api/users", );
// app.use("/api/game", require("./src/routes/gameRoutes"));

// WebSocket Logic
// require("./src/config/socket")(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
