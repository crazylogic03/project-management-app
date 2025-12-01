const express = require('express')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const router = express.Router();

/* ---------------- GET BOARDS ---------------- */
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

/* ---------------- GET SINGLE BOARD ---------------- */
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
                                comments: { include: { user: true } },
                                labels: { include: { label: true } },
                                attachments: true,
                                activity: { include: { user: true } },
                            },
                        },
                    },
                },

                labels: true,
                comments: { include: { user: true } },
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

/* ---------------- CREATE BOARD ---------------- */
router.post("/", async (req, res) => {
    try {
        const { title, description, userId, deadline, progress, status, template, organization } = req.body;

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

        // ✅ ACTIVITY LOG — BOARD CREATED
        await prisma.activity.create({
            data: {
                action: "CREATE_BOARD",
                message: `Created board "${board.title}"`,
                boardId: board.id,
                userId: Number(userId)
            }
        });

        // Default lists
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
                lists: { include: { cards: true } },
            },
        });

        res.status(201).json(fullBoard);
    } catch (err) {
        console.error("Error creating board:", err);
        res.status(500).json({ message: "Failed to create board" });
    }
});

/* ---------------- UPDATE BOARD ---------------- */
router.put("/:id", async (req, res) => {
    try {
        const boardId = Number(req.params.id);

        const updated = await prisma.board.update({
            where: { id: boardId },
            data: req.body
        });

        // ✅ ACTIVITY LOG — BOARD UPDATED
        await prisma.activity.create({
            data: {
                action: "UPDATE_BOARD",
                message: `Updated board "${updated.title}"`,
                boardId: updated.id,
                userId: updated.createdBy
            }
        });

        res.json(updated);
    } catch (err) {
        console.error("PUT /boards/:id error:", err);
        res.status(500).json({ message: "Failed to update board" });
    }
});

/* ---------------- DELETE BOARD ---------------- */
router.delete("/:id", async (req, res) => {
    try {
        const boardId = Number(req.params.id);

        const board = await prisma.board.findUnique({ where: { id: boardId } });

        await prisma.board.delete({
            where: { id: boardId },
        });

        // ✅ ACTIVITY LOG — BOARD DELETED
        await prisma.activity.create({
            data: {
                action: "DELETE_BOARD",
                message: `Deleted board "${board.title}"`,
                userId: board.createdBy
            }
        });

        res.json({ message: "Board deleted successfully" });
    } catch (err) {
        console.error("DELETE /boards/:id error:", err);
        res.status(500).json({ message: "Failed to delete board" });
    }
});

/* ---------------- ADD MEMBER TO BOARD ---------------- */
router.post("/:id/members", async (req, res) => {
    try {
        const boardId = Number(req.params.id);
        const { userId, role } = req.body;

        if (!userId) return res.status(400).json({ message: "User ID required" });

        // Check if already member
        const existing = await prisma.boardMember.findFirst({
            where: { boardId, userId: Number(userId) }
        });

        if (existing) {
            return res.status(400).json({ message: "User is already a member" });
        }

        const member = await prisma.boardMember.create({
            data: {
                boardId,
                userId: Number(userId),
                role: role || "viewer"
            },
            include: { user: true }
        });

        // ✅ ACTIVITY LOG — MEMBER ADDED
        await prisma.activity.create({
            data: {
                action: "ADD_MEMBER",
                message: `Added ${member.user.name} to the board`,
                boardId,
                userId: Number(userId) // The user who was added (or the adder? usually the adder, but simplified here)
            }
        });

        res.json(member);
    } catch (err) {
        console.error("POST /boards/:id/members error:", err);
        res.status(500).json({ message: "Failed to add member" });
    }
});

module.exports = router;
