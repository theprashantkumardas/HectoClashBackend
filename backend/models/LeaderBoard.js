const mongoose = require("mongoose");

const leaderboardModel = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rank:{
    type:Number,
    default:1000,
  },
  totalwins:{
    type:number,
    default:0
  }
})

const Leaderboard = mongoose.model("Leaderboard", leaderboardModel)

module.exports = Leaderboard