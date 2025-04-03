// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    playerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // --- New Fields for Stats ---
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 }, // If timeouts/simultaneous incorrect are draws
    rating: { type: Number, default: 1000 }, // Example starting ELO/MMR
    totalGamesPlayed: { type: Number, default: 0 },
     // You might add status later:
    // status: { type: String, enum: ['online', 'offline', 'in-game'], default: 'offline' }
  },
  { timestamps: true }
);

// Hash password before saving (existing)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method (existing)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);