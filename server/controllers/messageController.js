const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getMessages = async (req, res) => {
    try {
        const { projectId, recipientId, userId } = req.query;

        let where = {};
        if (projectId && projectId !== "global") {
            where.projectId = parseInt(projectId);
        } else if (recipientId && userId) {
            // Fetch DMs between two users
            where = {
                OR: [
                    { userId: parseInt(userId), recipientId: parseInt(recipientId) },
                    { userId: parseInt(recipientId), recipientId: parseInt(userId) }
                ]
            };
        } else {
            // Global chat (no project, no recipient)
            where = { projectId: null, recipientId: null };
        }

        const messages = await prisma.message.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, profilePic: true }
                }
            },
            orderBy: { createdAt: "asc" }
        });

        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Server error fetching messages" });
    }
};
