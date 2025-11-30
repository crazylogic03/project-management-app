const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();


// ✅ Get all events
router.get("/", async (req, res) => {
    const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
    res.json(events);
});


// ✅ Create new event
router.post("/", async (req, res) => {
    const event = await prisma.event.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            date: new Date(`${req.body.date}T${req.body.time}`),
            type: req.body.type,
            priority: req.body.priority,
            project: req.body.project,
            assignee: req.body.assignee,
            reminder: Number(req.body.reminder)
        }
    });

    res.json(event);
});


// ✅ Update date on drag drop
router.patch("/:id/date", async (req, res) => {
    const event = await prisma.event.update({
        where: { id: Number(req.params.id) },
        data: {
            date: new Date(req.body.date),
            notified: false
        },
    });

    res.json(event);
});

module.exports = router;
