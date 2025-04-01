const mongoose = require("mongoose");

const gameModel = new mongoose.Schema({});

const Game = mongoose.model("Game", gameModel);

module.exports = Game;
