const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTaskAnalytics } = require("../controllers/analyticsController");

router.get("/", authMiddleware, getTaskAnalytics);

module.exports = router;