const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/**
 * CREATE LABEL
 * POST /api/labels/:boardId
 */
router.post("/:boardId", async (req, res) => {
    try {
        const { name, color } = req.body;

        const label = await prisma.label.create({
            data: {
                name,
                color,
                boardId: Number(req.params.boardId),
            },
        });

        res.json(label);
    } catch (err) {
        console.error("❌ Error creating label:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/:boardId", async (req, res) => {
    try {
        const { name, color } = req.body;

        const label = await prisma.label.create({
            data: {
                name,
                color,
                boardId: Number(req.params.boardId),
            },
        });

        res.json(label);
    } catch (err) {
        console.error("❌ Error creating label:", err);
        res.status(500).json({ message: "Server Error" });
    }
});


router.post("/assign", async (req, res) => {
    try {
        const { cardId, labelId } = req.body;

        const assigned = await prisma.cardLabel.create({
            data: { cardId, labelId }
        });

        res.json(assigned);
    } catch (err) {
        console.error("❌ Error assigning label:", err);
        res.status(500).json({ message: "Server Error" });
    }
});


/**
 * REMOVE LABEL FROM CARD
 * DELETE /api/labels/remove
 */
router.delete("/remove", async (req, res) => {
    try {
        const { cardId, labelId } = req.body;

        await prisma.cardLabel.deleteMany({
            where: { cardId, labelId }
        });

        res.json({ message: "Label removed" });
    } catch (err) {
        console.error("❌ Error removing label:", err);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
