const mongoose = require("mongoose");

const gameModel = new mongoose.Schema({
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  questionSet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionSet",
    required: true,
  }],
  TotalViews: {
    type: Number,
    default: 0,
    min: 0
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: null,
  },
  gameStatus: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
});

const Game = mongoose.model("Game", gameModel);

module.exports = Game;
