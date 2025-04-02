const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;