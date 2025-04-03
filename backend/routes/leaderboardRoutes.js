const express = require('express');
const { submitScore, getLeaderboard, getRank } = require('../controllers/leaderboardController.js');
const { protect } = require('../middleware/leaderboardMiddleware.js');

const router = express.Router();


router.post("/submit-score",protect, submitScore);
router.get("/leaderboard", getLeaderboard);
router.get("/user-rank", protect ,getRank);

module.exports = router;