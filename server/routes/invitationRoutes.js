const express = require("express");
const { sendInvitation, getInvitation, acceptInvitation, declineInvitation } = require("../controllers/invitationController");

const router = express.Router();

router.post("/send", sendInvitation);
router.get("/:token", getInvitation);
router.post("/accept", acceptInvitation);
router.post("/decline", declineInvitation);

module.exports = router;
