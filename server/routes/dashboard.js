const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/* ---------------- DASHBOARD DATA ---------------- */
router.get("/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        // ✅ BOARDS USER IS PART OF
        const boards = await prisma.board.findMany({
            where: {
                OR: [
                    { createdBy: userId },
                    { members: { some: { userId } } }
                ]
            },
            include: {
                lists: {
                    include: { cards: true }
                }
            }
        });

        const boardIds = boards.map(b => b.id);

        // ✅ ALL TASKS FROM THOSE BOARDS
        const tasks = await prisma.card.findMany({
            where: {
                boardId: { in: boardIds }
            },
            include: {
                board: {
                    select: { id: true, title: true }
                }
            },
            orderBy: { dueDate: "asc" }
        });

        // ✅ RECENT ACTIVITY
        const activities = await prisma.activity.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        res.json({
            boards,
            tasks,
            activities
        });

    } catch (err) {
        console.error("Dashboard API Error:", err);
        res.status(500).json({ message: "Dashboard failed" });
    }
});

module.exports = router;
