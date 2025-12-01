const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const router = express.Router();


/* ✅ GET USER SETTINGS */
router.get("/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                country: true,
                city: true,
                zipCode: true,
                profilePic: true,
                notifications: true,
                preferences: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (err) {
        console.error("GET SETTINGS ERROR:", err);
        res.status(500).json({ message: "Failed to load settings" });
    }
});


/* ✅ UPDATE USER SETTINGS */
router.put("/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const {
            name,
            phone,
            country,
            city,
            zipCode,
            profilePic,
            notifications,
            preferences,
            password
        } = req.body;

        const data = {
            name,
            phone,
            country,
            city,
            zipCode,
            profilePic,
            notifications,
            preferences
        };

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            data.password = hash;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data
        });

        res.json({ success: true, user: updatedUser });

    } catch (err) {
        console.error("UPDATE SETTINGS ERROR:", err);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});

module.exports = router;