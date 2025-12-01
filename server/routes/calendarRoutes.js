const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/* ✅ LOAD TASKS INTO CALENDAR */
router.get("/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const tasks = await prisma.card.findMany({
            where: {
                board: {
                    OR: [
                        { createdBy: userId },
                        { members: { some: { userId } } }
                    ]
                }
            },
            include: { board: true }
        });

        const events = tasks
            .filter(t => t.dueDate)
            .map(task => ({
                id: task.id,
                title: task.title,
                type: "task",
                date: task.dueDate.toISOString().split("T")[0],
                time: task.dueDate.toTimeString().slice(0, 5),
                priority: task.priority || "Medium",
                project: task.board.title,
            }));

        res.json(events);
    } catch (err) {
        console.error("Calendar fetch error:", err);
        res.status(500).json({ message: "Failed to load calendar" });
    }
});

module.exports = router;