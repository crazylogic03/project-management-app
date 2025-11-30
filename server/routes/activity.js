const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/**LogActivity*/
router.post("/", async (req, res) => {
    try {
        const { action, userId, boardId, cardId } = req.body;

        const activity = await prisma.activity.create({
            data: {
                action,
                userId,
                boardId,
                cardId,
            },
        });

        res.json(activity);
    } catch (err) {
        console.error("❌ Error logging activity:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/**GetActivity*/
router.get("/:boardId", async (req, res) => {
    try {
        const logs = await prisma.activity.findMany({
            where: { boardId: Number(req.params.boardId) },
            include: { user: true, card: true },
            orderBy: { createdAt: "desc" }
        });

        res.json(logs);
    } catch (err) {
        console.error("❌ Error fetching activity:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
