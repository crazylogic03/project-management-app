const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

/* ---------------- GET CARD DETAILS ---------------- */
router.get("/details/:cardId", async (req, res) => {
    try {
        const cardId = Number(req.params.cardId);

        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: {
                comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
                labels: { include: { label: true } },
            },
        });

        if (!card) return res.status(404).json({ message: "Card not found" });

        res.json(card);
    } catch (err) {
        console.error("❌ Error fetching card details:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ---------------- CREATE CARD ---------------- */
router.post("/:listId", async (req, res) => {
    try {
        const { title, description, dueDate, priority, boardId, userId } = req.body;
        const { listId } = req.params;

        const lastCard = await prisma.card.findFirst({
            where: { listId: Number(listId) },
            orderBy: { order: "desc" },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 0;

        const card = await prisma.card.create({
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                listId: Number(listId),
                boardId,
                order: newOrder,
            },
        });

        // ✅ ACTIVITY LOG — TASK CREATED
        await prisma.activity.create({
            data: {
                action: "CREATE_TASK",
                message: `Added task "${card.title}"`,
                cardId: card.id,
                boardId,
                userId
            }
        });

        res.json(card);
    } catch (err) {
        console.error("❌ Error creating card:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ---------------- UPDATE CARD ---------------- */
router.put("/:cardId", async (req, res) => {
    try {
        const { title, description, dueDate, priority, completed, userId } = req.body;

        const data = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (priority !== undefined) data.priority = priority;
        if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
        if (completed !== undefined) data.completed = completed;

        const card = await prisma.card.update({
            where: { id: Number(req.params.cardId) },
            data,
        });

        // ✅ ACTIVITY LOG — TASK UPDATED
        await prisma.activity.create({
            data: {
                action: "UPDATE_TASK",
                message: `Updated task "${card.title}"`,
                cardId: card.id,
                boardId: card.boardId,
                userId
            }
        });

        res.json(card);
    } catch (err) {
        console.error("❌ Error updating card:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ---------------- DELETE CARD ---------------- */
router.delete("/:cardId", async (req, res) => {
    try {
        const card = await prisma.card.findUnique({
            where: { id: Number(req.params.cardId) }
        });

        await prisma.card.delete({
            where: { id: Number(req.params.cardId) }
        });

        // ✅ ACTIVITY LOG — TASK DELETED
        await prisma.activity.create({
            data: {
                action: "DELETE_TASK",
                message: `Deleted task "${card.title}"`,
                boardId: card.boardId,
                userId: card.boardId // same user owner assumption
            }
        });

        res.json({ message: "Card deleted" });
    } catch (err) {
        console.error("❌ Error deleting card:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ---------------- DRAG & DROP ---------------- */
router.patch("/move", async (req, res) => {
    try {
        const { cardId, toListId, newOrder, userId } = req.body;

        const card = await prisma.card.update({
            where: { id: Number(cardId) },
            data: {
                listId: Number(toListId),
                order: newOrder,
            }
        });

        // ✅ ACTIVITY LOG — TASK MOVED
        await prisma.activity.create({
            data: {
                action: "MOVE_TASK",
                message: `Moved task "${card.title}"`,
                cardId: card.id,
                boardId: card.boardId,
                userId
            }
        });

        res.json(card);
    } catch (err) {
        console.error("❌ Error moving card:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
