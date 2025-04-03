// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const connectDB = require("./src/config/db");
// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => res.send("API is running..."));

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");  // Add this line to import userRoutes
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User"); // Import the User model
const { v4: uuidv4 } = require('uuid'); // For generating unique game IDs
const math = require('mathjs'); // For safe expression evaluation

const User = require("./models/User");
const Game = require("./models/Game"); // Import Game model

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins (for now, change in production)
        methods: ["GET", "POST"],
    },
});



// === State Management ===
// Store online users
let onlineUsers = {}; // { userId: { socketId: socket.id, name: user.name } } <= Store name too!
let activeGames = {}; // { gameId: { player1Id, player2Id, puzzle, startTime, timerId, timeLimitSeconds } }
const GAME_TIME_LIMIT_SECONDS = 60; // Game duration

// Share onlineUsers with Express routes
app.set('onlineUsers', onlineUsers);

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  // Add this line to use userRoutes

// Helper function to get user details for online users
async function getOnlineUserDetails() {
    const onlineUserIds = Object.keys(onlineUsers);
    if (onlineUserIds.length === 0) {
        return [];
    }
    try {
        // Fetch user details directly from DB
        const users = await User.find({ _id: { $in: onlineUserIds } })
                                .select("_id name playerId"); // Select necessary fields
        return users;
    } catch (err) {
        console.error("Error fetching online user details:", err);
        return []; // Return empty on error
    }
}

// Function to emit the updated list
async function emitOnlineUsersUpdate() {
    const userDetails = await getOnlineUserDetails();
    console.log("Emitting update-online-users with details:", userDetails); // For debugging
    io.emit("update-online-users", userDetails); // Emit array of user objects
}

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
    let currentUserId = null; // Keep track of the user ID for this socket

    socket.on("user-online", async (userId) => { // Mark function as async
        if (userId && !onlineUsers[userId]) { // Avoid adding if already exists for this session
            currentUserId = userId;
            onlineUsers[userId] = socket.id;
            console.log(`User online: ${userId}`);
            app.set('onlineUsers', onlineUsers); // Update shared state
            await emitOnlineUsersUpdate(); // Emit updated list with details
        }
    });

    socket.on("disconnect", async () => { // Mark function as async
        // Find user ID associated with this socket ID
        const disconnectedUserId = Object.keys(onlineUsers).find(
            (userId) => onlineUsers[userId] === socket.id
        );

        if (disconnectedUserId) {
            delete onlineUsers[disconnectedUserId];
            console.log(`User disconnected: ${disconnectedUserId}`);
            app.set('onlineUsers', onlineUsers); // Update shared state
            await emitOnlineUsersUpdate(); // Emit updated list with details
        } else {
            // Fallback if currentUserId was set (covers cases where disconnect happens before 'user-online' fully processes?)
            if (currentUserId && onlineUsers[currentUserId] === socket.id) {
                 delete onlineUsers[currentUserId];
                 console.log(`User disconnected (fallback): ${currentUserId}`);
                 app.set('onlineUsers', onlineUsers); // Update shared state
                 await emitOnlineUsersUpdate(); // Emit updated list with details
            } else {
                 console.log(`Socket ${socket.id} disconnected without associated user.`);
            }
        }
        currentUserId = null; // Clear the userId on disconnect
    });

    // Heartbeat handling - current implementation only updates socket ID, consider adding timestamp logic if needed for timeouts
    socket.on("heartbeat", (userId) => {
        if (userId && onlineUsers[userId]) {
            console.log(`Heartbeat received from ${userId}`); // Debugging
            onlineUsers[userId] = socket.id; // Keep user marked as online
            // Optionally update a 'last seen' timestamp here
        }
    });
});

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));