const express = require("express");
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

router.get("/", getMessages); // Changed to use query params
router.get("/:projectId", getMessages); // Keep for backward compatibility if needed

module.exports = router;
