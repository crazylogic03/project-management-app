const express = require('express')
const { PrismaClient, Prisma } = require("@prisma/client");
const { route } = require('./userRoutes');
const prisma = new PrismaClient()
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        let boards = await prisma.board.findMany({
            where: userId ? {
                OR: [
                    { createdBy: Number(userId) },
                    { members: { some: { userId: Number(userId) } } }
                ]
            } : {},
            include: {
                members: true,
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(boards);
    }
    catch (err) {
        console.error("GET /boards error:", err);
        res.status(500).json({ message: "Failed to fetch boards" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const boardId = Number(req.params.id);

        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profilePic: true,
                            },
                        },
                    },
                },

                lists: {
                    orderBy: { order: "asc" },
                    include: {
                        cards: {
                            orderBy: { order: "asc" },
                            include: {
                                comments: {
                                    include: { user: true },
                                },
                                labels: {
                                    include: {
                                        label: true,
                                    },
                                },
                                attachments: true,
                                activity: {
                                    include: { user: true },
                                },
                            },
                        },
                    },
                },

                labels: true,

                comments: {
                    include: { user: true },
                },

                activities: {
                    include: { user: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.json(board);

    } catch (err) {
        console.error("GET /boards/:id error:", err);
        res.status(500).json({ message: "Failed to fetch board" });
    }
});





router.post("/", async (req, res) => {
    try {
        const { title, description, userId, deadline, progress, status, template, organization } = req.body;

        // 1️⃣ Create board
        const board = await prisma.board.create({
            data: {
                title,
                description,
                organization,
                deadline: deadline ? new Date(deadline) : null,
                progress: progress ?? 0,
                status: status || "Not Started",
                template,
                createdBy: Number(userId),
                members: {
                    create: { userId: Number(userId), role: "owner" },
                },
            },
        });

        // 2️⃣ Create default lists
        const defaultLists = [
            { title: "To Do", order: 1 },
            { title: "In Progress", order: 2 },
            { title: "Done", order: 3 },
        ];

        for (const list of defaultLists) {
            await prisma.list.create({
                data: {
                    title: list.title,
                    order: list.order,
                    boardId: board.id,
                },
            });
        }

        const fullBoard = await prisma.board.findUnique({
            where: { id: board.id },
            include: {
                lists: {
                    include: { cards: true },
                },
            },
        });

        res.status(201).json(fullBoard);
    } catch (err) {
        console.error("Error creating board:", err);
        res.status(500).json({ message: "Failed to create board" });
    }
});





/*UPadte*/
router.put("/:id", async (req, res) => {
    try {
        const boardId = Number(req.params.id);
        const updated = await prisma.board.update({
            where: { id: boardId },
            data: req.body
        });

        res.json(updated);
    } catch (err) {
        console.error("PUT /boards/:id error:", err);
        res.status(500).json({ message: "Failed to update board" });
    }
});


//delete
router.delete("/:id", async (req, res) => {
    try {
        const boardId = Number(req.params.id);
        await prisma.board.delete({
            where: { id: boardId },
        });
        res.json({ message: "Board deleted successfully" });
    } catch (err) {
        console.error("DELETE /boards/:id error:", err);
        res.status(500).json({ message: "Failed to delete board" });
    }
});
module.exports = router;