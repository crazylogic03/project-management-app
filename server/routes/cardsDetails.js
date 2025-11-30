const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.get("/:cardId", async (req, res) => {
    try {
        const card = await prisma.card.findUnique({
            where: { id: Number(req.params.cardId) },
            include: {
                comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
                labels: { include: { label: true } },
            }
        });

        res.json(card);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching card details" });
    }
});

module.exports = router;
