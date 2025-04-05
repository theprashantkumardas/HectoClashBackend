// routes/leaderboardRoutes.js
const express = require('express');
const { getGlobalLeaderboard } = require('../controllers/leaderboardController'); // Adjust path
// Optional: Add authentication middleware if needed
// const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for the global leaderboard
// Example: GET /api/leaderboard/global?limit=20
router.get('/global', getGlobalLeaderboard);

// Example routes for future expansion (uncomment when controllers are ready)
// router.get('/country/:countryName', getCountryLeaderboard);
// router.get('/college/:collegeName', getCollegeLeaderboard);


module.exports = router;