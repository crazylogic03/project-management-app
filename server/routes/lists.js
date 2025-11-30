const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/**
 * CREATE LIST
 * POST /api/lists/:boardId
 */
router.post("/:boardId", async (req, res) => {
    try {
        const { title } = req.body;
        const { boardId } = req.params;

        if (!title) return res.status(400).json({ message: "Title is required" });

        const lastList = await prisma.list.findFirst({
            where: { boardId: Number(boardId) },
            orderBy: { order: "desc" }
        });

        const newOrder = lastList ? lastList.order + 1 : 0;

        const list = await prisma.list.create({
            data: {
                title,
                order: newOrder,
                boardId: Number(boardId),
            },
        });

        res.json(list);
    } catch (err) {
        console.error("❌ Error creating list:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * RENAME LIST
 * PUT /api/lists/:listId
 */
router.put("/:listId", async (req, res) => {
    try {
        const { title } = req.body;

        const list = await prisma.list.update({
            where: { id: Number(req.params.listId) },
            data: { title }
        });

        res.json(list);
    } catch (err) {
        console.error("❌ Error renaming list:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * DELETE LIST (with cascade deletions)
 * DELETE /api/lists/:listId
 */
router.delete("/:listId", async (req, res) => {
    try {
        const listId = Number(req.params.listId);

        // 1️⃣ Get all cards inside this list
        const cards = await prisma.card.findMany({
            where: { listId },
            select: { id: true }
        });

        const cardIds = cards.map((c) => c.id);

        if (cardIds.length > 0) {
            // 🔥 Delete related card data FIRST
            await prisma.comment.deleteMany({ where: { cardId: { in: cardIds } } });
            await prisma.cardLabel.deleteMany({ where: { cardId: { in: cardIds } } });
            await prisma.attachment.deleteMany({ where: { cardId: { in: cardIds } } });
            await prisma.activity.deleteMany({ where: { cardId: { in: cardIds } } });

            // 🔥 Now delete cards
            await prisma.card.deleteMany({ where: { id: { in: cardIds } } });
        }

        // 2️⃣ Delete the list
        await prisma.list.delete({
            where: { id: listId }
        });

        res.json({ message: "List deleted successfully" });

    } catch (err) {
        console.error("❌ Error deleting list:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * REORDER LISTS
 * PATCH /api/lists/reorder
 */
router.patch("/reorder", async (req, res) => {
    try {
        const { lists } = req.body;

        const updates = lists.map((l) =>
            prisma.list.update({
                where: { id: l.id },
                data: { order: l.order }
            })
        );

        await prisma.$transaction(updates);

        res.json({ message: "List order updated" });
    } catch (err) {
        console.error("❌ Error reordering lists:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
