const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

/**
 * ADD COMMENT
 * POST /api/comments/:cardId
 */
router.post("/:cardId", async (req, res) => {
    try {
        const { content, userId, boardId } = req.body;

        const comment = await prisma.comment.create({
            data: {
                content,
                userId,
                boardId,
                cardId: Number(req.params.cardId),
            },
            include: { user: true }
        });

        res.json(comment);
    } catch (err) {
        console.error("❌ Error adding comment:", err);
        res.status(500).json({ message: "Server Error" });
    }
});


/**
 * DELETE COMMENT
 * DELETE /api/comments/:commentId
 */
router.delete("/:commentId", async (req, res) => {
    try {
        await prisma.comment.delete({
            where: { id: Number(req.params.commentId) }
        });

        res.json({ message: "Comment deleted" });
    } catch (err) {
        console.error("❌ Error deleting comment:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
