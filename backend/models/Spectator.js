const mongoose = require("mongoose");

const specatatorModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isWatching: {
      type: Boolean,
      default: true,
    },
    leftAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const Spectator = mongoose.model("Spectator", specatatorModel);

module.exports = Spectator;
