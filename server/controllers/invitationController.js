const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

// Mock transporter for now (log to console)
// In production, replace with real SMTP credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
    }
});

exports.sendInvitation = async (req, res) => {
    try {
        const { boardId, email } = req.body;
        const userId = req.user ? req.user.id : 1; // Fallback for dev

        if (!boardId || !email) {
            return res.status(400).json({ message: "Board ID and email are required" });
        }

        // Check if user is already a member
        const existingMember = await prisma.boardMember.findFirst({
            where: {
                boardId: parseInt(boardId),
                user: { email: email }
            }
        });

        if (existingMember) {
            return res.status(400).json({ message: "User is already a member of this board" });
        }

        // Create invitation
        const token = uuidv4();
        const invitation = await prisma.invitation.create({
            data: {
                email,
                boardId: parseInt(boardId),
                token
            },
            include: { board: true }
        });

        // Send email (Mock)
        const acceptLink = `https://project-management-app-tau-six.vercel.app/invite/${token}/accept`;
        const declineLink = `https://project-management-app-tau-six.vercel.app/invite/${token}/decline`;

        console.log(`
        [MOCK EMAIL] 
        To: ${email}
        Subject: Invitation to join ${existingMember ? '...' : 'project'}
        
        You have been invited to join the project.
        
        [ACCEPT BUTTON] -> ${acceptLink}
        [DECLINE BUTTON] -> ${declineLink}
        `);

        // In a real app, you would send the email here
        // await transporter.sendMail({ ... });

        res.status(201).json({ message: "Invitation sent successfully", invitation, acceptLink, declineLink });

    } catch (err) {
        console.error("Error sending invitation:", err);
        res.status(500).json({ message: "Failed to send invitation" });
    }
};

exports.getInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { board: true }
        });

        if (!invitation) {
            return res.status(404).json({ message: "Invalid invitation token" });
        }

        res.json(invitation);
    } catch (err) {
        console.error("Error fetching invitation:", err);
        res.status(500).json({ message: "Failed to fetch invitation" });
    }
};

exports.acceptInvitation = async (req, res) => {
    try {
        const { token, userId } = req.body;

        const invitation = await prisma.invitation.findUnique({
            where: { token }
        });

        if (!invitation || invitation.status !== 'pending') {
            return res.status(400).json({ message: "Invalid or expired invitation" });
        }

        // Add user to board
        await prisma.boardMember.create({
            data: {
                boardId: invitation.boardId,
                userId: parseInt(userId),
                role: 'member'
            }
        });

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'accepted' }
        });

        res.json({ message: "Invitation accepted", boardId: invitation.boardId });

    } catch (err) {
        console.error("Error accepting invitation:", err);
        res.status(500).json({ message: "Failed to accept invitation" });
    }
};

exports.declineInvitation = async (req, res) => {
    try {
        const { token } = req.body;

        const invitation = await prisma.invitation.findUnique({
            where: { token }
        });

        if (!invitation || invitation.status !== 'pending') {
            return res.status(400).json({ message: "Invalid or expired invitation" });
        }

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'declined' }
        });

        res.json({ message: "Invitation declined" });

    } catch (err) {
        console.error("Error declining invitation:", err);
        res.status(500).json({ message: "Failed to decline invitation" });
    }
};
