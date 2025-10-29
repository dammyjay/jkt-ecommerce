const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");

// Profile page route
router.get("/profile", getProfile);

module.exports = router;
