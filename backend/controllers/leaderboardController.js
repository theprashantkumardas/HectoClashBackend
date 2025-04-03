const LeaderBoard = require('../models/LeaderBoard.js');
const User = require('../models/User.js');


// yeh code players ka score update kar raha h
exports.submitScore = async(req,res)=>{
  const { score, won } = req.body;
  const userId = req.user._id;

  try{
    let entry = await LeaderBoard.findOne({ user: userId });
    if(!entry){
     entry = new LeaderBoard(
      {
        user: userId,
        score: score,
        totalwins: won ? 1 : 0,
        isActive: true,
      }
     )
    }else{
      entry.totalgames += 1;
      if(won) entry.totalwins += 1;
      entry.score = Math.max(entry.score, score);
      entry.isActive = true;
    }
    await entry.save();
    res.json({
      success: true,
      message: "Score submitted successfully",
      entry
    })
  }
  catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


// ranking kar rahe h players kko top 10 m
exports.getLeaderboard = async(req,res)=>{
  try{
    const topPlayers = await LeaderBoard.find({ isActive: true })
      .populate("user", "name email")
      .sort({ score: -1 })
      .limit(10);

    res.json({
      success: true,
      topPlayers,
    });
  }catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// isme rank check karenge

exports.getRank = async(req,res)=>{
  const userId = req.user._id;
  try {
    const users = await LeaderBoard.find().sort({ score: -1 }).select("user score");
    const rank = users.findIndex((entry) => entry.user.toString() === userId.toString());

    if (rank === -1) return res.status(404).json({ error: "User not found" });

    res.json({ userId, rank: rank + 1 });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}